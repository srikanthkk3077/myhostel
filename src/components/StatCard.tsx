import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/colors';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
  bgColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend,
  color = colors.primary,
  bgColor = colors.primaryBg
}: StatCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          {icon}
        </View>
        {trend !== undefined && (
          <View style={[
            styles.trendBadge, 
            { backgroundColor: isPositive ? colors.successBg : colors.dangerBg }
          ]}>
            {isPositive ? (
              <TrendingUp color={colors.success} size={14} />
            ) : (
              <TrendingDown color={colors.danger} size={14} />
            )}
            <Text style={[
              styles.trendText,
              { color: isPositive ? colors.success : colors.danger }
            ]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.l,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    gap: 4,
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
