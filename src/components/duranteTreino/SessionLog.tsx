import { fontFamilies } from "@/constants/theme";
import { LogEntry } from "@/hooks/useDuranteTreino";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

// ─── SessionLogItem ───────────────────────────────────────────────────────────
interface SessionLogItemProps {
  item: LogEntry;
}

function SessionLogItem({ item }: SessionLogItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.item, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>💧</Text>
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </Animated.View>
  );
}

// ─── SessionLog ───────────────────────────────────────────────────────────────
interface SessionLogProps {
  log: LogEntry[];
}

export function SessionLog({ log }: SessionLogProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>LOG DA SESSÃO</Text>

      {log.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Nenhum registro ainda.{"\n"}Adicione água para começar!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {[...log].reverse().map((item) => (
            <SessionLogItem key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: "#888",
    fontSize: 11,
    fontFamily: fontFamilies.technicalBold,
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  empty: {
    padding: 28,
    backgroundColor: "#fdf7f7",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8cece",
    borderStyle: "dashed",
    alignItems: "center",
  },
  emptyText: {
    color: "#c09090",
    fontSize: 14,
    fontFamily: fontFamilies.body,
    textAlign: "center",
    lineHeight: 22,
  },
  scroll: {
    maxHeight: 280,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0dede",
    marginBottom: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f6e1e1",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 14,
    color: "#2c1a1a",
  },
  subtitle: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: "#a08080",
    marginTop: 2,
  },
});