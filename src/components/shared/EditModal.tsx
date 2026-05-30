// src/components/shared/EditModal.tsx
// Modal genérico de edição de campo único
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fontFamilies } from '../../constants/theme';

interface Props {
  visible: boolean;
  title: string;
  value: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  unit?: string;
  validate?: (v: string) => string | null;
  onSave: (v: string) => void;
  onClose: () => void;
}

export function EditModal({ visible, title, value, placeholder, keyboardType = 'default', unit, validate, onSave, onClose }: Props) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) { setDraft(value); setError(null); }
  }, [visible, value]);

  const handleSave = () => {
    if (validate) {
      const err = validate(draft);
      if (err) { setError(err); return; }
    }
    onSave(draft.trim());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={draft}
              onChangeText={t => { setDraft(t); if (error) setError(null); }}
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={colors.onSurfaceVariant}
              autoFocus
            />
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.btns}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Text style={styles.btnSaveText}>SALVAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: colors.surface, borderRadius: 16, padding: 24, width: '86%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  title: { fontFamily: fontFamilies.technicalBold, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: colors.onSurfaceVariant, marginBottom: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLow, borderRadius: 10, paddingHorizontal: 14, marginBottom: 4 },
  input: { flex: 1, fontFamily: fontFamilies.body, fontSize: 20, color: colors.onSurface, paddingVertical: 14 },
  inputError: { color: colors.error },
  unit: { fontFamily: fontFamilies.technical, fontSize: 14, color: colors.onSurfaceVariant, marginLeft: 6 },
  errorText: { fontFamily: fontFamilies.technical, fontSize: 12, color: colors.error, marginBottom: 8 },
  btns: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: colors.outlineVariant, alignItems: 'center' },
  btnCancelText: { fontFamily: fontFamilies.technicalBold, fontSize: 12, letterSpacing: 1, color: colors.onSurface },
  btnSave: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center' },
  btnSaveText: { fontFamily: fontFamilies.technicalBold, fontSize: 12, letterSpacing: 1, color: colors.white },
});
