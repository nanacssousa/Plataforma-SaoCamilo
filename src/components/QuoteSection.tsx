import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { colors, spacing, fontFamilies } from '../constants/theme';

const QUOTE_IMAGE =
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80';

const QuoteSection: React.FC = () => {
  return (
    <ImageBackground
      source={{ uri: QUOTE_IMAGE }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.openQuote}>"</Text>
        <Text style={styles.quote}>
          A hidratação é a base invisível de todo recorde mundial.
        </Text>
      </View>
    </ImageBackground>
  );
};

export default QuoteSection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
    marginVertical: spacing.s2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    paddingHorizontal: spacing.s6,
    paddingVertical: spacing.s8,
    justifyContent: 'center',
  },
  openQuote: {
    fontFamily: fontFamilies.headline,
    fontSize: 64,
    color: colors.primary,
    lineHeight: 48,
    marginBottom: spacing.s2,
  },
  quote: {
    fontFamily: fontFamilies.headlineItalic,
    fontStyle: 'italic',
    fontSize: 24,
    color: colors.white,
    lineHeight: 32,
  },
});
