import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../../../core/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useDashboard } from '../hooks/useDashboard';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatRelativeDate } from '../../../core/utils/formatters';
import { ACCOUNT_TYPE_LABELS } from '../../../config/constants';
import { theme } from '../../../config/theme';

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { dashboardData, loading, error, fetchDashboard } = useDashboard(user?.customerId || '');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.customerId) {
      fetchDashboard();
    }
  }, [user?.customerId]);

  const onRefresh = () => {
    setRefreshing(true);
    if (user?.customerId) {
      fetchDashboard().finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  };

  const quickActions = [
    {
      id: 'deposit',
      icon: 'arrow-down-circle',
      label: 'Dépôt',
      color: theme.colors.success,
      onPress: () => navigation.navigate('Transactions', { tab: 'deposit' }),
    },
    {
      id: 'withdraw',
      icon: 'arrow-up-circle',
      label: 'Retrait',
      color: theme.colors.danger,
      onPress: () => navigation.navigate('Transactions', { tab: 'withdraw' }),
    },
    {
      id: 'transfer',
      icon: 'swap-horizontal',
      label: 'Virement',
      color: theme.colors.info,
      onPress: () => navigation.navigate('Transactions', { tab: 'transfer' }),
    },
    {
      id: 'accounts',
      icon: 'card',
      label: 'Comptes',
      color: theme.colors.primary,
      onPress: () => navigation.navigate('Accounts'),
    },
  ];

  if (loading && !dashboardData) {
    return <Spinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.userName}>
            {dashboardData?.customer?.firstName} {dashboardData?.customer?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Solde total */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde total</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(dashboardData?.totalBalance || 0)}
          </Text>
          <Text style={styles.accountsCount}>
            {dashboardData?.accountsCount} compte{dashboardData?.accountsCount !== 1 ? 's' : ''}
          </Text>
        </Card>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comptes récents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes comptes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {dashboardData?.accounts?.slice(0, 2).map((account) => (
            <TouchableOpacity
              key={account.id}
              style={styles.accountItem}
              onPress={() => navigation.navigate('AccountDetails', { accountId: account.id })}
              activeOpacity={0.7}
            >
              <View style={styles.accountInfo}>
                <Text style={styles.accountType}>
                  {ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}
                </Text>
                <Text style={styles.accountNumber}>
                  **** {account.id.slice(-4)}
                </Text>
              </View>
              <Text style={styles.accountBalance}>
                {formatCurrency(account.balance)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions récentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {dashboardData?.recentTransactions?.slice(0, 5).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description || 'Transaction'}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatRelativeDate(transaction.createdAt)}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'DEPOSIT' ? theme.colors.success : theme.colors.danger }
              ]}>
                {transaction.type === 'DEPOSIT' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))}

          {(!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0) && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={theme.colors.gray400} />
              <Text style={styles.emptyText}>Aucune transaction récente</Text>
            </View>
          )}
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
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    marginTop: -theme.spacing.lg,
  },
  errorContainer: {
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: '#fee2e2',
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
  },
  balanceCard: {
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  accountsCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray500,
  },
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
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
  },
  seeAllText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  quickActionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  accountNumber: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray500,
    fontFamily: 'monospace',
  },
  accountBalance: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray500,
  },
  transactionAmount: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray400,
    marginTop: theme.spacing.md,
  },
});
