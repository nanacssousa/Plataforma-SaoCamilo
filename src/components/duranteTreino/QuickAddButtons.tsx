import { colors, fontFamilies } from "@/constants/theme";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface QuickAddButtonsProps {
  onAdd: (ml: number) => void;
  onCustom: () => void;
}

export function QuickAddButtons({ onAdd, onCustom }: QuickAddButtonsProps) {
  const [pressed200, setPressed200] = useState(false);
  const [pressed500, setPressed500] = useState(false);

  function press(ml: number, setter: (v: boolean) => void) {
    setter(true);
    setTimeout(() => setter(false), 180);
    onAdd(ml);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ADICIONAR ÁGUA</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn200, pressed200 && styles.btn200Pressed]}
          onPress={() => press(200, setPressed200)}
          activeOpacity={0.85}
        >
          <Text style={styles.btn200Text}>+ 200ML</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn500, pressed500 && styles.btn500Pressed]}
          onPress={() => press(500, setPressed500)}
          activeOpacity={0.85}
        >
          <Text style={styles.btn500Text}>+ 500ML</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnCustom} onPress={onCustom} activeOpacity={0.8}>
        <Text style={styles.btnCustomText}>✎  Valor personalizado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "#888",
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  btn200: {
    flex: 1,
    backgroundColor: "#a40000",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#a40000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btn200Pressed: {
    backgroundColor: "#8a0000",
    shadowOpacity: 0.15,
    elevation: 2,
  },
  btn200Text: {
    color: colors.white,
    fontFamily: fontFamilies.technicalBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  btn500: {
    flex: 1,
    backgroundColor: "#fdf0f0",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ecc8c8",
  },
  btn500Pressed: {
    backgroundColor: "#f6e1e1",
  },
  btn500Text: {
    color: "#a40000",
    fontFamily: fontFamilies.technicalBold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  btnCustom: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#ddb8b8",
    borderStyle: "dashed",
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  btnCustomText: {
    color: "#a40000",
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});