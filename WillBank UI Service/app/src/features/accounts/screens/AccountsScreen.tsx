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
import accountService from '../services/accountService';
import { Spinner } from '../../../shared/components/Spinner';
import { Badge } from '../../../shared/components/Badge';
import { formatCurrency } from '../../../core/utils/formatters';
import { ACCOUNT_TYPE_LABELS, ACCOUNT_STATUS_LABELS } from '../../../config/constants';
import { theme } from '../../../config/theme';

export const AccountsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    if (!user?.customerId) return;

    try {
      setLoading(true);
      const data = await accountService.getAccountsByCustomerId(user.customerId);
      setAccounts(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAccounts();
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

  if (loading && accounts.length === 0) {
    return <Spinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mes Comptes</Text>
        <Text style={styles.headerSubtitle}>
          {accounts.length} compte{accounts.length > 1 ? 's' : ''}
        </Text>
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

        <View style={styles.accountsList}>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => navigation.navigate('AccountDetails', { accountId: account.id })}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.accountCard}
              >
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

                <View style={styles.accountBalance}>
                  <Text style={styles.balanceLabel}>Solde disponible</Text>
                  <Text style={styles.balanceAmount}>
                    {formatCurrency(account.balance)}
                  </Text>
                </View>

                <View style={styles.accountActions}>
                  <View style={styles.actionItem}>
                    <Ionicons name="arrow-down-circle-outline" size={20} color={theme.colors.white} />
                    <Text style={styles.actionText}>Dépôt</Text>
                  </View>
                  <View style={styles.actionItem}>
                    <Ionicons name="arrow-up-circle-outline" size={20} color={theme.colors.white} />
                    <Text style={styles.actionText}>Retrait</Text>
                  </View>
                  <View style={styles.actionItem}>
                    <Ionicons name="swap-horizontal-outline" size={20} color={theme.colors.white} />
                    <Text style={styles.actionText}>Virement</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {accounts.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color={theme.colors.gray400} />
            <Text style={styles.emptyText}>Aucun compte bancaire</Text>
          </View>
        )}
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
  accountsList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  accountType: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.xs,
  },
  accountNumber: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.white,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  accountBalance: {
    marginBottom: theme.spacing.lg,
  },
  balanceLabel: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: theme.spacing.md,
  },
  actionItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.9)',
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