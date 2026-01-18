import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../shared/components/Card';
import { formatCurrency } from '../../../core/utils/formatters';
import { theme } from '../../../config/theme';

export const DashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);
  

  // Données mockées
  const totalBalance = 1250000;
  const accounts = [
    { id: '1', type: 'Compte Courant', balance: 750000, number: '12345678' },
    { id: '2', type: 'Compte Épargne', balance: 500000, number: '87654321' },
  ];

  const quickActions = [
    { id: '1', icon: 'arrow-down-circle', label: 'Dépôt', color: theme.colors.success },
    { id: '2', icon: 'arrow-up-circle', label: 'Retrait', color: theme.colors.danger },
    { id: '3', icon: 'swap-horizontal', label: 'Virement', color: theme.colors.primary },
    { id: '4', icon: 'qr-code', label: 'Payer', color: theme.colors.info },
  ];

  const recentTransactions = [
    { id: '1', type: 'Dépôt', amount: 50000, date: '15/01/2026', positive: true },
    { id: '2', type: 'Retrait', amount: 25000, date: '14/01/2026', positive: false },
    { id: '3', type: 'Virement', amount: 100000, date: '13/01/2026', positive: false },
  ];

  return (
    <View style={styles.container}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>Jordan KAMGAING 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Solde total */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Solde total</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Actions rapides */}
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mes comptes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes comptes</Text>
          
          {accounts.map((account) => (
            <TouchableOpacity key={account.id} activeOpacity={0.7}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.accountCard}
              >
                <View style={styles.accountHeader}>
                  <Text style={styles.accountType}>{account.type}</Text>
                  <Ionicons name="card-outline" size={24} color={theme.colors.white} />
                </View>
                <Text style={styles.accountNumber}>**** {account.number.slice(-4)}</Text>
                <Text style={styles.accountBalance}>{formatCurrency(account.balance)}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions récentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <Card>
            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor: transaction.positive
                          ? `${theme.colors.success}20`
                          : `${theme.colors.gray500}20`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        transaction.positive ? 'arrow-down' : 'arrow-up'
                      }
                      size={20}
                      color={
                        transaction.positive
                          ? theme.colors.success
                          : theme.colors.gray500
                      }
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionType}>{transaction.type}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color: transaction.positive
                        ? theme.colors.success
                        : theme.colors.textPrimary,
                    },
                  ]}
                >
                  {transaction.positive ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.sizes.xxxl + 4,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    marginTop: -theme.spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  seeAll: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  accountCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  accountType: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.typography.weights.medium,
  },
  accountNumber: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.md,
    fontFamily: 'monospace',
  },
  accountBalance: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  transactionType: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  transactionAmount: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});