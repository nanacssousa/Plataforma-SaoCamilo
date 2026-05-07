import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeroSection from '../components/HeroSection';
import ScienceSection from '../components/ScienceSection';
import MonitoringCard from '../components/MonitoringCard';
import PrecisionCard from '../components/PrecisionCard';
import LabCard from '../components/LabCard';
import QuoteSection from '../components/QuoteSection';
import DataArchitecture from '../components/DataArchitecture';
import CTASection from '../components/CTASection';
import { colors } from '../constants/theme';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <HeroSection />
        <ScienceSection />
        <MonitoringCard />
        <PrecisionCard />
        <LabCard />
        <QuoteSection />
        <DataArchitecture />
        <CTASection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
});
