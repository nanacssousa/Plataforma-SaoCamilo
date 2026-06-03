CREATE DATABASE IF NOT EXISTS db_saocamilo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_saocamilo;

CREATE TABLE IF NOT EXISTS perfis (
  id_perfil BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL,
  descricao VARCHAR(120) NOT NULL,
  PRIMARY KEY (id_perfil),
  UNIQUE KEY uq_perfil_nome (nome)
) ENGINE=InnoDB;

INSERT INTO perfis (id_perfil, nome, descricao) VALUES
  (1, 'ATLETA', 'Usuário final. Registra massa, ingestão e sessões.'),
  (2, 'NUTRICIONISTA', 'Acompanha atletas, estratégia de hidratação e relatórios.'),
  (3, 'TREINADOR', 'Acompanha performance e carga de treino.'),
  (4, 'MEDICO', 'Acesso a histórico clínico e biomarcadores.'),
  (5, 'ADMIN', 'Gerencia usuários, equipes e configurações gerais.')
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_perfil BIGINT UNSIGNED NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  data_nascimento DATE NULL,
  genero ENUM('MASCULINO','FEMININO','NAO_BINARIO','PREFIRO_NAO_INFORMAR') NULL,
  telefone VARCHAR(20) NULL,
  foto_perfil_url VARCHAR(300) NULL,
  registro_profissional VARCHAR(40) NULL,
  especialidade VARCHAR(80) NULL,
  consentimento_lgpd TINYINT(1) NOT NULL DEFAULT 0,
  data_consentimento DATETIME NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_email (email),
  KEY idx_usuario_perfil (id_perfil),
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (id_perfil) REFERENCES perfis (id_perfil)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equipes (
  id_equipe BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  modalidade VARCHAR(80) NULL,
  descricao VARCHAR(200) NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_equipe),
  UNIQUE KEY uq_equipe_nome (nome)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equipe_membros (
  id_equipe BIGINT UNSIGNED NOT NULL,
  id_usuario BIGINT UNSIGNED NOT NULL,
  cargo VARCHAR(60) NOT NULL DEFAULT 'MEMBRO',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_equipe, id_usuario),
  KEY idx_equipe_membros_usuario (id_usuario),
  CONSTRAINT fk_equipe_membro_equipe FOREIGN KEY (id_equipe) REFERENCES equipes (id_equipe) ON DELETE CASCADE,
  CONSTRAINT fk_equipe_membro_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS perfis_atleticos (
  id_perfil_atletico BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  modalidade VARCHAR(80) NOT NULL,
  nivel ENUM('INICIANTE','INTERMEDIARIO','AVANCADO','PROFISSIONAL') NOT NULL DEFAULT 'INICIANTE',
  altura_cm DECIMAL(5,2) NULL,
  peso_habitual_kg DECIMAL(6,2) NULL,
  condicao_medica TEXT NULL,
  observacoes TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_perfil_atletico),
  UNIQUE KEY uq_perfil_atletico_usuario (id_usuario),
  CONSTRAINT fk_perfil_atletico_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vinculos_profissional_atleta (
  id_vinculo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nutricionista BIGINT UNSIGNED NOT NULL,
  id_atleta BIGINT UNSIGNED NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_vinculo),
  KEY idx_vinculo_atleta (id_atleta),
  CONSTRAINT fk_vinculo_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_vinculo_atleta FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tipos_exercicio (
  id_tipo_exercicio BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  descricao VARCHAR(200) NULL,
  categoria ENUM('AEROBICO','ANAEROBICO','MISTO','FLEXIBILIDADE','OUTRO') NOT NULL DEFAULT 'MISTO',
  PRIMARY KEY (id_tipo_exercicio),
  UNIQUE KEY uq_tipo_exercicio_nome (nome)
) ENGINE=InnoDB;

INSERT INTO tipos_exercicio (id_tipo_exercicio, nome, categoria) VALUES
  (1, 'Futebol', 'MISTO'),
  (2, 'Natacao', 'AEROBICO'),
  (3, 'Corrida', 'AEROBICO'),
  (4, 'Ciclismo', 'AEROBICO'),
  (5, 'Musculacao', 'ANAEROBICO'),
  (6, 'Basquete', 'MISTO'),
  (7, 'Volei', 'MISTO'),
  (8, 'Tenis', 'MISTO'),
  (9, 'Artes Marciais', 'MISTO'),
  (10, 'Yoga/Pilates', 'FLEXIBILIDADE')
ON DUPLICATE KEY UPDATE categoria = VALUES(categoria);

CREATE TABLE IF NOT EXISTS sessoes_treino (
  id_sessao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_tipo_exercicio BIGINT UNSIGNED NOT NULL,
  data_treino DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NULL,
  duracao_minutos SMALLINT UNSIGNED NULL,
  intensidade ENUM('LEVE','MODERADA','INTENSA','MAXIMA') NOT NULL DEFAULT 'MODERADA',
  local_treino VARCHAR(150) NULL,
  observacoes TEXT NULL,
  validado_nutricionista TINYINT(1) NOT NULL DEFAULT 0,
  id_nutricionista_validador BIGINT UNSIGNED NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_sessao),
  KEY idx_sessao_usuario (id_usuario),
  KEY idx_sessao_data (data_treino),
  CONSTRAINT fk_sessao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_sessao_exercicio FOREIGN KEY (id_tipo_exercicio) REFERENCES tipos_exercicio (id_tipo_exercicio),
  CONSTRAINT fk_sessao_nutricionista FOREIGN KEY (id_nutricionista_validador) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pesagens (
  id_pesagem BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  momento ENUM('PRE','POS') NOT NULL,
  massa_kg DECIMAL(6,2) NOT NULL,
  confirmou_sem_tenis TINYINT(1) NOT NULL DEFAULT 0,
  confirmou_sem_acessorios TINYINT(1) NOT NULL DEFAULT 0,
  confirmou_bexiga_vazia TINYINT(1) NOT NULL DEFAULT 0,
  horario_pesagem DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacoes VARCHAR(300) NULL,
  PRIMARY KEY (id_pesagem),
  UNIQUE KEY uq_pesagem_sessao_momento (id_sessao, momento),
  CONSTRAINT fk_pesagem_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ingestao_fluidos (
  id_ingestao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  momento ENUM('PRE','DURANTE','POS') NOT NULL,
  tipo_fluido ENUM('AGUA','ISOTONICO','REPOSITOR_ELETROLITOS','SUCO','OUTRO') NOT NULL DEFAULT 'AGUA',
  descricao_fluido VARCHAR(80) NULL,
  volume_ml DECIMAL(8,2) NOT NULL,
  horario_ingestao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_ingestao),
  KEY idx_ingestao_sessao (id_sessao),
  CONSTRAINT fk_ingestao_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS volumes_urinarios (
  id_volume_urinario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  volume_ml DECIMAL(8,2) NOT NULL,
  horario_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_volume_urinario),
  KEY idx_volume_urinario_sessao (id_sessao),
  CONSTRAINT fk_volume_urinario_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS registros_cor_urina (
  id_registro_urina BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  momento ENUM('PRE','POS') NOT NULL,
  escala_cor TINYINT UNSIGNED NOT NULL,
  descricao_cor VARCHAR(50) NULL,
  horario_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_registro_urina),
  KEY idx_cor_urina_sessao (id_sessao),
  CONSTRAINT fk_cor_urina_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE,
  CONSTRAINT ck_escala_cor CHECK (escala_cor BETWEEN 1 AND 8)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS triagens (
  id_triagem BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  marca_branca_roupa TINYINT(1) NOT NULL DEFAULT 0,
  irritacao_ocular TINYINT(1) NOT NULL DEFAULT 0,
  gosto_salgado_labios TINYINT(1) NOT NULL DEFAULT 0,
  sensacao_sede TINYINT(1) NOT NULL DEFAULT 0,
  dor_cabeca TINYINT(1) NOT NULL DEFAULT 0,
  cansaco_excessivo TINYINT(1) NOT NULL DEFAULT 0,
  tontura TINYINT(1) NOT NULL DEFAULT 0,
  caibras TINYINT(1) NOT NULL DEFAULT 0,
  nausea TINYINT(1) NOT NULL DEFAULT 0,
  escala_borg TINYINT UNSIGNED NULL,
  observacoes_livres TEXT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_triagem),
  UNIQUE KEY uq_triagem_sessao (id_sessao),
  CONSTRAINT fk_triagem_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS calculos_hidratacao (
  id_calculo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  massa_pre_kg DECIMAL(6,2) NOT NULL,
  massa_pos_kg DECIMAL(6,2) NOT NULL,
  total_ingestao_ml DECIMAL(10,2) NOT NULL,
  total_urinario_ml DECIMAL(10,2) NOT NULL DEFAULT 0,
  duracao_horas DECIMAL(5,2) NOT NULL,
  variacao_massa_kg DECIMAL(6,2) NOT NULL,
  perda_percentual_massa DECIMAL(5,2) NOT NULL,
  taxa_sudorese_lh DECIMAL(6,2) NOT NULL,
  balanco_hidrico_ml DECIMAL(10,2) NOT NULL,
  nivel_desidratacao ENUM('HIDRATADO','LEVE','MODERADA','SEVERA','CRITICA') NOT NULL,
  risco_hiponatremia TINYINT(1) NOT NULL DEFAULT 0,
  recomendacao_reposicao_ml DECIMAL(10,2) NULL,
  calculado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  versao_algoritmo VARCHAR(10) NOT NULL DEFAULT '1.0',
  PRIMARY KEY (id_calculo),
  UNIQUE KEY uq_calculo_sessao (id_sessao),
  CONSTRAINT fk_calculo_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alertas (
  id_alerta BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_sessao BIGINT UNSIGNED NULL,
  id_calculo BIGINT UNSIGNED NULL,
  tipo_alerta ENUM('DESIDRATACAO_SEVERA','DESIDRATACAO_CRITICA','RISCO_HIPONATREMIA','PERDA_MASSA_ELEVADA','LEMBRETE_PESAGEM','SUPORTE_TECNICO') NOT NULL,
  mensagem TEXT NOT NULL,
  nivel_urgencia ENUM('INFO','ATENCAO','URGENTE','CRITICO') NOT NULL DEFAULT 'ATENCAO',
  lido TINYINT(1) NOT NULL DEFAULT 0,
  lido_em DATETIME NULL,
  enviado_push TINYINT(1) NOT NULL DEFAULT 0,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_alerta),
  KEY idx_alerta_usuario (id_usuario),
  CONSTRAINT fk_alerta_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_alerta_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao),
  CONSTRAINT fk_alerta_calculo FOREIGN KEY (id_calculo) REFERENCES calculos_hidratacao (id_calculo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS biomarcadores (
  id_biomarcador BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  unidade VARCHAR(20) NOT NULL,
  faixa_min DECIMAL(8,2) NULL,
  faixa_max DECIMAL(8,2) NULL,
  descricao TEXT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id_biomarcador),
  UNIQUE KEY uq_biomarcador_nome (nome)
) ENGINE=InnoDB;

INSERT INTO biomarcadores (id_biomarcador, nome, unidade, faixa_min, faixa_max, descricao) VALUES
  (1, 'Cortisol (Soro)', 'mcg/dL', 5.0, 23.0, 'Indicador de estresse e recuperacao.'),
  (2, 'Creatina Quinase (CK)', 'U/L', 39.0, 308.0, 'Marcador de estresse muscular.'),
  (3, 'Nitrogenio Ureico (BUN)', 'mg/dL', 7.0, 20.0, 'Indicador de hidratacao e catabolismo proteico.'),
  (4, 'Densidade Urinaria (USG)', 'g/mL', 1.005, 1.030, 'Avaliacao de hidratacao.')
ON DUPLICATE KEY UPDATE unidade = VALUES(unidade);

CREATE TABLE IF NOT EXISTS biomarcador_medicoes (
  id_medicao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_biomarcador BIGINT UNSIGNED NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  leitura_texto VARCHAR(40) NULL,
  status ENUM('NORMAL','ELEVADO','LIMITROFE') NOT NULL DEFAULT 'NORMAL',
  tendencia ENUM('ESTAVEL','SUBINDO','DESCENDO') NOT NULL DEFAULT 'ESTAVEL',
  medido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacoes TEXT NULL,
  PRIMARY KEY (id_medicao),
  KEY idx_biomarcador_medicao_usuario (id_usuario),
  CONSTRAINT fk_biomarcador_medicao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_biomarcador_medicao_biomarcador FOREIGN KEY (id_biomarcador) REFERENCES biomarcadores (id_biomarcador)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS estrategias_hidratacao (
  id_estrategia BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nutricionista BIGINT UNSIGNED NOT NULL,
  id_atleta BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descricao TEXT NOT NULL,
  volume_pre_ml DECIMAL(8,2) NULL,
  volume_durante_ml_h DECIMAL(8,2) NULL,
  volume_pos_ml DECIMAL(8,2) NULL,
  tipo_fluido_recom VARCHAR(80) NULL,
  eletrolitos_recom TEXT NULL,
  valida_ate DATE NULL,
  ativa TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_estrategia),
  KEY idx_estrategia_atleta (id_atleta),
  CONSTRAINT fk_estrategia_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_estrategia_atleta FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS relatorios (
  id_relatorio BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_solicitante BIGINT UNSIGNED NOT NULL,
  id_atleta BIGINT UNSIGNED NOT NULL,
  tipo_relatorio ENUM('SESSAO','MENSAL','SAZONAL','COMPLETO') NOT NULL,
  formato ENUM('PDF','CSV','XLSX') NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  url_arquivo VARCHAR(500) NULL,
  status ENUM('PENDENTE','PROCESSANDO','CONCLUIDO','ERRO') NOT NULL DEFAULT 'PENDENTE',
  erro_mensagem TEXT NULL,
  gerado_em DATETIME NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_relatorio),
  KEY idx_relatorio_atleta (id_atleta),
  CONSTRAINT fk_relatorio_solicitante FOREIGN KEY (id_solicitante) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_relatorio_atleta FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessoes_autenticacao (
  id_sessao_auth BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  dispositivo VARCHAR(150) NULL,
  plataforma ENUM('IOS','ANDROID','WEB') NOT NULL,
  ip_origem VARCHAR(45) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_em DATETIME NOT NULL,
  revogado TINYINT(1) NOT NULL DEFAULT 0,
  revogado_em DATETIME NULL,
  PRIMARY KEY (id_sessao_auth),
  KEY idx_sessao_auth_usuario (id_usuario),
  CONSTRAINT fk_sessao_auth_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS logs_auditoria (
  id_log BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NULL,
  acao VARCHAR(80) NOT NULL,
  tabela_afetada VARCHAR(60) NULL,
  id_registro BIGINT UNSIGNED NULL,
  dados_anteriores JSON NULL,
  dados_novos JSON NULL,
  ip_origem VARCHAR(45) NULL,
  user_agent VARCHAR(300) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_log),
  KEY idx_log_usuario (id_usuario),
  CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

SELECT 'Schema criado com sucesso.' AS status;
