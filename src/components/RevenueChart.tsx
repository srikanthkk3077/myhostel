import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { colors, spacing, typography } from '../theme/colors';

export default function RevenueChart() {
  const chartData = [
    { value: 15000, label: 'Jan' },
    { value: 22000, label: 'Feb' },
    { value: 18000, label: 'Mar' },
    { value: 26000, label: 'Apr' },
    { value: 32000, label: 'May' },
    { value: 45000, label: 'Jun' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Revenue Trend</Text>
          <Text style={styles.subtitle}>Current vs Expected</Text>
        </View>
        <Text style={styles.currentRevenue}>$45,000</Text>
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
