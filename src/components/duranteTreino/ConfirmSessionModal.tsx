import { colors, fontFamilies, radius } from "@/constants/theme";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface ConfirmSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSessionModal({
  visible,
  onClose,
  onConfirm,
}: ConfirmSessionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.iconWrapper}>
                <Text style={styles.icon}>🔄</Text>
              </View>

              <Text style={styles.title}>Nova sessão</Text>
              <Text style={styles.subtitle}>
                Deseja iniciar uma nova sessão?{"\n"}
                <Text style={styles.subtitleSmall}>
                  O resumo atual será salvo.
                </Text>
              </Text>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={onConfirm}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(40,10,10,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 28,
    width: 300,
    alignItems: "center",
    shadowColor: "#a40000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 20,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f6e1e1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 17,
    color: "#2c1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: "#a08080",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  subtitleSmall: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e8d0d0",
    alignItems: "center",
  },
  btnCancelText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    color: "#a08080",
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#a40000",
    alignItems: "center",
  },
  btnConfirmText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    color: colors.white,
  },
});