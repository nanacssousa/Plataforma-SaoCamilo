CREATE DATABASE IF NOT EXISTS saocamilo_nutri_esportiva
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE saocamilo_nutri_esportiva;

CREATE TABLE IF NOT EXISTS perfis (
  id_perfil TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL,
  descricao VARCHAR(120) NOT NULL,
  PRIMARY KEY (id_perfil),
  UNIQUE KEY uq_perfil_nome (nome)
) ENGINE=InnoDB COMMENT='Perfis de acesso ao sistema';

INSERT INTO perfis (id_perfil, nome, descricao)
VALUES
  (1, 'ATLETA', 'Usuário final. Registra massa, ingestão e sessões.'),
  (2, 'NUTRICIONISTA', 'Acompanha atletas, estratégia de hidratação e relatórios.'),
  (3, 'TREINADOR', 'Acompanha performance e carga de treino.'),
  (4, 'MEDICO', 'Acesso a histórico clínico e biomarcadores.'),
  (5, 'ADMIN', 'Gerencia usuários, equipes e configurações gerais.')
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_perfil TINYINT UNSIGNED NOT NULL,
  nome_completo VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  data_nascimento DATE NULL,
  genero ENUM('MASCULINO','FEMININO','NAO_BINARIO','PREFIRO_NAO_INFORMAR') NULL,
  telefone VARCHAR(20) NULL,
  foto_perfil_url VARCHAR(300) NULL,
  registro_profissional VARCHAR(40) NULL COMMENT 'CRM, CREF, CPF ou equivalente',
  especialidade VARCHAR(80) NULL COMMENT 'Especialidade do profissional',
  consentimento_lgpd TINYINT(1) NOT NULL DEFAULT 0,
  data_consentimento DATETIME NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuario_email (email),
  KEY idx_usuario_perfil (id_perfil),
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (id_perfil) REFERENCES perfis (id_perfil)
) ENGINE=InnoDB COMMENT='Usuários do sistema';

CREATE TABLE IF NOT EXISTS equipes (
  id_equipe BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  modalidade VARCHAR(80) NULL,
  descricao VARCHAR(200) NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_equipe),
  UNIQUE KEY uq_equipe_nome (nome)
) ENGINE=InnoDB COMMENT='Equipes e grupos esportivos';

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
) ENGINE=InnoDB COMMENT='Membros vinculados às equipes';

CREATE TABLE IF NOT EXISTS perfis_atleticos (
  id_perfil_atletico BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  modalidade VARCHAR(80) NOT NULL COMMENT 'Modalidade esportiva principal',
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
) ENGINE=InnoDB COMMENT='Dados clínicos e esportivos do atleta';

CREATE TABLE IF NOT EXISTS vinculos_profissional_atleta (
  id_vinculo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nutricionista BIGINT UNSIGNED NOT NULL,
  id_atleta BIGINT UNSIGNED NOT NULL,
  data_inicio DATE NOT NULL DEFAULT (CURRENT_DATE),
  data_fim DATE NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_vinculo),
  UNIQUE KEY uq_vinculo_ativo (id_nutricionista, id_atleta, data_inicio),
  KEY idx_vinculo_atleta (id_atleta),
  CONSTRAINT fk_vinculo_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_vinculo_atleta FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Vinculo entre profissional e atleta';

CREATE TABLE IF NOT EXISTS tipos_exercicio (
  id_tipo_exercicio SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  descricao VARCHAR(200) NULL,
  categoria ENUM('AEROBICO','ANAEROBICO','MISTO','FLEXIBILIDADE','OUTRO') NOT NULL DEFAULT 'MISTO',
  PRIMARY KEY (id_tipo_exercicio),
  UNIQUE KEY uq_tipo_exercicio_nome (nome)
) ENGINE=InnoDB COMMENT='Catálogo de tipos de exercício';

INSERT INTO tipos_exercicio (id_tipo_exercicio, nome, categoria)
VALUES
  (1, 'Futebol', 'MISTO'),
  (2, 'Natação', 'AEROBICO'),
  (3, 'Corrida', 'AEROBICO'),
  (4, 'Ciclismo', 'AEROBICO'),
  (5, 'Musculação', 'ANAEROBICO'),
  (6, 'Basquete', 'MISTO'),
  (7, 'Vôlei', 'MISTO'),
  (8, 'Tênis', 'MISTO'),
  (9, 'Artes Marciais', 'MISTO'),
  (10, 'Yoga/Pilates', 'FLEXIBILIDADE')
ON DUPLICATE KEY UPDATE categoria = VALUES(categoria);

CREATE TABLE IF NOT EXISTS sessoes_treino (
  id_sessao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_tipo_exercicio SMALLINT UNSIGNED NOT NULL,
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
  KEY idx_sessao_usuario_data (id_usuario, data_treino),
  CONSTRAINT fk_sessao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_sessao_exercicio FOREIGN KEY (id_tipo_exercicio) REFERENCES tipos_exercicio (id_tipo_exercicio),
  CONSTRAINT fk_sessao_nutricionista FOREIGN KEY (id_nutricionista_validador) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Sessões de treino dos atletas';

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
) ENGINE=InnoDB COMMENT='Pesagens pré e pós sessão';

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
) ENGINE=InnoDB COMMENT='Registro de ingestão de líquidos';

CREATE TABLE IF NOT EXISTS volumes_urinarios (
  id_volume_urinario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_sessao BIGINT UNSIGNED NOT NULL,
  volume_ml DECIMAL(8,2) NOT NULL,
  horario_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_volume_urinario),
  KEY idx_volume_urinario_sessao (id_sessao),
  CONSTRAINT fk_volume_urinario_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Volume urinário para ajuste do cálculo';

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
) ENGINE=InnoDB COMMENT='Escala de cor da urina';

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
  CONSTRAINT fk_triagem_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE,
  CONSTRAINT ck_escala_borg CHECK (escala_borg BETWEEN 6 AND 20)
) ENGINE=InnoDB COMMENT='Questionário de triagem do atleta';

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
  KEY idx_calculo_nivel (nivel_desidratacao),
  CONSTRAINT fk_calculo_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Resultados calculados da hidratação';

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
  KEY idx_alerta_lido (id_usuario, lido),
  CONSTRAINT fk_alerta_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_alerta_sessao FOREIGN KEY (id_sessao) REFERENCES sessoes_treino (id_sessao),
  CONSTRAINT fk_alerta_calculo FOREIGN KEY (id_calculo) REFERENCES calculos_hidratacao (id_calculo)
) ENGINE=InnoDB COMMENT='Alertas de risco e suporte';

CREATE TABLE IF NOT EXISTS biomarcadores (
  id_biomarcador SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  unidade VARCHAR(20) NOT NULL,
  faixa_min DECIMAL(8,2) NULL,
  faixa_max DECIMAL(8,2) NULL,
  descricao TEXT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id_biomarcador),
  UNIQUE KEY uq_biomarcador_nome (nome)
) ENGINE=InnoDB COMMENT='Catalogo de biomarcadores';

INSERT INTO biomarcadores (id_biomarcador, nome, unidade, faixa_min, faixa_max, descricao)
VALUES
  (1, 'Cortisol (Soro)', 'mcg/dL', 5.0, 23.0, 'Indicador de estresse e recuperação.'),
  (2, 'Creatina Quinase (CK)', 'U/L', 39.0, 308.0, 'Marcador de estresse muscular.'),
  (3, 'Nitrogênio Ureico (BUN)', 'mg/dL', 7.0, 20.0, 'Indicador de hidratação e catabolismo proteico.'),
  (4, 'Densidade Urinária (USG)', 'g/mL', 1.005, 1.030, 'Avaliação de hidratação.')
ON DUPLICATE KEY UPDATE unidade = VALUES(unidade), faixa_min = VALUES(faixa_min), faixa_max = VALUES(faixa_max), descricao = VALUES(descricao);

CREATE TABLE IF NOT EXISTS biomarcador_medicoes (
  id_medicao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario BIGINT UNSIGNED NOT NULL,
  id_biomarcador SMALLINT UNSIGNED NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  leitura_texto VARCHAR(40) NULL,
  status ENUM('NORMAL','ELEVADO','LIMITROFE') NOT NULL DEFAULT 'NORMAL',
  tendencia ENUM('ESTAVEL','SUBINDO','DESCENDO') NOT NULL DEFAULT 'ESTAVEL',
  medido_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacoes TEXT NULL,
  PRIMARY KEY (id_medicao),
  KEY idx_biomarcador_medicao_usuario (id_usuario),
  KEY idx_biomarcador_medicao_data (medido_em),
  CONSTRAINT fk_biomarcador_medicao_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_biomarcador_medicao_biomarcador FOREIGN KEY (id_biomarcador) REFERENCES biomarcadores (id_biomarcador)
) ENGINE=InnoDB COMMENT='Medições laboratoriais dos atletas';

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
  eletrólitos_recom TEXT NULL,
  valida_ate DATE NULL,
  ativa TINYINT(1) NOT NULL DEFAULT 1,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_estrategia),
  KEY idx_estrategia_atleta (id_atleta),
  CONSTRAINT fk_estrategia_nutricionista FOREIGN KEY (id_nutricionista) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_estrategia_atleta FOREIGN KEY (id_atleta) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB COMMENT='Estratégias personalizadas de hidratação';

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
) ENGINE=InnoDB COMMENT='Relatórios exportados do sistema';

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
  KEY idx_sessao_auth_token (token_hash),
  CONSTRAINT fk_sessao_auth_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Sessões de autenticação';

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
  KEY idx_log_acao (acao),
  KEY idx_log_criado_em (criado_em),
  CONSTRAINT fk_log_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Log de auditoria';

CREATE OR REPLACE VIEW vw_ultima_sessao_atleta AS
SELECT
  u.id_usuario,
  u.nome_completo,
  s.id_sessao,
  s.data_treino,
  te.nome AS tipo_exercicio,
  c.taxa_sudorese_lh,
  c.perda_percentual_massa,
  c.nivel_desidratacao,
  c.recomendacao_reposicao_ml,
  c.balanco_hidrico_ml
FROM usuarios u
JOIN sessoes_treino s ON s.id_usuario = u.id_usuario
JOIN tipos_exercicio te ON te.id_tipo_exercicio = s.id_tipo_exercicio
LEFT JOIN calculos_hidratacao c ON c.id_sessao = s.id_sessao
WHERE s.data_treino = (
  SELECT MAX(s2.data_treino)
  FROM sessoes_treino s2
  WHERE s2.id_usuario = u.id_usuario
)
AND u.id_perfil = 1;

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
JOIN sessoes_treino s ON s.id_usuario = u.id_usuario
JOIN calculos_hidratacao c ON c.id_sessao = s.id_sessao
WHERE c.nivel_desidratacao IN ('SEVERA', 'CRITICA')
   OR c.risco_hiponatremia = 1
ORDER BY s.data_treino DESC;

CREATE OR REPLACE VIEW vw_historico_hidratacao AS
SELECT
  u.id_usuario,
  u.nome_completo,
  s.data_treino,
  MONTHNAME(s.data_treino) AS mes,
  YEAR(s.data_treino) AS ano,
  te.nome AS exercicio,
  c.massa_pre_kg,
  c.massa_pos_kg,
  c.variacao_massa_kg,
  c.perda_percentual_massa,
  c.taxa_sudorese_lh,
  c.balanco_hidrico_ml,
  c.total_ingestao_ml,
  c.total_urinario_ml,
  c.nivel_desidratacao
FROM usuarios u
JOIN sessoes_treino s ON s.id_usuario = u.id_usuario
JOIN tipos_exercicio te ON te.id_tipo_exercicio = s.id_tipo_exercicio
LEFT JOIN calculos_hidratacao c ON c.id_sessao = s.id_sessao
ORDER BY u.id_usuario, s.data_treino DESC;

DROP PROCEDURE IF EXISTS sp_calcular_hidratacao;
DELIMITER $$

CREATE PROCEDURE sp_calcular_hidratacao(IN p_id_sessao BIGINT UNSIGNED)
BEGIN
  DECLARE v_massa_pre DECIMAL(6,2);
  DECLARE v_massa_pos DECIMAL(6,2);
  DECLARE v_ingestao_total DECIMAL(10,2);
  DECLARE v_volume_urinario DECIMAL(10,2);
  DECLARE v_duracao_horas DECIMAL(5,2);
  DECLARE v_variacao_massa DECIMAL(6,2);
  DECLARE v_perda_pct DECIMAL(5,2);
  DECLARE v_taxa_sudorese DECIMAL(6,2);
  DECLARE v_balanco_hidrico DECIMAL(10,2);
  DECLARE v_nivel_desid VARCHAR(20);
  DECLARE v_risco_hipona TINYINT(1);
  DECLARE v_reposicao_ml DECIMAL(10,2);

  SELECT MAX(CASE WHEN momento = 'PRE' THEN massa_kg END), MAX(CASE WHEN momento = 'POS' THEN massa_kg END)
  INTO v_massa_pre, v_massa_pos
  FROM pesagens
  WHERE id_sessao = p_id_sessao;

  SELECT COALESCE(SUM(volume_ml), 0)
  INTO v_ingestao_total
  FROM ingestao_fluidos
  WHERE id_sessao = p_id_sessao;

  SELECT COALESCE(SUM(volume_ml), 0)
  INTO v_volume_urinario
  FROM volumes_urinarios
  WHERE id_sessao = p_id_sessao;

  SELECT COALESCE(duracao_minutos / 60.0, 1)
  INTO v_duracao_horas
  FROM sessoes_treino
  WHERE id_sessao = p_id_sessao;

  SET v_variacao_massa = ROUND(v_massa_pre - v_massa_pos, 2);
  SET v_perda_pct = IF(v_massa_pre > 0, ROUND((v_variacao_massa / v_massa_pre) * 100, 2), 0);
  SET v_taxa_sudorese = ROUND(((v_variacao_massa * 1000) + v_ingestao_total - v_volume_urinario) / (v_duracao_horas * 1000), 2);
  SET v_balanco_hidrico = ROUND(v_ingestao_total - (v_variacao_massa * 1000) - v_volume_urinario, 2);

  SET v_nivel_desid = CASE
    WHEN v_perda_pct < 1.0 THEN 'HIDRATADO'
    WHEN v_perda_pct < 2.0 THEN 'LEVE'
    WHEN v_perda_pct < 3.0 THEN 'MODERADA'
    WHEN v_perda_pct < 5.0 THEN 'SEVERA'
    ELSE 'CRITICA'
  END;

  SET v_risco_hipona = IF(v_balanco_hidrico > 1500, 1, 0);
  SET v_reposicao_ml = ROUND(IF(v_variacao_massa > 0, v_variacao_massa * 1000 * 1.5, 0), 2);

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
    massa_pre_kg = v_massa_pre,
    massa_pos_kg = v_massa_pos,
    total_ingestao_ml = v_ingestao_total,
    total_urinario_ml = v_volume_urinario,
    duracao_horas = v_duracao_horas,
    variacao_massa_kg = v_variacao_massa,
    perda_percentual_massa = v_perda_pct,
    taxa_sudorese_lh = v_taxa_sudorese,
    balanco_hidrico_ml = v_balanco_hidrico,
    nivel_desidratacao = v_nivel_desid,
    risco_hiponatremia = v_risco_hipona,
    recomendacao_reposicao_ml = v_reposicao_ml,
    calculado_em = CURRENT_TIMESTAMP;

  SELECT
    v_variacao_massa AS variacao_massa_kg,
    v_perda_pct AS perda_percentual_massa,
    v_taxa_sudorese AS taxa_sudorese_lh,
    v_balanco_hidrico AS balanco_hidrico_ml,
    v_nivel_desid AS nivel_desidratacao,
    v_risco_hipona AS risco_hiponatremia,
    v_reposicao_ml AS recomendacao_reposicao_ml;
END$$

DELIMITER ;

SELECT 'schema_align_v1 carregado com sucesso.' AS status;

-- ============================================
-- AJUSTES DE COMPATIBILIDADE MYSQL 8+
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- UNIQUE KEYS NECESSÁRIAS
-- ============================================

-- PERFIS
ALTER TABLE perfis
ADD CONSTRAINT uq_perfis_nome UNIQUE (nome);

-- TIPOS EXERCICIO
ALTER TABLE tipos_exercicio
ADD CONSTRAINT uq_tipos_exercicio_nome UNIQUE (nome);

-- BIOMARCADORES
ALTER TABLE biomarcadores
ADD CONSTRAINT uq_biomarcadores_nome UNIQUE (nome);

-- USUARIOS
ALTER TABLE usuarios
ADD CONSTRAINT uq_usuarios_email UNIQUE (email);

-- EQUIPES
ALTER TABLE equipes
ADD CONSTRAINT uq_equipes_nome UNIQUE (nome);

-- ============================================
-- ÍNDICES IMPORTANTES (PERFORMANCE)
-- ============================================

CREATE INDEX idx_usuarios_perfil
ON usuarios(id_perfil);

CREATE INDEX idx_sessoes_usuario
ON sessoes_treino(id_usuario);

CREATE INDEX idx_sessoes_data
ON sessoes_treino(data_treino);

CREATE INDEX idx_pesagens_sessao
ON pesagens(id_sessao);

CREATE INDEX idx_ingestao_sessao
ON ingestao_fluidos(id_sessao);

CREATE INDEX idx_alertas_usuario
ON alertas(id_usuario);

CREATE INDEX idx_biomarcador_usuario
ON biomarcador_medicoes(id_usuario);

CREATE INDEX idx_relatorios_atleta
ON relatorios(id_atleta);

CREATE INDEX idx_logs_usuario
ON logs_auditoria(id_usuario);

-- ============================================
-- AJUSTES DE AUTO_INCREMENT
-- (garante consistência)
-- ============================================

ALTER TABLE perfis
MODIFY id_perfil BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE usuarios
MODIFY id_usuario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE equipes
MODIFY id_equipe BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE perfis_atleticos
MODIFY id_perfil_atletico BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE vinculos_profissional_atleta
MODIFY id_vinculo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE tipos_exercicio
MODIFY id_tipo_exercicio BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE sessoes_treino
MODIFY id_sessao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE pesagens
MODIFY id_pesagem BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE ingestao_fluidos
MODIFY id_ingestao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE volumes_urinarios
MODIFY id_volume_urinario BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE registros_cor_urina
MODIFY id_registro_urina BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE triagens
MODIFY id_triagem BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE calculos_hidratacao
MODIFY id_calculo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE alertas
MODIFY id_alerta BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE biomarcadores
MODIFY id_biomarcador BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE biomarcador_medicoes
MODIFY id_medicao BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE estrategias_hidratacao
MODIFY id_estrategia BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE relatorios
MODIFY id_relatorio BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE sessoes_autenticacao
MODIFY id_sessao_auth BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE logs_auditoria
MODIFY id_log BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;

-- ============================================
-- AJUSTES DE INTEGRIDADE
-- ============================================

ALTER TABLE usuarios
MODIFY email VARCHAR(255) NOT NULL;

ALTER TABLE usuarios
MODIFY senha_hash VARCHAR(255) NOT NULL;

ALTER TABLE usuarios
MODIFY nome_completo VARCHAR(255) NOT NULL;

ALTER TABLE usuarios
MODIFY genero ENUM(
  'MASCULINO',
  'FEMININO',
  'PREFIRO_NAO_INFORMAR',
) NOT NULL;

ALTER TABLE sessoes_treino
MODIFY intensidade ENUM(
  'LEVE',
  'MODERADA',
  'INTENSA'
) NOT NULL;

ALTER TABLE pesagens
MODIFY momento ENUM(
  'PRE',
  'POS'
) NOT NULL;

ALTER TABLE ingestao_fluidos
MODIFY momento ENUM(
  'PRE',
  'DURANTE',
  'POS'
) NOT NULL;

ALTER TABLE registros_cor_urina
MODIFY momento ENUM(
  'PRE',
  'POS'
) NOT NULL;

ALTER TABLE usuarios
MODIFY atualizado_em TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP;

SET FOREIGN_KEY_CHECKS = 1;