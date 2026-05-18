CREATE DATABASE IF NOT EXISTS saocamilo_nutri_esportiva
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE saocamilo_nutri_esportiva;

-- 1 PERFIS DE USUÁRIO

CREATE TABLE perfis (
  id_perfil     TINYINT      UNSIGNED NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(30)  NOT NULL,         
  descricao     VARCHAR(120) NOT NULL,
  PRIMARY KEY (id_perfil),
  UNIQUE KEY uq_perfil_nome (nome)
) ENGINE=InnoDB COMMENT='Perfis de acesso ao sistema (RBAC)';

INSERT INTO perfis (nome, descricao) VALUES
  ('ATLETA',        'Usuário final. Insere dados de pesagem, ingestão e treino.'),
  ('NUTRICIONISTA', 'Analista principal. Valida estratégias de hidratação e monitora atletas.'),
  ('TREINADOR',     'Acompanha impacto da hidratação na carga de treino.'),
  ('MEDICO',        'Médico do esporte. Acesso completo ao histórico de saúde.'),
  ('ADMIN',         'Administrador do sistema. Gerencia contas e configurações.');

-- 2 USUÁRIOS

CREATE TABLE usuarios (
  id_usuario          BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_perfil           TINYINT      UNSIGNED NOT NULL,
  nome_completo       VARCHAR(120) NOT NULL,
  email               VARCHAR(150) NOT NULL,
  senha_hash          VARCHAR(255) NOT NULL    COMMENT 'bcrypt hash — nunca armazenar em texto plano',
  data_nascimento     DATE         NOT NULL,
  genero              ENUM('MASCULINO','FEMININO','NAO_BINARIO','PREFIRO_NAO_INFORMAR') NOT NULL,
  foto_perfil_url     VARCHAR(300) NULL,
  telefone            VARCHAR(20)  NULL,
  consentimento_lgpd  TINYINT(1)   NOT NULL DEFAULT 0  COMMENT 'RF-RNF06: aceite dos termos LGPD',
  data_consentimento  DATETIME     NULL,
  ativo               TINYINT(1)   NOT NULL DEFAULT 1,
  criado_em           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_email (email),
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (id_perfil) REFERENCES perfis (id_perfil)
) ENGINE=InnoDB COMMENT='Todos os usuários do sistema (atletas, nutricionistas, etc.)';

-- 3 ENDEREÇOS

CREATE TABLE enderecos (
  id_endereco   BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario    BIGINT       UNSIGNED NOT NULL,
  logradouro    VARCHAR(150) NOT NULL,
  numero        VARCHAR(10)  NOT NULL,
  complemento   VARCHAR(60)  NULL,
  bairro        VARCHAR(80)  NOT NULL,
  cidade        VARCHAR(80)  NOT NULL,
  estado        CHAR(2)      NOT NULL,
  cep           VARCHAR(9)   NOT NULL,
  latitude      DECIMAL(9,6) NULL    COMMENT 'Para integração com API de clima (RF03)',
  longitude     DECIMAL(9,6) NULL,
  PRIMARY KEY (id_endereco),
  CONSTRAINT fk_endereco_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Endereços dos usuários — latitude/longitude para API de clima';

-- 4 PERFIL CLÍNICO DO ATLETA

CREATE TABLE perfis_atleticos (
  id_perfil_atletico  BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario          BIGINT          UNSIGNED NOT NULL,
  modalidade          VARCHAR(80)     NOT NULL  COMMENT 'Ex: Futebol, Natação, Atletismo...',
  nivel               ENUM('INICIANTE','INTERMEDIARIO','AVANCADO','PROFISSIONAL') NOT NULL DEFAULT 'INICIANTE',
  altura_cm           DECIMAL(5,2)    NOT NULL  COMMENT 'Altura em centímetros',
  peso_habitual_kg    DECIMAL(6,2)    NOT NULL  COMMENT 'Peso usual de referência (duas casas decimais — RNF07)',
  condicao_medica     TEXT            NULL      COMMENT 'Condições relevantes (hipertensão, diabetes, etc.)',
  observacoes         TEXT            NULL,
  criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_perfil_atletico),
  UNIQUE KEY uq_perfil_atletico_usuario (id_usuario),
  CONSTRAINT fk_perfil_atletico_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Dados físicos e esportivos do atleta';

-- 5 VÍNCULO NUTRICIONISTA

CREATE TABLE vinculos_profissional_atleta (
  id_vinculo          BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nutricionista    BIGINT       UNSIGNED NOT NULL,
  id_atleta           BIGINT       UNSIGNED NOT NULL,
  data_inicio         DATE         NOT NULL DEFAULT (CURRENT_DATE),
  data_fim            DATE         NULL      COMMENT 'NULL = vínculo ativo',
  ativo               TINYINT(1)   NOT NULL DEFAULT 1,
  criado_em           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_vinculo),
  UNIQUE KEY uq_vinculo_ativo (id_nutricionista, id_atleta, data_inicio),
  CONSTRAINT fk_vinculo_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_vinculo_atleta        FOREIGN KEY (id_atleta)        REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Associação entre nutricionistas/treinadores e atletas';

-- 6 TIPOS DE EXERCÍCIO

CREATE TABLE tipos_exercicio (
  id_tipo_exercicio   SMALLINT     UNSIGNED NOT NULL AUTO_INCREMENT,
  nome                VARCHAR(80)  NOT NULL,
  descricao           VARCHAR(200) NULL,
  categoria           ENUM('AEROBICO','ANAEROBICO','MISTO','FLEXIBILIDADE','OUTRO') NOT NULL DEFAULT 'MISTO',
  PRIMARY KEY (id_tipo_exercicio),
  UNIQUE KEY uq_tipo_exercicio_nome (nome)
) ENGINE=InnoDB COMMENT='Catálogo de tipos de exercício';

INSERT INTO tipos_exercicio (nome, categoria) VALUES
  ('Futebol',          'MISTO'),
  ('Natação',          'AEROBICO'),
  ('Corrida',          'AEROBICO'),
  ('Ciclismo',         'AEROBICO'),
  ('Musculação',       'ANAEROBICO'),
  ('Basquete',         'MISTO'),
  ('Vôlei',            'MISTO'),
  ('Tênis',            'MISTO'),
  ('Artes Marciais',   'MISTO'),
  ('Yoga/Pilates',     'FLEXIBILIDADE');

-- 7 CRONOGRAMA DE TREINOS DO ATLETA

CREATE TABLE cronogramas_treino (
  id_cronograma       BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario          BIGINT       UNSIGNED NOT NULL,
  id_tipo_exercicio   SMALLINT     UNSIGNED NOT NULL,
  dia_semana          TINYINT      UNSIGNED NOT NULL COMMENT '0=Dom, 1=Seg, ..., 6=Sab',
  horario_inicio      TIME         NOT NULL,
  duracao_minutos     SMALLINT     UNSIGNED NOT NULL,
  local_treino        VARCHAR(120) NULL,
  ativo               TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id_cronograma),
  CONSTRAINT fk_cronograma_usuario   FOREIGN KEY (id_usuario)          REFERENCES usuarios (id_usuario)          ON DELETE CASCADE,
  CONSTRAINT fk_cronograma_exercicio FOREIGN KEY (id_tipo_exercicio)   REFERENCES tipos_exercicio (id_tipo_exercicio),
  CONSTRAINT ck_dia_semana           CHECK (dia_semana BETWEEN 0 AND 6)
) ENGINE=InnoDB COMMENT='Agenda semanal de treinos do atleta';

-- 8 DADOS CLIMÁTICOS

CREATE TABLE dados_climaticos (
  id_clima        BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  latitude        DECIMAL(9,6)    NOT NULL,
  longitude       DECIMAL(9,6)    NOT NULL,
  cidade          VARCHAR(80)     NOT NULL,
  estado          VARCHAR(80)     NULL,
  pais            CHAR(2)         NOT NULL DEFAULT 'BR',
  temperatura_c   DECIMAL(5,2)    NOT NULL  COMMENT 'Temperatura em graus Celsius',
  umidade_pct     DECIMAL(5,2)    NOT NULL  COMMENT 'Umidade relativa em %',
  sensacao_termica_c DECIMAL(5,2) NULL,
  vento_kmh       DECIMAL(6,2)    NULL,
  condicao        VARCHAR(80)     NULL      COMMENT 'Ex: Ensolarado, Nublado, Chuvoso',
  indice_calor    DECIMAL(5,2)    NULL      COMMENT 'Índice de calor calculado',
  capturado_em    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fonte_api       VARCHAR(50)     NOT NULL DEFAULT 'OpenWeatherMap',
  PRIMARY KEY (id_clima),
  INDEX idx_clima_localizacao (latitude, longitude),
  INDEX idx_clima_capturado_em (capturado_em)
) ENGINE=InnoDB COMMENT='Dados climáticos coletados via API externa (RF03)';

-- 9 SESSÕES DE TREINO

CREATE TABLE sessoes_treino (
  id_sessao           BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario          BIGINT          UNSIGNED NOT NULL,
  id_tipo_exercicio   SMALLINT        UNSIGNED NOT NULL,
  id_clima            BIGINT          UNSIGNED NULL      COMMENT 'Clima no momento do treino (RF03)',
  data_treino         DATE            NOT NULL,
  hora_inicio         TIME            NOT NULL,
  hora_fim            TIME            NULL,
  duracao_minutos     SMALLINT        UNSIGNED NULL      COMMENT 'Calculado automaticamente',
  intensidade         ENUM('LEVE','MODERADA','INTENSA','MAXIMA') NOT NULL DEFAULT 'MODERADA',
  local_treino        VARCHAR(150)    NULL,
  latitude            DECIMAL(9,6)    NULL,
  longitude           DECIMAL(9,6)    NULL,
  observacoes         TEXT            NULL,
  validado_nutricionista TINYINT(1)   NOT NULL DEFAULT 0,
  id_nutricionista_validador BIGINT   UNSIGNED NULL,
  criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_sessao),
  INDEX idx_sessao_usuario      (id_usuario),
  INDEX idx_sessao_data         (data_treino),
  INDEX idx_sessao_usuario_data (id_usuario, data_treino),
  CONSTRAINT fk_sessao_usuario      FOREIGN KEY (id_usuario)          REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_sessao_exercicio    FOREIGN KEY (id_tipo_exercicio)   REFERENCES tipos_exercicio (id_tipo_exercicio),
  CONSTRAINT fk_sessao_clima        FOREIGN KEY (id_clima)            REFERENCES dados_climaticos (id_clima),
  CONSTRAINT fk_sessao_nutricionista FOREIGN KEY (id_nutricionista_validador) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Registro de cada sessão de treino do atleta';

-- 10 PESAGENS

CREATE TABLE pesagens (
  id_pesagem          BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao           BIGINT          UNSIGNED NOT NULL,
  momento             ENUM('PRE','POS') NOT NULL         COMMENT 'Antes ou após o treino',
  massa_kg            DECIMAL(6,2)    NOT NULL            COMMENT 'Obrigatório duas casas decimais (RNF07)',
  confirmou_sem_tenis TINYINT(1)      NOT NULL DEFAULT 0  COMMENT 'RF08 — lembrete de acessórios',
  confirmou_sem_acessorios TINYINT(1) NOT NULL DEFAULT 0,
  confirmou_bexiga_vazia   TINYINT(1) NOT NULL DEFAULT 0,
  horario_pesagem     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacoes         VARCHAR(300)    NULL,
  PRIMARY KEY (id_pesagem),
  UNIQUE KEY uq_pesagem_sessao_momento (id_sessao, momento),
  CONSTRAINT fk_pesagem_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Registro de massa corporal pré/pós treino (RF02, RF08, RNF07)';

-- 11 REGISTRO DE INGESTÃO DE FLUIDOS

CREATE TABLE ingestao_fluidos (
  id_ingestao         BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao           BIGINT          UNSIGNED NOT NULL,
  momento             ENUM('PRE','DURANTE','POS') NOT NULL,
  tipo_fluido         ENUM('AGUA','ISOTONICO','REPOSITOR_ELETROLITOS','SUCO','OUTRO') NOT NULL DEFAULT 'AGUA',
  descricao_fluido    VARCHAR(80)     NULL      COMMENT 'Detalhe quando tipo = OUTRO',
  volume_ml           DECIMAL(8,2)    NOT NULL  COMMENT 'Volume em mililitros (duas casas decimais — RNF07)',
  horario_ingestao    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_ingestao),
  INDEX idx_ingestao_sessao (id_sessao),
  CONSTRAINT fk_ingestao_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Consumo de fluidos em cada etapa do treino (RF01)';

-- 12 VOLUME URINÁRIO

CREATE TABLE volumes_urinarios (
  id_volume_urinario  BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao           BIGINT          UNSIGNED NOT NULL,
  volume_ml           DECIMAL(8,2)    NOT NULL  COMMENT 'Volume urinário em mL (duas casas decimais)',
  horario_registro    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_volume_urinario),
  CONSTRAINT fk_volume_urinario_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Volume urinário para cálculo ajustado da taxa de sudorese (RF01)';

-- 13 CÁLCULOS DE HIDRATAÇÃO

CREATE TABLE calculos_hidratacao (
  id_calculo              BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao               BIGINT          UNSIGNED NOT NULL,
  -- Dados brutos usados no cálculo
  massa_pre_kg            DECIMAL(6,2)    NOT NULL,
  massa_pos_kg            DECIMAL(6,2)    NOT NULL,
  total_ingestao_ml       DECIMAL(10,2)   NOT NULL  COMMENT 'Soma de toda ingestão',
  total_urinario_ml       DECIMAL(10,2)   NOT NULL  DEFAULT 0,
  duracao_horas           DECIMAL(5,2)    NOT NULL  COMMENT 'Duração real do treino em horas',
  -- Resultados calculados
  variacao_massa_kg       DECIMAL(6,2)    NOT NULL  COMMENT 'massa_pre - massa_pos',
  perda_percentual_massa  DECIMAL(5,2)    NOT NULL  COMMENT '% de perda de massa corporal',
  taxa_sudorese_lh        DECIMAL(6,2)    NOT NULL  COMMENT 'Taxa de Sudorese em L/h',
  balanco_hidrico_ml      DECIMAL(10,2)   NOT NULL  COMMENT 'Balanço hídrico total em mL',
  -- Classificação de risco
  nivel_desidratacao      ENUM('HIDRATADO','LEVE','MODERADA','SEVERA','CRITICA') NOT NULL,
  risco_hiponatremia      TINYINT(1)      NOT NULL DEFAULT 0  COMMENT 'Risco de hiper-hidratação',
  -- Recomendação gerada
  recomendacao_reposicao_ml DECIMAL(10,2) NULL      COMMENT 'Volume sugerido para reposição',
  -- Metadados
  calculado_em            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  versao_algoritmo        VARCHAR(10)     NOT NULL DEFAULT '1.0',
  PRIMARY KEY (id_calculo),
  UNIQUE KEY uq_calculo_sessao (id_sessao),
  INDEX idx_calculo_nivel (nivel_desidratacao),
  CONSTRAINT fk_calculo_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Resultados do motor de cálculo da Taxa de Sudorese (RF01, RNF05)';

-- 14 ALERTAS DE RISCO

CREATE TABLE alertas (
  id_alerta       BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario      BIGINT       UNSIGNED NOT NULL,
  id_sessao       BIGINT       UNSIGNED NULL,
  id_calculo      BIGINT       UNSIGNED NULL,
  tipo_alerta     ENUM(
    'DESIDRATACAO_SEVERA',
    'DESIDRATACAO_CRITICA',
    'RISCO_HIPONATREMIA',
    'PERDA_MASSA_ELEVADA',
    'LEMBRETE_PESAGEM',
    'SUPORTE_TECNICO'
  ) NOT NULL,
  mensagem        TEXT         NOT NULL,
  nivel_urgencia  ENUM('INFO','ATENCAO','URGENTE','CRITICO') NOT NULL DEFAULT 'ATENCAO',
  lido            TINYINT(1)   NOT NULL DEFAULT 0,
  lido_em         DATETIME     NULL,
  enviado_push    TINYINT(1)   NOT NULL DEFAULT 0,
  criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_alerta),
  INDEX idx_alerta_usuario (id_usuario),
  INDEX idx_alerta_lido    (id_usuario, lido),
  CONSTRAINT fk_alerta_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_alerta_sessao  FOREIGN KEY (id_sessao)  REFERENCES sessoes_treino (id_sessao),
  CONSTRAINT fk_alerta_calculo FOREIGN KEY (id_calculo) REFERENCES calculos_hidratacao (id_calculo)
) ENGINE=InnoDB COMMENT='Alertas de risco gerados pelo sistema (RF04)';

-- 15 ESCALA DE COR DE URINA

CREATE TABLE registros_cor_urina (
  id_registro_urina   BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao           BIGINT       UNSIGNED NOT NULL,
  momento             ENUM('PRE','POS') NOT NULL,
  escala_cor          TINYINT      UNSIGNED NOT NULL COMMENT 'Escala Armstrong: 1 (clara) a 8 (âmbar escuro)',
  descricao_cor       VARCHAR(50)  NULL,
  horario_registro    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_registro_urina),
  CONSTRAINT fk_cor_urina_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE,
  CONSTRAINT ck_escala_cor CHECK (escala_cor BETWEEN 1 AND 8)
) ENGINE=InnoDB COMMENT='Escala visual de cor de urina (Armstrong) — RF06';

-- 16 QUESTIONÁRIO DE TRIAGEM

CREATE TABLE triagens (
  id_triagem          BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao           BIGINT       UNSIGNED NOT NULL,
  -- Indicadores de suor salgado
  marca_branca_roupa  TINYINT(1)   NOT NULL DEFAULT 0  COMMENT 'Deixa marca branca na roupa?',
  irritacao_ocular    TINYINT(1)   NOT NULL DEFAULT 0  COMMENT 'Suor irrita os olhos?',
  gosto_salgado_labios TINYINT(1)  NOT NULL DEFAULT 0  COMMENT 'Sente gosto salgado nos lábios?',
  -- Sinais de fadiga / cãibra
  sensacao_sede       TINYINT(1)   NOT NULL DEFAULT 0,
  dor_cabeca          TINYINT(1)   NOT NULL DEFAULT 0,
  cansaco_excessivo   TINYINT(1)   NOT NULL DEFAULT 0,
  tontura             TINYINT(1)   NOT NULL DEFAULT 0,
  caibras             TINYINT(1)   NOT NULL DEFAULT 0,
  nausea              TINYINT(1)   NOT NULL DEFAULT 0,
  -- Escala de Esforço Percebido
  escala_borg         TINYINT      UNSIGNED NULL COMMENT 'Escala de Borg: 6 a 20',
  observacoes_livres  TEXT         NULL,
  criado_em           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_triagem),
  UNIQUE KEY uq_triagem_sessao (id_sessao),
  CONSTRAINT fk_triagem_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE,
  CONSTRAINT ck_escala_borg CHECK (escala_borg BETWEEN 6 AND 20)
) ENGINE=InnoDB COMMENT='Questionário qualitativo de triagem — suor salgado e fadiga (RF06)';

-- 17 ESTRATÉGIAS DE HIDRATAÇÃO

CREATE TABLE estrategias_hidratacao (
  id_estrategia       BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nutricionista    BIGINT          UNSIGNED NOT NULL,
  id_atleta           BIGINT          UNSIGNED NOT NULL,
  titulo              VARCHAR(120)    NOT NULL,
  descricao           TEXT            NOT NULL,
  volume_pre_ml       DECIMAL(8,2)    NULL  COMMENT 'Volume recomendado pré-treino',
  volume_durante_ml_h DECIMAL(8,2)    NULL  COMMENT 'Volume recomendado por hora durante treino',
  volume_pos_ml       DECIMAL(8,2)    NULL  COMMENT 'Volume recomendado pós-treino',
  tipo_fluido_recom   VARCHAR(80)     NULL,
  eletrólitos_recom   TEXT            NULL,
  valida_ate          DATE            NULL,
  ativa               TINYINT(1)      NOT NULL DEFAULT 1,
  criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_estrategia),
  INDEX idx_estrategia_atleta (id_atleta),
  CONSTRAINT fk_estrategia_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_estrategia_atleta        FOREIGN KEY (id_atleta)        REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Estratégias personalizadas de hidratação criadas pelos nutricionistas (RF09)';

-- 18 ANÁLISE SAZONAL / LONGITUDINAL

CREATE TABLE analises_sazonais (
  id_analise          BIGINT          UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nutricionista    BIGINT          UNSIGNED NOT NULL,
  id_atleta           BIGINT          UNSIGNED NOT NULL,
  periodo_inicio      DATE            NOT NULL,
  periodo_fim         DATE            NOT NULL,
  total_sessoes       SMALLINT        UNSIGNED NOT NULL DEFAULT 0,
  media_taxa_sudorese DECIMAL(6,2)    NULL  COMMENT 'Média de L/h no período',
  media_perda_massa   DECIMAL(5,2)    NULL  COMMENT 'Média de % de perda no período',
  temp_media_c        DECIMAL(5,2)    NULL,
  umidade_media_pct   DECIMAL(5,2)    NULL,
  incidencia_desidratacao_pct DECIMAL(5,2) NULL,
  observacoes         TEXT            NULL,
  gerado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_analise),
  INDEX idx_analise_atleta  (id_atleta),
  INDEX idx_analise_periodo (periodo_inicio, periodo_fim),
  CONSTRAINT fk_analise_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_analise_atleta        FOREIGN KEY (id_atleta)        REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Análises longitudinais e sazonais por atleta (RF03, RF05)';

-- 19 RELATÓRIOS EXPORTADOS

CREATE TABLE relatorios (
  id_relatorio        BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_solicitante      BIGINT       UNSIGNED NOT NULL,
  id_atleta           BIGINT       UNSIGNED NOT NULL,
  tipo_relatorio      ENUM('SESSAO','MENSAL','SAZONAL','COMPLETO') NOT NULL,
  formato             ENUM('PDF','CSV','XLSX') NOT NULL,
  periodo_inicio      DATE         NOT NULL,
  periodo_fim         DATE         NOT NULL,
  url_arquivo         VARCHAR(500) NULL      COMMENT 'URL do arquivo gerado no storage',
  status              ENUM('PENDENTE','PROCESSANDO','CONCLUIDO','ERRO') NOT NULL DEFAULT 'PENDENTE',
  erro_mensagem       TEXT         NULL,
  gerado_em           DATETIME     NULL,
  criado_em           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_relatorio),
  INDEX idx_relatorio_atleta (id_atleta),
  CONSTRAINT fk_relatorio_solicitante FOREIGN KEY (id_solicitante) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_relatorio_atleta      FOREIGN KEY (id_atleta)      REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Registro dos relatórios exportados em PDF/CSV/XLSX (RF05)';

-- 20.SUPORTE / TICKETS

CREATE TABLE tickets_suporte (
  id_ticket       BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario      BIGINT       UNSIGNED NOT NULL,
  assunto         VARCHAR(150) NOT NULL,
  mensagem        TEXT         NOT NULL,
  categoria       ENUM('BUG','DUVIDA_PROTOCOLO','DUVIDA_APP','SOLICITACAO','OUTRO') NOT NULL DEFAULT 'DUVIDA_APP',
  status          ENUM('ABERTO','EM_ANALISE','RESPONDIDO','FECHADO') NOT NULL DEFAULT 'ABERTO',
  prioridade      ENUM('BAIXA','MEDIA','ALTA') NOT NULL DEFAULT 'MEDIA',
  respondido_por  BIGINT       UNSIGNED NULL,
  resposta        TEXT         NULL,
  aberto_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  respondido_em   DATETIME     NULL,
  fechado_em      DATETIME     NULL,
  PRIMARY KEY (id_ticket),
  INDEX idx_ticket_usuario (id_usuario),
  INDEX idx_ticket_status  (status),
  CONSTRAINT fk_ticket_usuario        FOREIGN KEY (id_usuario)     REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_ticket_respondido_por FOREIGN KEY (respondido_por) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Canal de suporte para dúvidas e problemas técnicos (RF10)';

-- 21 LOG DE AUDITORIA

CREATE TABLE logs_auditoria (
  id_log          BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario      BIGINT       UNSIGNED NULL     COMMENT 'NULL se ação anônima (ex: login falho)',
  acao            VARCHAR(80)  NOT NULL           COMMENT 'Ex: LOGIN, LOGOUT, CALCULO_REALIZADO, DADOS_EDITADOS',
  tabela_afetada  VARCHAR(60)  NULL,
  id_registro     BIGINT       UNSIGNED NULL,
  dados_anteriores JSON        NULL               COMMENT 'Snapshot do dado antes da alteração',
  dados_novos     JSON         NULL               COMMENT 'Snapshot do dado após a alteração',
  ip_origem       VARCHAR(45)  NULL               COMMENT 'IPv4 ou IPv6',
  user_agent      VARCHAR(300) NULL,
  criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_log),
  INDEX idx_log_usuario   (id_usuario),
  INDEX idx_log_acao      (acao),
  INDEX idx_log_criado_em (criado_em),
  CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Log de auditoria de todas as ações sensíveis (RNF02, LGPD)';

-- 22 SESSÕES DE AUTENTICAÇÃO

CREATE TABLE sessoes_autenticacao (
  id_sessao_auth  BIGINT       UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario      BIGINT       UNSIGNED NOT NULL,
  token_hash      VARCHAR(255) NOT NULL   COMMENT 'Hash do JWT/refresh token',
  dispositivo     VARCHAR(150) NULL       COMMENT 'Ex: iPhone 14, Android Samsung',
  plataforma      ENUM('IOS','ANDROID','WEB') NOT NULL,
  ip_origem       VARCHAR(45)  NULL,
  criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_em       DATETIME     NOT NULL,
  revogado        TINYINT(1)   NOT NULL DEFAULT 0,
  revogado_em     DATETIME     NULL,
  PRIMARY KEY (id_sessao_auth),
  INDEX idx_sessao_auth_usuario (id_usuario),
  INDEX idx_sessao_auth_token   (token_hash),
  CONSTRAINT fk_sessao_auth_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Controle de sessões e tokens de autenticação (RF11, RNF02)';

-- View: resumo da última sessão de cada atleta
CREATE OR REPLACE VIEW vw_ultima_sessao_atleta AS
SELECT
  u.id_usuario,
  u.nome_completo,
  s.id_sessao,
  s.data_treino,
  te.nome           AS tipo_exercicio,
  c.taxa_sudorese_lh,
  c.perda_percentual_massa,
  c.nivel_desidratacao,
  c.balanco_hidrico_ml
FROM usuarios u
JOIN sessoes_treino s         ON s.id_usuario = u.id_usuario
JOIN tipos_exercicio te       ON te.id_tipo_exercicio = s.id_tipo_exercicio
LEFT JOIN calculos_hidratacao c ON c.id_sessao = s.id_sessao
WHERE s.data_treino = (
  SELECT MAX(s2.data_treino)
  FROM sessoes_treino s2
  WHERE s2.id_usuario = u.id_usuario
)
AND u.id_perfil = (SELECT id_perfil FROM perfis WHERE nome = 'ATLETA');


-- View: atletas em risco
CREATE OR REPLACE VIEW vw_atletas_em_risco AS
SELECT
  u.id_usuario,
  u.nome_completo,
  u.email,
  s.id_sessao,
  s.data_treino,
  c.taxa_sudorese_lh,
  c.perda_percentual_massa,
  c.nivel_desidratacao,
  c.risco_hiponatremia
FROM usuarios u
JOIN sessoes_treino s          ON s.id_usuario = u.id_usuario
JOIN calculos_hidratacao c     ON c.id_sessao  = s.id_sessao
WHERE c.nivel_desidratacao IN ('SEVERA', 'CRITICA')
   OR c.risco_hiponatremia = 1
ORDER BY s.data_treino DESC;


-- View: histórico completo de hidratação por atleta
CREATE OR REPLACE VIEW vw_historico_hidratacao AS
SELECT
  u.id_usuario,
  u.nome_completo,
  s.data_treino,
  MONTHNAME(s.data_treino)  AS mes,
  YEAR(s.data_treino)       AS ano,
  te.nome                   AS exercicio,
  dc.temperatura_c,
  dc.umidade_pct,
  c.massa_pre_kg,
  c.massa_pos_kg,
  c.variacao_massa_kg,
  c.perda_percentual_massa,
  c.taxa_sudorese_lh,
  c.balanco_hidrico_ml,
  c.total_ingestao_ml,
  c.nivel_desidratacao
FROM usuarios u
JOIN sessoes_treino s          ON s.id_usuario          = u.id_usuario
JOIN tipos_exercicio te        ON te.id_tipo_exercicio   = s.id_tipo_exercicio
LEFT JOIN dados_climaticos dc  ON dc.id_clima            = s.id_clima
LEFT JOIN calculos_hidratacao c ON c.id_sessao           = s.id_sessao
ORDER BY u.id_usuario, s.data_treino DESC;

-- Fórmula: TS (L/h) = ((MassaPre - MassaPos + IngestaoTotal - VolumeUrinario) / DuracaoH)

DELIMITER $$

CREATE PROCEDURE sp_calcular_hidratacao(IN p_id_sessao BIGINT UNSIGNED)
BEGIN
  DECLARE v_massa_pre         DECIMAL(6,2);
  DECLARE v_massa_pos         DECIMAL(6,2);
  DECLARE v_ingestao_total    DECIMAL(10,2);
  DECLARE v_volume_urinario   DECIMAL(10,2);
  DECLARE v_duracao_horas     DECIMAL(5,2);
  DECLARE v_variacao_massa    DECIMAL(6,2);
  DECLARE v_perda_pct         DECIMAL(5,2);
  DECLARE v_taxa_sudorese     DECIMAL(6,2);
  DECLARE v_balanco_hidrico   DECIMAL(10,2);
  DECLARE v_nivel_desid       VARCHAR(20);
  DECLARE v_risco_hipona      TINYINT;
  DECLARE v_reposicao_ml      DECIMAL(10,2);

  -- Buscar pesagens
  SELECT
    MAX(CASE WHEN momento = 'PRE' THEN massa_kg END),
    MAX(CASE WHEN momento = 'POS' THEN massa_kg END)
  INTO v_massa_pre, v_massa_pos
  FROM pesagens
  WHERE id_sessao = p_id_sessao;

  -- Buscar ingestão total
  SELECT COALESCE(SUM(volume_ml), 0)
  INTO v_ingestao_total
  FROM ingestao_fluidos
  WHERE id_sessao = p_id_sessao;

  -- Buscar volume urinário
  SELECT COALESCE(SUM(volume_ml), 0)
  INTO v_volume_urinario
  FROM volumes_urinarios
  WHERE id_sessao = p_id_sessao;

  -- Buscar duração em horas
  SELECT COALESCE(duracao_minutos / 60.0, 1)
  INTO v_duracao_horas
  FROM sessoes_treino
  WHERE id_sessao = p_id_sessao;

  -- Calcular variação de massa
  SET v_variacao_massa  = ROUND(v_massa_pre - v_massa_pos, 2);

  -- Calcular % de perda de massa
  SET v_perda_pct = ROUND((v_variacao_massa / v_massa_pre) * 100, 2);

  -- Calcular Taxa de Sudorese
  SET v_taxa_sudorese = ROUND(
    ((v_variacao_massa * 1000) + v_ingestao_total - v_volume_urinario) / (v_duracao_horas * 1000),
    2
  );

  -- Calcular balanço hídrico
  SET v_balanco_hidrico = ROUND(
    v_ingestao_total - (v_variacao_massa * 1000) - v_volume_urinario,
    2
  );

  -- Classificar nível de desidratação pela % de perda de massa
  SET v_nivel_desid = CASE
    WHEN v_perda_pct < 1.0  THEN 'HIDRATADO'
    WHEN v_perda_pct < 2.0  THEN 'LEVE'
    WHEN v_perda_pct < 3.0  THEN 'MODERADA'
    WHEN v_perda_pct < 5.0  THEN 'SEVERA'
    ELSE                         'CRITICA'
  END;

  -- Risco de hiponatremia
  SET v_risco_hipona = IF(v_variacao_massa < -0.5 OR v_balanco_hidrico > 1500, 1, 0);

  -- Recomendação de reposição: 150% da perda
  SET v_reposicao_ml = ROUND((v_variacao_massa * 1000) * 1.5, 2);

  -- Inserir ou atualizar resultado
  INSERT INTO calculos_hidratacao (
    id_sessao, massa_pre_kg, massa_pos_kg, total_ingestao_ml, total_urinario_ml,
    duracao_horas, variacao_massa_kg, perda_percentual_massa, taxa_sudorese_lh,
    balanco_hidrico_ml, nivel_desidratacao, risco_hiponatremia, recomendacao_reposicao_ml
  ) VALUES (
    p_id_sessao, v_massa_pre, v_massa_pos, v_ingestao_total, v_volume_urinario,
    v_duracao_horas, v_variacao_massa, v_perda_pct, v_taxa_sudorese,
    v_balanco_hidrico, v_nivel_desid, v_risco_hipona, v_reposicao_ml
  )
  ON DUPLICATE KEY UPDATE
    massa_pre_kg              = v_massa_pre,
    massa_pos_kg              = v_massa_pos,
    total_ingestao_ml         = v_ingestao_total,
    total_urinario_ml         = v_volume_urinario,
    duracao_horas             = v_duracao_horas,
    variacao_massa_kg         = v_variacao_massa,
    perda_percentual_massa    = v_perda_pct,
    taxa_sudorese_lh          = v_taxa_sudorese,
    balanco_hidrico_ml        = v_balanco_hidrico,
    nivel_desidratacao        = v_nivel_desid,
    risco_hiponatremia        = v_risco_hipona,
    recomendacao_reposicao_ml = v_reposicao_ml,
    calculado_em              = CURRENT_TIMESTAMP;

  -- Disparar alerta se necessário
  
  IF v_nivel_desid IN ('SEVERA', 'CRITICA') OR v_risco_hipona = 1 THEN
    INSERT INTO alertas (id_usuario, id_sessao, id_calculo, tipo_alerta, mensagem, nivel_urgencia)
    SELECT
      s.id_usuario,
      p_id_sessao,
      c.id_calculo,
      CASE
        WHEN v_risco_hipona = 1 THEN 'RISCO_HIPONATREMIA'
        WHEN v_nivel_desid = 'CRITICA' THEN 'DESIDRATACAO_CRITICA'
        ELSE 'DESIDRATACAO_SEVERA'
      END,
      CONCAT(
        'Atenção! Perda de massa: ', v_perda_pct, '% | ',
        'Taxa de Sudorese: ', v_taxa_sudorese, ' L/h | ',
        'Nível: ', v_nivel_desid
      ),
      IF(v_nivel_desid = 'CRITICA' OR v_risco_hipona = 1, 'CRITICO', 'URGENTE')
    FROM sessoes_treino s
    JOIN calculos_hidratacao c ON c.id_sessao = p_id_sessao
    WHERE s.id_sessao = p_id_sessao;
  END IF;

  SELECT
    v_variacao_massa    AS variacao_massa_kg,
    v_perda_pct         AS perda_percentual_massa,
    v_taxa_sudorese     AS taxa_sudorese_lh,
    v_balanco_hidrico   AS balanco_hidrico_ml,
    v_nivel_desid       AS nivel_desidratacao,
    v_risco_hipona      AS risco_hiponatremia,
    v_reposicao_ml      AS recomendacao_reposicao_ml;
END$$

DELIMITER ;

-- -- Usuário: Nutricionista responsável
-- INSERT INTO usuarios (id_perfil, nome_completo, email, senha_hash, data_nascimento, genero, consentimento_lgpd, data_consentimento) VALUES
--   (2, 'Dra. Ana Paula Gonçalves Serra', 'ana.paula@saocamilo.br', '$2b$12$seed_hash_nutricionista', '1985-03-15', 'FEMININO', 1, NOW()),
--   (1, 'João Silva (Atleta Teste)',       'joao.atleta@email.com',  '$2b$12$seed_hash_atleta',        '2000-07-22', 'MASCULINO', 1, NOW());

-- -- Perfil atlético do atleta de teste
-- INSERT INTO perfis_atleticos (id_usuario, modalidade, nivel, altura_cm, peso_habitual_kg) VALUES
--   (2, 'Futebol', 'INTERMEDIARIO', 175.00, 72.50);

-- -- Vínculo nutricionista atleta
-- INSERT INTO vinculos_profissional_atleta (id_nutricionista, id_atleta) VALUES (1, 2);

-- FIM