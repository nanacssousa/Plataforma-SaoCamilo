// src/components/PermissionsCard.tsx
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/cadastroStaffStyle";
import { StaffRole } from "./RolePicker";

interface Permission {
  icon: string;
  label: string;
  allowed: boolean;
}

const PERMISSIONS: Record<StaffRole, Permission[]> = {
  treinador: [
    { icon: "📊", label: "Painel de performance", allowed: true  },
    { icon: "🏃", label: "Gerenciar sessões",      allowed: true  },
    { icon: "👥", label: "Visualizar equipes",     allowed: true  },
    { icon: "🩻", label: "Dados médicos",           allowed: false },
    { icon: "⚙️", label: "Configurações gerais",   allowed: false },
  ],
  medico: [
    { icon: "📊", label: "Painel de performance", allowed: true  },
    { icon: "🩻", label: "Dados médicos",           allowed: true  },
    { icon: "💧", label: "Gestão hídrica",          allowed: true  },
    { icon: "🏃", label: "Gerenciar sessões",      allowed: false },
    { icon: "⚙️", label: "Configurações gerais",   allowed: false },
  ],
  administrador: [
    { icon: "📊", label: "Painel de performance", allowed: true  },
    { icon: "🩻", label: "Dados médicos",           allowed: true  },
    { icon: "👥", label: "Gerenciar equipes",      allowed: true  },
    { icon: "🏃", label: "Gerenciar sessões",      allowed: true  },
    { icon: "⚙️", label: "Configurações gerais",   allowed: true  },
  ],
};

export default function PermissionsCard({ role }: { role: StaffRole }) {
  const perms = PERMISSIONS[role];
  return (
    <View style={styles.permissionsCard}>
      <Text style={styles.permissionsTitle}>PERMISSÕES DE ACESSO</Text>
      {perms.map((p, i) => (
        <View
          key={p.label}
          style={[
            styles.permissionRow,
            i === perms.length - 1 && styles.permissionRowLast,
          ]}
        >
          <View style={styles.permissionLeft}>
            <Text style={styles.permissionIcon}>{p.icon}</Text>
            <Text style={styles.permissionLabel}>{p.label}</Text>
          </View>
          <View
            style={[
              styles.permissionBadge,
              p.allowed ? styles.permissionBadgeOn : styles.permissionBadgeOff,
            ]}
          >
            <Text
              style={[
                styles.permissionBadgeText,
                p.allowed
                  ? styles.permissionBadgeTextOn
                  : styles.permissionBadgeTextOff,
              ]}
            >
              {p.allowed ? "ATIVO" : "RESTRITO"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}