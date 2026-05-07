import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, spacing, radius, fontFamilies } from '../constants/theme';

const { height } = Dimensions.get('window');

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';

const HeroSection: React.FC = () => {
  return (
    <ImageBackground
      source={{ uri: HERO_IMAGE }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>ATLETA</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>PROTOCOLO ELITE H2O</Text>
          <Text style={styles.headline}>
            Potencialize{'\n'}sua{' '}
            <Text style={styles.headlineItalic}>Performance</Text>
            {'\n'}com Precisão{'\n'}Hídrica
          </Text>

          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
            <Text style={styles.ctaText}>COMEÇAR AGORA</Text>
          </TouchableOpacity>

          <Text style={styles.subtext}>
            Baseado em dados fisiológicos reais
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.62,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.58)',
    paddingTop: spacing.s12,
    paddingHorizontal: spacing.s6,
    paddingBottom: spacing.s8,
  },
  logoRow: {
    marginBottom: spacing.s12,
  },
  logoText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    letterSpacing: 3,
    color: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: spacing.s3,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 36,
    color: colors.white,
    lineHeight: 44,
    marginBottom: spacing.s6,
  },
  headlineItalic: {
    fontFamily: fontFamilies.headlineItalic,
    fontStyle: 'italic',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.s4,
    paddingHorizontal: spacing.s8,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.s4,
  },
  ctaText: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: colors.white,
  },
  subtext: {
    fontFamily: fontFamilies.technical,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
  },
});
