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
import accountService from '../../accounts/services/accountService';
import transactionService from '../services/transactionService';
import { Spinner } from '../../../shared/components/Spinner';
import { Badge } from '../../../shared/components/Badge';
import { formatCurrency, formatDateTime } from '../../../core/utils/formatters';
import { TRANSACTION_TYPE_LABELS } from '../../../config/constants';
import { theme } from '../../../config/theme';

/* =========================
   TYPES
========================= */

interface Account {
  id: string;
  balance: number;
  accountNumber: string;
  type: string;
}

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT';
  amount: number;
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
}

/* =========================
   COMPONENT
========================= */

export const TransactionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      loadTransactions(selectedAccountId);
    }
  }, [selectedAccountId]);

  const loadAccounts = async () => {
    if (!user?.customerId) return;
    try {
      const accountsData: Account[] = await accountService.getAccountsByCustomerId(user.customerId);
      setAccounts(accountsData);
      if (accountsData.length > 0) {
        setSelectedAccountId(accountsData[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadTransactions = async (accountId: string) => {
    try {
      setLoading(true);
      const transactionsData: Transaction[] = await transactionService.getTransactionsByAccountId(accountId);
      setTransactions(transactionsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (selectedAccountId) {
      loadTransactions(selectedAccountId);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'arrow-down-circle';
      case 'WITHDRAWAL':
        return 'arrow-up-circle';
      case 'TRANSFER':
        return 'swap-horizontal';
      case 'PAYMENT':
        return 'cart';
      default:
        return 'cash';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return theme.colors.success;
      case 'WITHDRAWAL':
      case 'PAYMENT':
        return theme.colors.danger;
      case 'TRANSFER':
        return theme.colors.info;
      default:
        return theme.colors.gray500;
    }
  };

  if (loading && transactions.length === 0) {
    return <Spinner fullScreen />;
  }

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Transactions</Text>
        {selectedAccount && (
          <Text style={styles.headerSubtitle}>
            Solde: {formatCurrency(selectedAccount.balance)}
          </Text>
        )}
      </LinearGradient>

      {/* Actions rapides */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('NewTransaction', { type: 'DEPOSIT' })}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${theme.colors.success}20` }]}>
            <Ionicons name="arrow-down-circle" size={24} color={theme.colors.success} />
          </View>
          <Text style={styles.actionLabel}>Dépôt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('NewTransaction', { type: 'WITHDRAWAL' })}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${theme.colors.danger}20` }]}>
            <Ionicons name="arrow-up-circle" size={24} color={theme.colors.danger} />
          </View>
          <Text style={styles.actionLabel}>Retrait</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('NewTransaction', { type: 'TRANSFER' })}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="swap-horizontal" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Virement</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des transactions */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.transactionsList}>
          {transactions.map((transaction) => {
            const isPositive = transaction.type === 'DEPOSIT';
            const color = getTransactionColor(transaction.type);

            return (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.transactionIcon, { backgroundColor: `${color}20` }]}>
                    <Ionicons
                      name={getTransactionIcon(transaction.type) as any}
                      size={24}
                      color={color}
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionType}>
                      {TRANSACTION_TYPE_LABELS[transaction.type as keyof typeof TRANSACTION_TYPE_LABELS]}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDateTime(transaction.createdAt)}
                    </Text>
                    <Text style={styles.transactionId}>
                      ID: {transaction.id.substring(0, 8)}...
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: isPositive ? theme.colors.success : theme.colors.textPrimary },
                    ]}
                  >
                    {isPositive ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Badge
                    text={transaction.status}
                    variant={transaction.status === 'SUCCESS' ? 'success' : 'danger'}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {transactions.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.gray400} />
            <Text style={styles.emptyText}>Aucune transaction</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

/* =========================
   STYLES
========================= */

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
  headerTitle: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
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
  content: {
    flex: 1,
    marginTop: theme.spacing.md,
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
  transactionsList: {
    padding: theme.spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  transactionType: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  transactionId: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray400,
    fontFamily: 'monospace',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
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
