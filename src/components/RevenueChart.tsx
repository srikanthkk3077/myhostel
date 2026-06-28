import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, spacing, typography } from '../theme/colors';

interface ChartDataPoint {
  value: number;
  label: string;
}

interface RevenueChartProps {
  /** Array of { value, label } for the last N months */
  data?: ChartDataPoint[];
  /** Current month's revenue to show in the header */
  currentRevenue?: number;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

export default function RevenueChart({ data, currentRevenue }: RevenueChartProps) {
  // Fallback to zeros if no data yet (avoids dummy data)
  const chartData: ChartDataPoint[] = data && data.length > 0
    ? data
    : [
        { value: 0, label: 'Jan' },
        { value: 0, label: 'Feb' },
        { value: 0, label: 'Mar' },
        { value: 0, label: 'Apr' },
        { value: 0, label: 'May' },
        { value: 0, label: 'Jun' },
      ];

  const displayRevenue = currentRevenue !== undefined ? currentRevenue : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Revenue Trend</Text>
          <Text style={styles.subtitle}>Last 6 months performance</Text>
        </View>
        <Text style={styles.currentRevenue}>{formatCurrency(displayRevenue)}</Text>
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          color={colors.primary}
          thickness={3}
          dataPointsColor={colors.primary}
          hideRules
          hideYAxisText
          yAxisColor="transparent"
          xAxisColor="transparent"
          rulesColor="transparent"
          initialSpacing={10}
          endSpacing={10}
          width={Dimensions.get('window').width - spacing.xl * 2 - 20}
          height={160}
          areaChart
          startFillColor={colors.primaryLight}
          startOpacity={0.3}
          endFillColor={colors.surface}
          endOpacity={0.1}
          curvature={0.2}
          isAnimated
          animationDuration={1200}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.l,
    marginVertical: spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
  },
  currentRevenue: {
    ...typography.h2,
    color: colors.success,
  },
  chartContainer: {
    alignItems: 'center',
    marginLeft: -10,
  },
});
