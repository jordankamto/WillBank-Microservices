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
import { useRoute, useNavigation } from '@react-navigation/native';
import accountService from '../services/accountService';
import transactionService from '../../transactions/services/transactionService';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Badge } from '../../../shared/components/Badge';
import { formatCurrency, formatDate, formatRelativeDate } from '../../../core/utils/formatters';
import { ACCOUNT_TYPE_LABELS, ACCOUNT_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '../../../config/constants';
import { theme } from '../../../config/theme';
import { Account, Transaction } from '../../../types/api.types';

export const AccountDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { accountId } = route.params;

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAccountDetails();
  }, [accountId]);

  const loadAccountDetails = async () => {
    try {
      setLoading(true);
      const [accountData, transactionsData] = await Promise.all([
        accountService.getAccountById(accountId) as Promise<Account>,
        transactionService.getTransactionsPaginated(accountId, 0, 20) as Promise<{ content?: Transaction[] }>
      ]);

      setAccount(accountData);
      setTransactions(transactionsData.content || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAccountDetails();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'FROZEN':
        return 'warning';
      case 'BLOCKED':
      case 'CLOSED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    navigation.navigate('Transactions', {
      tab: type,
      accountId: account?.id,
      account: account
    });
  };

  if (loading && !account) {
    return <Spinner fullScreen />;
  }

  if (!account) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Compte non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails du compte</Text>
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

        {/* Informations du compte */}
        <Card style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View>
              <Text style={styles.accountType}>
                {ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}
              </Text>
              <Text style={styles.accountNumber}>
                **** {account.id.slice(-4)}
              </Text>
            </View>
            <Badge
              text={ACCOUNT_STATUS_LABELS[account.status as keyof typeof ACCOUNT_STATUS_LABELS]}
              variant={getStatusBadgeVariant(account.status)}
            />
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <Text style={styles.balanceAmount}>
              {formatCurrency(account.balance)}
            </Text>
          </View>

          <View style={styles.accountDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Créé le</Text>
              <Text style={styles.detailValue}>
                {formatDate(account.createdAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dernière activité</Text>
              <Text style={styles.detailValue}>
                {formatDate(account.updatedAt)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions rapides */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTransaction('deposit')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.success + '20' }]}>
                <Ionicons name="arrow-down-circle" size={24} color={theme.colors.success} />
              </View>
              <Text style={styles.actionText}>Dépôt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTransaction('withdraw')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.danger + '20' }]}>
                <Ionicons name="arrow-up-circle" size={24} color={theme.colors.danger} />
              </View>
              <Text style={styles.actionText}>Retrait</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Transactions', { tab: 'transfer', fromAccountId: account.id })}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.info + '20' }]}>
                <Ionicons name="swap-horizontal" size={24} color={theme.colors.info} />
              </View>
              <Text style={styles.actionText}>Virement</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Historique des transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique des transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions', { accountId })}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {transactions.length > 0 ? (
            transactions.slice(0, 10).map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() => navigation.navigate('TransactionDetails', { transactionId: transaction.id })}
              >
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.description || TRANSACTION_TYPE_LABELS[transaction.type as keyof typeof TRANSACTION_TYPE_LABELS]}
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
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={theme.colors.gray400} />
              <Text style={styles.emptyText}>Aucune transaction</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
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
  accountCard: {
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  accountType: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  accountNumber: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.gray500,
    fontFamily: 'monospace',
  },
  balanceSection: {
    marginBottom: theme.spacing.lg,
  },
  balanceLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  accountDetails: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingTop: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
  },
  detailValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  actionsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
  },
  transactionsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
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
