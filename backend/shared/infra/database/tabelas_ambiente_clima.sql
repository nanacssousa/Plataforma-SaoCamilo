-- Tabelas necessárias para o módulo de clima
-- Execute no MySQL após o schema_corrigido.sql

USE db_saocamilo;

CREATE TABLE IF NOT EXISTS locais_treino (
  id_local      INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  latitude      DECIMAL(10,7) NULL,
  longitude     DECIMAL(10,7) NULL,
  descricao     TEXT NULL,
  ativo         TINYINT(1) NOT NULL DEFAULT 1,
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ambiente_leituras (
  id_leitura          INT AUTO_INCREMENT PRIMARY KEY,
  id_local            INT NULL,
  id_sessao           INT NULL,
  fonte               ENUM('SENSOR','OPENMETEO','MANUAL') NOT NULL,
  temperatura_c       DECIMAL(5,2) NOT NULL,
  umidade_pct         DECIMAL(5,2) NOT NULL,
  indice_calor_c      DECIMAL(5,2) NULL,
  pressao_hpa         DECIMAL(7,2) NULL,
  velocidade_vento_ms DECIMAL(5,2) NULL,
  chuva_mm            DECIMAL(6,2) NULL,
  dispositivo_id      VARCHAR(100) NULL,
  lido_em             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_local)  REFERENCES locais_treino(id_local) ON DELETE SET NULL,
  FOREIGN KEY (id_sessao) REFERENCES sessoes_treino(id_sessao) ON DELETE SET NULL
);

-- Local padrão: Santo André, SP (usado como fallback quando não há GPS)
INSERT IGNORE INTO locais_treino (id_local, nome, latitude, longitude, descricao, ativo)
VALUES (1, 'Padrão - Santo André SP', -23.6639, -46.5383, 'Local padrão do sistema', 1);
