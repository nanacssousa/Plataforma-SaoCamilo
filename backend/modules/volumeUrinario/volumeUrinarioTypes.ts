export interface VolumeUrinario {
  id_volume_urinario: number
  id_sessao: number
  volume_ml: number
  horario_registro: string
}

export interface CreateVolumeUrinarioDTO {
  id_sessao: number
  volume_ml: number
}

export interface UpdateVolumeUrinarioDTO {
  volume_ml?: number
}
