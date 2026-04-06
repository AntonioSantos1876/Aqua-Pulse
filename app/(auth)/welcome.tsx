// app/(auth)/welcome.tsx
// Onboarding welcome screen — 3 swipeable slides then sign-in

import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../../components/branding/AppLogo';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
} from '../../constants/theme';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'fish' as const,
    title: 'Smart Sea Feeding',
    desc: 'Monitor and control your entire aquaculture fleet from the palm of your hand.',
    color: Colors.accent,
  },
  {
    id: '2',
    icon: 'radio' as const,
    title: 'LoRa Connected',
    desc: 'LoRa wireless telemetry keeps you connected to feeders up to 5 km offshore.',
    color: Colors.teal,
  },
  {
    id: '3',
    icon: 'notifications' as const,
    title: 'Instant Alerts',
    desc: 'Get real-time push notifications for low feed levels, offline devices, and missed cycles.',
    color: '#9C6FFF',
  },
];

export default function WelcomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveIndex(idx);
  };

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      router.push('/(auth)/signin');
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <LinearGradient
      colors={Colors.gradientPrimary}
      style={styles.container}
    >
      {/* Logo */}
      <View style={styles.logoWrap}>
        <AppLogo size={56} />
        <Text style={styles.appName}>AquaPulse</Text>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: W }]}>
            <View style={[styles.slideIcon, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={52} color={item.color} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDesc}>{item.desc}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={goNext} style={styles.primaryBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={Colors.gradientAccent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtnInner}
          >
            <Text style={styles.primaryBtnText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.background} />
          </LinearGradient>
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity onPress={() => router.push('/(auth)/signin')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  logoWrap: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 24,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    gap: 20,
  },
  slideIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  slideTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  slideDesc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.accent,
  },
  actions: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 48,
    gap: Spacing.md,
  },
  primaryBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  primaryBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryBtnText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
});
