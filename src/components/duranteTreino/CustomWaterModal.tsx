import { colors, fontFamilies, radius } from "@/constants/theme";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface CustomWaterModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (ml: number) => void;
}

export function CustomWaterModal({
  visible,
  onClose,
  onConfirm,
}: CustomWaterModalProps) {
  const [val, setVal] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setVal("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [visible]);

  function confirm() {
    const n = parseInt(val, 10);
    if (n > 0) {
      onConfirm(n);
      onClose();
    }
  }

  const canConfirm = val.length > 0 && parseInt(val, 10) > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <Text style={styles.title}>💧 Valor personalizado</Text>
                <Text style={styles.subtitle}>Insira a quantidade em ml</Text>

                <TextInput
                  ref={inputRef}
                  keyboardType="numeric"
                  placeholder="Ex: 350"
                  placeholderTextColor="#d4a0a0"
                  value={val}
                  onChangeText={setVal}
                  onSubmitEditing={confirm}
                  style={styles.input}
                  returnKeyType="done"
                />
                <Text style={styles.unit}>ml</Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.btnCancel}
                    onPress={onClose}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btnConfirm, !canConfirm && styles.btnConfirmDisabled]}
                    onPress={confirm}
                    activeOpacity={0.85}
                    disabled={!canConfirm}
                  >
                    <Text style={styles.btnConfirmText}>Adicionar Água</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
    shadowColor: "#a40000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 20,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 18,
    color: "#2c1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: "#a08080",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 14,
    fontSize: 24,
    fontFamily: fontFamilies.headlineBold,
    color: "#a40000",
    borderWidth: 2,
    borderColor: "#ecc8c8",
    borderRadius: 14,
    backgroundColor: "#fdf5f5",
    textAlign: "center",
  },
  unit: {
    textAlign: "center",
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: "#c09090",
    marginTop: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
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
  btnConfirmDisabled: {
    backgroundColor: "#ddb8b8",
  },
  btnConfirmText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 14,
    color: colors.white,
  },
});