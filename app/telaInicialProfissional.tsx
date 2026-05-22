// app/telaLandingStaff.tsx
import StaffFeaturesSection from "@/components/StaffFeaturesSection";
import StaffHeroSection from "@/components/StaffHeroSection";
import { styles } from "@/styles/landingStaffStyle";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [active, setActive] = useState<"nutrição" | "performance" | "ciência">(
    "performance",
  );
  const links = ["nutrição", "performance", "ciência"] as const;

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <View style={styles.navLogoRow}>
        <View style={styles.navLogoBox}>
          <Text style={styles.navLogoLetter}>C</Text>
        </View>
        <Text style={styles.navBrand}>CLÍNICA ATLETA</Text>
      </View>

      {/* Links */}
      <View style={styles.navLinksRow}>
        {links.map((l) => (
          <TouchableOpacity key={l} onPress={() => setActive(l)}>
            <Text
              style={[styles.navLink, active === l && styles.navLinkActive]}
            >
              {l.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.navCta}
        onPress={() => router.push("/telaCadastroStaff")}
        activeOpacity={0.85}
      >
        <Text style={styles.navCtaText}>CADASTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── CTA Final ─────────────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <View style={styles.ctaSection}>
      <Text style={styles.ctaTitle}>
        Pronto para elevar o{"\n"}nível da sua clínica?
      </Text>
      <Text style={styles.ctaSubtitle}>
        Junte-se aos profissionais que estão redefinindo os limites da
        performance humana através da ciência clínica.
      </Text>
      <TouchableOpacity
        style={styles.ctaBtn}
        onPress={() => router.push("/telaCadastroStaff")}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaBtnText}>FAÇA SEU CADASTRO →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerTop}>
        <Text style={styles.footerBrand}>CLÍNICA ATLETA</Text>
        <View style={styles.footerLinksRow}>
          {["Privacidade", "Termos", "Suporte"].map((l) => (
            <Text key={l} style={styles.footerLink}>
              {l}
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.footerCopy}>
        © 2024 CLÍNICA ATLETA PERFORMANCE LAB
      </Text>
    </View>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────
export default function TelaLandingStaff() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Navbar />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero com live card */}
        <StaffHeroSection
          onSolicitarDemo={() => router.push("/telaCadastroStaff")}
          onExplorar={() => {}}
        />

        {/* Cards de features + stats */}
        <StaffFeaturesSection />

        {/* CTA vermelho + footer */}
        <CtaSection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
