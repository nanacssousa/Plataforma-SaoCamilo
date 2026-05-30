// src/components/shared/Toast.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies } from '../../constants/theme';
import { useAppStore } from '../../store/useAppStore';

export function ToastContainer() {
  const { state, dispatch } = useAppStore();
  const { toast } = state;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [toast]);

  if (!toast) return null;

  const bgColor = toast.tipo === 'success' ? colors.success :
    toast.tipo === 'error' ? colors.error : colors.info;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.toast, { backgroundColor: bgColor }]}>
        <Text style={styles.text}>
          {toast.tipo === 'success' ? '✓ ' : toast.tipo === 'error' ? '✗ ' : 'ℹ '}
          {toast.msg}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
