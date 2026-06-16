// src/components/StaffSidebar.tsx
// Sidebar única e dinâmica para todos os painéis de Staff.
// Recebe o role do usuário logado e exibe apenas os itens permitidos.
// Usa exatamente os estilos já definidos em PainelNutricionistaStyle (sidebar,
// sidebarLogo, sidebarNav, navItem, navItemActive, navIcon, navLabel, navLabelActive).

import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StaffRole } from "./RolePicker";
import { StaffNavId, getNavItems } from "../config/staffPermissions";
import { styles } from "../styles/PainelNutricionistaStyle";

interface Props {
  role: StaffRole;
  activeNav: StaffNavId;
}

export default function StaffSidebar({ role, activeNav }: Props) {
  const itens = getNavItems(role);

  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarLogo}>
        <Text style={styles.sidebarLogoTop}>CLINICAL</Text>
        <Text style={styles.sidebarLogoBottom}>ATHLETE</Text>
      </View>
      <View style={styles.sidebarNav}>
        {itens.map((item) => {
          const isActive = item.id === activeNav;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => {
                if (!isActive) router.push(item.rota as any);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
