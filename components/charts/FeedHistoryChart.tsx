// components/charts/FeedHistoryChart.tsx
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';

interface FeedHistoryChartProps {
  data: number[];
  labels: string[];
}

export default function FeedHistoryChart({ data, labels }: FeedHistoryChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`, // Colors.accent
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.backgroundCard,
    backgroundGradientFrom: Colors.backgroundCard,
    backgroundGradientTo: Colors.backgroundCard,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 160, 184, ${opacity})`, // Colors.textSecondary
    labelColor: (opacity = 1) => `rgba(139, 160, 184, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: Colors.backgroundCard,
    },
    propsForBackgroundLines: {
      strokeDasharray: '4',
      stroke: Colors.border,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - Spacing.xxl * 2} // Assuming some padding
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  chart: {
    borderRadius: BorderRadius.md,
  },
});
