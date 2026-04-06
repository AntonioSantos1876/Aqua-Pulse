// components/branding/AppLogo.tsx
// AquaPulse SVG logo — wave + signal pulse + fish silhouette

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';
import { Colors } from '../../constants/theme';

interface AppLogoProps {
  size?: number;
  style?: ViewStyle;
}

export default function AppLogo({ size = 64, style }: AppLogoProps) {
  const s = size / 64; // scale factor

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.accent} />
            <Stop offset="100%" stopColor={Colors.teal} />
          </LinearGradient>
          <LinearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={Colors.teal} />
            <Stop offset="100%" stopColor={Colors.accentDark} />
          </LinearGradient>
        </Defs>

        {/* Outer circle ring */}
        <Circle
          cx="32"
          cy="32"
          r="30"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          fill={Colors.backgroundCard}
        />

        {/* Signal arc rings (LoRa / WiFi style) */}
        <Path
          d="M32 44 C38 38, 46 34, 50 26"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        <Path
          d="M32 44 C40 34, 52 29, 56 18"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Wave path */}
        <Path
          d="M8 40 Q14 34, 20 40 Q26 46, 32 40 Q38 34, 44 40 Q50 46, 56 40"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Fish silhouette */}
        <G transform="translate(16, 20)">
          {/* Body */}
          <Path
            d="M0 8 Q8 2, 18 8 Q8 14, 0 8 Z"
            fill="url(#logoGrad2)"
          />
          {/* Tail */}
          <Path
            d="M0 8 L-5 3 L-5 13 Z"
            fill={Colors.teal}
          />
          {/* Eye */}
          <Circle cx="14" cy="7" r="1.5" fill={Colors.background} />
        </G>

        {/* Pulse dot */}
        <Circle cx="50" cy="26" r="3" fill={Colors.accent} />
      </Svg>
    </View>
  );
}
