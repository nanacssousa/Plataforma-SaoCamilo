SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO perfis (nome, descricao)
VALUES
  ('ATLETA', 'Usuário final. Registra massa, ingestão e sessões.'),
  ('NUTRICIONISTA', 'Acompanha atletas, estratégia de hidratação e relatórios.'),
  ('TREINADOR', 'Acompanha performance e carga de treino.'),
  ('MEDICO', 'Acesso a histórico clínico e biomarcadores.'),
  ('ADMIN', 'Gerencia usuários, equipes e configurações gerais.')
ON DUPLICATE KEY UPDATE descricao = VALUES(descricao);

INSERT INTO tipos_exercicio (nome, categoria)
VALUES
  ('Futebol', 'MISTO'),
  ('Natação', 'AEROBICO'),
  ('Corrida', 'AEROBICO'),
  ('Ciclismo', 'AEROBICO'),
  ('Musculação', 'ANAEROBICO'),
  ('Basquete', 'MISTO'),
  ('Vôlei', 'MISTO'),
  ('Tênis', 'MISTO'),
  ('Artes Marciais', 'MISTO'),
  ('Yoga/Pilates', 'FLEXIBILIDADE')
ON DUPLICATE KEY UPDATE categoria = VALUES(categoria);

INSERT INTO biomarcadores (nome, unidade, faixa_min, faixa_max, descricao)
VALUES
  ('Cortisol (Soro)', 'mcg/dL', 5.0, 23.0, 'Indicador de estresse e recuperação.'),
  ('Creatina Quinase (CK)', 'U/L', 39.0, 308.0, 'Marcador de estresse muscular.'),
  ('Nitrogênio Ureico (BUN)', 'mg/dL', 7.0, 20.0, 'Indicador de hidratação e catabolismo proteico.'),
  ('Densidade Urinária (USG)', 'g/mL', 1.005, 1.030, 'Avaliação de hidratação.')
ON DUPLICATE KEY UPDATE unidade = VALUES(unidade), faixa_min = VALUES(faixa_min), faixa_max = VALUES(faixa_max), descricao = VALUES(descricao);

INSERT INTO usuarios (
  id_perfil,
  nome_completo,
  email,
  senha_hash,
  data_nascimento,
  genero,
  telefone,
  foto_perfil_url,
  registro_profissional,
  especialidade,
  consentimento_lgpd,
  data_consentimento,
  ativo,
  criado_em,
  atualizado_em
) VALUES
  (
    (SELECT id_perfil FROM perfis WHERE nome = 'ATLETA'),
    'Ana Silva',
    'ana.silva@email.com',
    '$2b$10$2OsFV1tUJFi8QZe89.UTmeUv30XscvjPedqzaqSKq/TCFFZDU8WRW',
    '1998-04-12',
    'FEMININO',
    '+55 11 99999-0001',
    'https://images.example.com/ana-silva.png',
    NULL,
    NULL,
    1,
    '2026-05-01 08:00:00',
    1,
    '2026-05-01 08:00:00',
    '2026-05-01 08:00:00'
  ),
  (
    (SELECT id_perfil FROM perfis WHERE nome = 'NUTRICIONISTA'),
    'Bruno Costa',
    'bruno.costa@email.com',
    '$2b$10$Fw8KBDk9t35Azg02MqzKy.3y019rBFkRm1yAkneeNatkPtO2IyyBK',
    '1987-09-24',
    'MASCULINO',
    '+55 11 98888-0002',
    'https://images.example.com/bruno-costa.png',
    'CRN 123456',
    'Nutrição esportiva',
    1,
    '2026-05-01 09:00:00',
    1,
    '2026-05-01 09:00:00',
    '2026-05-01 09:00:00'
  ),
  (
    (SELECT id_perfil FROM perfis WHERE nome = 'TREINADOR'),
    'Carla Mendes',
    'carla.mendes@email.com',
    '$2b$10$..Hd7UpjQ3WQmyEF2lU4au7IIE3l8Z.2ga6p2JK1OT8bIZjdTSZaq',
    '1991-01-15',
    'FEMININO',
    '+55 11 97777-0003',
    'https://images.example.com/carla-mendes.png',
    'CREF 778899',
    'Treinamento funcional',
    1,
    '2026-05-01 10:00:00',
    1,
    '2026-05-01 10:00:00',
    '2026-05-01 10:00:00'
  ),
  (
    (SELECT id_perfil FROM perfis WHERE nome = 'MEDICO'),
    'Diego Ramos',
    'diego.ramos@email.com',
    '$2b$10$3xEHZlhcrThsHY/3olJGTeoVXjRweL7/cDUvv/OUhDbUNO9.ZF09K',
    '1978-12-02',
    'MASCULINO',
    '+55 11 96666-0004',
    'https://images.example.com/diego-ramos.png',
    'CRM 445566',
    'Medicina esportiva',
    1,
    '2026-05-01 11:00:00',
    1,
    '2026-05-01 11:00:00',
    '2026-05-01 11:00:00'
  ),
  (
    (SELECT id_perfil FROM perfis WHERE nome = 'ADMIN'),
    'Eva Torres',
    'eva.torres@email.com',
    '$2b$10$OncjUccmaEIJp1n.lTQwquiCLSk4KK5XwsCtl5btHXMHqrosv.ALO',
    '1995-07-07',
    'NAO_BINARIO',
    '+55 11 95555-0005',
    'https://images.example.com/eva-torres.png',
    NULL,
    NULL,
    1,
    '2026-05-01 12:00:00',
    1,
    '2026-05-01 12:00:00',
    '2026-05-01 12:00:00'
  )
ON DUPLICATE KEY UPDATE
  id_perfil = VALUES(id_perfil),
  nome_completo = VALUES(nome_completo),
  senha_hash = VALUES(senha_hash),
  data_nascimento = VALUES(data_nascimento),
  genero = VALUES(genero),
  telefone = VALUES(telefone),
  foto_perfil_url = VALUES(foto_perfil_url),
  registro_profissional = VALUES(registro_profissional),
  especialidade = VALUES(especialidade),
  consentimento_lgpd = VALUES(consentimento_lgpd),
  data_consentimento = VALUES(data_consentimento),
  ativo = VALUES(ativo);

INSERT INTO equipes (nome, modalidade, descricao, ativo, criado_em)
VALUES
  ('São Camilo Elite', 'Futebol', 'Equipe principal de desempenho', 1, '2026-05-02 09:00:00'),
  ('Natação Pioneira', 'Natação', 'Equipe de natação da base', 1, '2026-05-02 10:00:00')
ON DUPLICATE KEY UPDATE
  modalidade = VALUES(modalidade),
  descricao = VALUES(descricao),
  ativo = VALUES(ativo);

INSERT INTO equipe_membros (id_equipe, id_usuario, cargo, ativo, criado_em)
VALUES
  ((SELECT id_equipe FROM equipes WHERE nome = 'São Camilo Elite'), (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'), 'ATLETA', 1, '2026-05-03 09:00:00'),
  ((SELECT id_equipe FROM equipes WHERE nome = 'São Camilo Elite'), (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'), 'NUTRICIONISTA', 1, '2026-05-03 09:30:00'),
  ((SELECT id_equipe FROM equipes WHERE nome = 'São Camilo Elite'), (SELECT id_usuario FROM usuarios WHERE email = 'carla.mendes@email.com'), 'TREINADOR', 1, '2026-05-03 10:00:00'),
  ((SELECT id_equipe FROM equipes WHERE nome = 'Natação Pioneira'), (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'), 'ATLETA', 1, '2026-05-03 10:30:00'),
  ((SELECT id_equipe FROM equipes WHERE nome = 'Natação Pioneira'), (SELECT id_usuario FROM usuarios WHERE email = 'diego.ramos@email.com'), 'MEDICO', 1, '2026-05-03 11:00:00')
ON DUPLICATE KEY UPDATE
  cargo = VALUES(cargo),
  ativo = VALUES(ativo);

INSERT INTO perfis_atleticos (
  id_usuario,
  modalidade,
  nivel,
  altura_cm,
  peso_habitual_kg,
  condicao_medica,
  observacoes,
  criado_em,
  atualizado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    'Futebol',
    'AVANCADO',
    175.00,
    72.50,
    'Sem restrições médicas relevantes',
    'Atleta com bom retorno de recuperação após treinos intensos',
    '2026-05-02 12:00:00',
    '2026-05-02 12:00:00'
  )
ON DUPLICATE KEY UPDATE
  modalidade = VALUES(modalidade),
  nivel = VALUES(nivel),
  altura_cm = VALUES(altura_cm),
  peso_habitual_kg = VALUES(peso_habitual_kg),
  condicao_medica = VALUES(condicao_medica),
  observacoes = VALUES(observacoes);

INSERT INTO vinculos_profissional_atleta (
  id_nutricionista,
  id_atleta,
  data_inicio,
  data_fim,
  ativo,
  criado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'),
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    '2026-01-15',
    NULL,
    1,
    '2026-05-02 13:00:00'
  )
ON DUPLICATE KEY UPDATE
  ativo = VALUES(ativo),
  data_fim = VALUES(data_fim);

INSERT INTO sessoes_treino (
  id_usuario,
  id_tipo_exercicio,
  data_treino,
  hora_inicio,
  hora_fim,
  duracao_minutos,
  intensidade,
  local_treino,
  observacoes,
  validado_nutricionista,
  id_nutricionista_validador,
  criado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    (SELECT id_tipo_exercicio FROM tipos_exercicio WHERE nome = 'Futebol'),
    '2026-05-20',
    '08:00:00',
    '09:30:00',
    90,
    'INTENSA',
    'Campo Central',
    'Treino técnico, foco em finalizações e mudanças de direção',
    1,
    (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'),
    '2026-05-20 07:00:00'
  )
ON DUPLICATE KEY UPDATE
  id_usuario = VALUES(id_usuario),
  id_tipo_exercicio = VALUES(id_tipo_exercicio),
  data_treino = VALUES(data_treino),
  hora_inicio = VALUES(hora_inicio),
  hora_fim = VALUES(hora_fim),
  duracao_minutos = VALUES(duracao_minutos),
  intensidade = VALUES(intensidade),
  local_treino = VALUES(local_treino),
  observacoes = VALUES(observacoes),
  validado_nutricionista = VALUES(validado_nutricionista),
  id_nutricionista_validador = VALUES(id_nutricionista_validador);

INSERT INTO pesagens (
  id_sessao,
  momento,
  massa_kg,
  confirmou_sem_tenis,
  confirmou_sem_acessorios,
  confirmou_bexiga_vazia,
  horario_pesagem,
  observacoes
) VALUES
  (
    (SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'),
    'PRE',
    72.50,
    1,
    1,
    1,
    '2026-05-20 07:45:00',
    'Peso em jejum pela manhã'
  ),
  (
    (SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'),
    'POS',
    71.80,
    1,
    1,
    1,
    '2026-05-20 09:45:00',
    'Peso após treino e reidratação inicial'
  )
ON DUPLICATE KEY UPDATE
  massa_kg = VALUES(massa_kg),
  confirmou_sem_tenis = VALUES(confirmou_sem_tenis),
  confirmou_sem_acessorios = VALUES(confirmou_sem_acessorios),
  confirmou_bexiga_vazia = VALUES(confirmou_bexiga_vazia),
  horario_pesagem = VALUES(horario_pesagem),
  observacoes = VALUES(observacoes);

INSERT INTO ingestao_fluidos (
  id_sessao,
  momento,
  tipo_fluido,
  descricao_fluido,
  volume_ml,
  horario_ingestao
) VALUES
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 'PRE', 'AGUA', 'Água filtrada', 500.00, '2026-05-20 07:30:00'),
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 'DURANTE', 'ISOTONICO', 'Isotônico com eletrólitos', 300.00, '2026-05-20 08:30:00'),
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 'POS', 'REPOSITOR_ELETROLITOS', 'Repositora eletrolítica', 600.00, '2026-05-20 10:00:00')
ON DUPLICATE KEY UPDATE
  id_sessao = VALUES(id_sessao),
  momento = VALUES(momento),
  tipo_fluido = VALUES(tipo_fluido),
  descricao_fluido = VALUES(descricao_fluido),
  volume_ml = VALUES(volume_ml),
  horario_ingestao = VALUES(horario_ingestao);

INSERT INTO volumes_urinarios (id_sessao, volume_ml, horario_registro)
VALUES
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 210.00, '2026-05-20 09:55:00'),
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 150.00, '2026-05-20 10:30:00')
ON DUPLICATE KEY UPDATE
  id_sessao = VALUES(id_sessao),
  volume_ml = VALUES(volume_ml),
  horario_registro = VALUES(horario_registro);

INSERT INTO registros_cor_urina (
  id_sessao,
  momento,
  escala_cor,
  descricao_cor,
  horario_registro
) VALUES
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 'PRE', 4, 'Amarela clara', '2026-05-20 07:40:00'),
  ((SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'), 'POS', 3, 'Amarela média', '2026-05-20 10:05:00')
ON DUPLICATE KEY UPDATE
  id_sessao = VALUES(id_sessao),
  momento = VALUES(momento),
  escala_cor = VALUES(escala_cor),
  descricao_cor = VALUES(descricao_cor),
  horario_registro = VALUES(horario_registro);

INSERT INTO triagens (
  id_sessao,
  marca_branca_roupa,
  irritacao_ocular,
  gosto_salgado_labios,
  sensacao_sede,
  dor_cabeca,
  cansaco_excessivo,
  tontura,
  caibras,
  nausea,
  escala_borg,
  observacoes_livres,
  criado_em
) VALUES
  (
    (SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'),
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    12,
    'Sensação de sede moderada no final do treino.',
    '2026-05-20 09:40:00'
  )
ON DUPLICATE KEY UPDATE
  marca_branca_roupa = VALUES(marca_branca_roupa),
  irritacao_ocular = VALUES(irritacao_ocular),
  gosto_salgado_labios = VALUES(gosto_salgado_labios),
  sensacao_sede = VALUES(sensacao_sede),
  dor_cabeca = VALUES(dor_cabeca),
  cansaco_excessivo = VALUES(cansaco_excessivo),
  tontura = VALUES(tontura),
  caibras = VALUES(caibras),
  nausea = VALUES(nausea),
  escala_borg = VALUES(escala_borg),
  observacoes_livres = VALUES(observacoes_livres);

INSERT INTO calculos_hidratacao (
  id_sessao,
  massa_pre_kg,
  massa_pos_kg,
  total_ingestao_ml,
  total_urinario_ml,
  duracao_horas,
  variacao_massa_kg,
  perda_percentual_massa,
  taxa_sudorese_lh,
  balanco_hidrico_ml,
  nivel_desidratacao,
  risco_hiponatremia,
  recomendacao_reposicao_ml,
  calculado_em,
  versao_algoritmo
) VALUES
  (
    (SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'),
    72.50,
    71.80,
    1400.00,
    360.00,
    1.50,
    0.70,
    0.97,
    1.16,
    340.00,
    'HIDRATADO',
    0,
    1050.00,
    '2026-05-20 10:20:00',
    '1.0'
  )
ON DUPLICATE KEY UPDATE
  massa_pre_kg = VALUES(massa_pre_kg),
  massa_pos_kg = VALUES(massa_pos_kg),
  total_ingestao_ml = VALUES(total_ingestao_ml),
  total_urinario_ml = VALUES(total_urinario_ml),
  duracao_horas = VALUES(duracao_horas),
  variacao_massa_kg = VALUES(variacao_massa_kg),
  perda_percentual_massa = VALUES(perda_percentual_massa),
  taxa_sudorese_lh = VALUES(taxa_sudorese_lh),
  balanco_hidrico_ml = VALUES(balanco_hidrico_ml),
  nivel_desidratacao = VALUES(nivel_desidratacao),
  risco_hiponatremia = VALUES(risco_hiponatremia),
  recomendacao_reposicao_ml = VALUES(recomendacao_reposicao_ml),
  versao_algoritmo = VALUES(versao_algoritmo);

INSERT INTO alertas (
  id_usuario,
  id_sessao,
  id_calculo,
  tipo_alerta,
  mensagem,
  nivel_urgencia,
  lido,
  lido_em,
  enviado_push,
  criado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    (SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00'),
    (SELECT id_calculo FROM calculos_hidratacao WHERE id_sessao = (SELECT id_sessao FROM sessoes_treino WHERE id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND data_treino = '2026-05-20' AND hora_inicio = '08:00:00')),
    'LEMBRETE_PESAGEM',
    'Complete a pesagem pós-treino para registrar o estado hídrico final.',
    'INFO',
    0,
    NULL,
    0,
    '2026-05-20 10:15:00'
  )
ON DUPLICATE KEY UPDATE
  id_usuario = VALUES(id_usuario),
  id_sessao = VALUES(id_sessao),
  id_calculo = VALUES(id_calculo),
  tipo_alerta = VALUES(tipo_alerta),
  mensagem = VALUES(mensagem),
  nivel_urgencia = VALUES(nivel_urgencia),
  lido = VALUES(lido),
  lido_em = VALUES(lido_em),
  enviado_push = VALUES(enviado_push);

INSERT INTO biomarcador_medicoes (
  id_usuario,
  id_biomarcador,
  valor,
  leitura_texto,
  status,
  tendencia,
  medido_em,
  observacoes
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    (SELECT id_biomarcador FROM biomarcadores WHERE nome = 'Creatina Quinase (CK)'),
    320.00,
    'Sutilmente elevado',
    'ELEVADO',
    'SUBINDO',
    '2026-05-21 08:00:00',
    'Recomendado monitoramento na próxima semana.'
  )
ON DUPLICATE KEY UPDATE
  id_usuario = VALUES(id_usuario),
  id_biomarcador = VALUES(id_biomarcador),
  valor = VALUES(valor),
  leitura_texto = VALUES(leitura_texto),
  status = VALUES(status),
  tendencia = VALUES(tendencia),
  medido_em = VALUES(medido_em),
  observacoes = VALUES(observacoes);

INSERT INTO estrategias_hidratacao (
  id_nutricionista,
  id_atleta,
  titulo,
  descricao,
  volume_pre_ml,
  volume_durante_ml_h,
  volume_pos_ml,
  tipo_fluido_recom,
  eletrolitos_recom,
  valida_ate,
  ativa,
  criado_em,
  atualizado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'),
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    'Hidratação para treino intenso',
    'Ingerir água antes e durante a sessão, com reposição de eletrólitos ao final.',
    500.00,
    900.00,
    600.00,
    'Água com eletrólitos',
    'Consumir 500 mL com 2 g de sódio antes da sessão e 300 mL pós-treino.',
    '2026-06-15',
    1,
    '2026-05-02 14:00:00',
    '2026-05-02 14:00:00'
  )
ON DUPLICATE KEY UPDATE
  id_nutricionista = VALUES(id_nutricionista),
  id_atleta = VALUES(id_atleta),
  titulo = VALUES(titulo),
  descricao = VALUES(descricao),
  volume_pre_ml = VALUES(volume_pre_ml),
  volume_durante_ml_h = VALUES(volume_durante_ml_h),
  volume_pos_ml = VALUES(volume_pos_ml),
  tipo_fluido_recom = VALUES(tipo_fluido_recom),
  eletrolitos_recom = VALUES(eletrolitos_recom),
  valida_ate = VALUES(valida_ate),
  ativa = VALUES(ativa);

INSERT INTO relatorios (
  id_solicitante,
  id_atleta,
  tipo_relatorio,
  formato,
  periodo_inicio,
  periodo_fim,
  url_arquivo,
  status,
  erro_mensagem,
  gerado_em,
  criado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'),
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    'SESSAO',
    'PDF',
    '2026-05-01',
    '2026-05-31',
    'https://storage.example.com/relatorios/ana-silva-sessao.pdf',
    'CONCLUIDO',
    NULL,
    '2026-05-22 12:00:00',
    '2026-05-22 11:30:00'
  )
ON DUPLICATE KEY UPDATE
  id_solicitante = VALUES(id_solicitante),
  id_atleta = VALUES(id_atleta),
  tipo_relatorio = VALUES(tipo_relatorio),
  formato = VALUES(formato),
  periodo_inicio = VALUES(periodo_inicio),
  periodo_fim = VALUES(periodo_fim),
  url_arquivo = VALUES(url_arquivo),
  status = VALUES(status),
  erro_mensagem = VALUES(erro_mensagem),
  gerado_em = VALUES(gerado_em);

INSERT INTO sessoes_autenticacao (
  id_usuario,
  token_hash,
  dispositivo,
  plataforma,
  ip_origem,
  criado_em,
  expira_em,
  revogado,
  revogado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    'hash_session_ana_001',
    'iPhone 15 Pro',
    'IOS',
    '192.168.1.10',
    '2026-05-20 08:00:00',
    '2026-06-19 08:00:00',
    0,
    NULL
  ),
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'),
    'hash_session_bruno_001',
    'Desktop Web',
    'WEB',
    '192.168.1.20',
    '2026-05-20 09:00:00',
    '2026-06-19 09:00:00',
    0,
    NULL
  )
ON DUPLICATE KEY UPDATE
  id_usuario = VALUES(id_usuario),
  token_hash = VALUES(token_hash),
  dispositivo = VALUES(dispositivo),
  plataforma = VALUES(plataforma),
  ip_origem = VALUES(ip_origem),
  criado_em = VALUES(criado_em),
  expira_em = VALUES(expira_em),
  revogado = VALUES(revogado),
  revogado_em = VALUES(revogado_em);

INSERT INTO logs_auditoria (
  id_usuario,
  acao,
  tabela_afetada,
  id_registro,
  dados_anteriores,
  dados_novos,
  ip_origem,
  user_agent,
  criado_em
) VALUES
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    'LOGIN',
    'usuarios',
    (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com'),
    JSON_OBJECT('origem', 'web', 'status', 'pendente'),
    JSON_OBJECT('status', 'autenticado'),
    '192.168.1.10',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    '2026-05-20 08:05:00'
  ),
  (
    (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com'),
    'CRIACAO_RELATORIO',
    'relatorios',
    (SELECT id_relatorio FROM relatorios WHERE id_solicitante = (SELECT id_usuario FROM usuarios WHERE email = 'bruno.costa@email.com') AND id_atleta = (SELECT id_usuario FROM usuarios WHERE email = 'ana.silva@email.com') AND tipo_relatorio = 'SESSAO'),
    JSON_OBJECT('status', 'pendente'),
    JSON_OBJECT('status', 'concluido'),
    '192.168.1.20',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    '2026-05-22 11:45:00'
  )
ON DUPLICATE KEY UPDATE
  id_usuario = VALUES(id_usuario),
  acao = VALUES(acao),
  tabela_afetada = VALUES(tabela_afetada),
  id_registro = VALUES(id_registro),
  dados_anteriores = VALUES(dados_anteriores),
  dados_novos = VALUES(dados_novos),
  ip_origem = VALUES(ip_origem),
  user_agent = VALUES(user_agent);

SET FOREIGN_KEY_CHECKS = 1;