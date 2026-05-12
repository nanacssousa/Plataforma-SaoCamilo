// src/components/RolePicker.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/cadastroStaffStyle";

export type StaffRole = "treinador" | "medico" | "administrador";

interface RoleOption {
  id: StaffRole;
  icon: string;
  label: string;
}

const ROLES: RoleOption[] = [
  { id: "treinador", icon: "🏋️", label: "TREINADOR" },
  { id: "medico",    icon: "🩺", label: "MÉDICO"    },
  { id: "administrador", icon: "🖥️", label: "ADMIN" },
];

interface Props {
  selected: StaffRole;
  onSelect: (role: StaffRole) => void;
}

export default function RolePicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.roleSection}>
      <Text style={styles.roleSectionLabel}>TIPO DE ACESSO</Text>
      <View style={styles.roleRow}>
        {ROLES.map((r) => {
          const active = selected === r.id;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.roleCard, active && styles.roleCardActive]}
              onPress={() => onSelect(r.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>
                {r.label}
              </Text>
              <View style={[styles.roleDot, active && styles.roleDotActive]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}