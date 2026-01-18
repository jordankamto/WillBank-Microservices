import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../core/auth/AuthContext';
import transactionService from '../services/transactionService';
import accountService from '../../accounts/services/accountService';
import { Spinner } from '../../../shared/components/Spinner';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card } from '../../../shared/components/Card';
import { formatCurrency } from '../../../core/utils/formatters';
import { BUSINESS_RULES, ACCOUNT_TYPE_LABELS } from '../../../config/constants';
import { theme } from '../../../config/theme';
import { Account } from '../../../types/api.types';

type TabType = 'deposit' | 'withdraw' | 'transfer';

// Composant pour le dépôt
const DepositTab: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const { user } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!selectedAccount || !amount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte et saisir un montant');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < BUSINESS_RULES.MIN_DEPOSIT) {
      Alert.alert('Erreur', `Le montant minimum de dépôt est de ${BUSINESS_RULES.MIN_DEPOSIT} XAF`);
      return;
    }

    try {
      setLoading(true);
      await transactionService.deposit({
        accountId: selectedAccount.id,
        amount: numAmount,
        description: description || 'Dépôt',
      });

      Alert.alert('Succès', 'Dépôt effectué avec succès', [
        { text: 'OK', onPress: () => {
          setAmount('');
          setDescription('');
          setSelectedAccount(null);
        }}
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors du dépôt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.formCard}>
        <Text style={styles.tabTitle}>Effectuer un dépôt</Text>

        {/* Sélection du compte */}
        <Text style={styles.label}>Sélectionner un compte</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.accountOption,
              selectedAccount?.id === account.id && styles.accountSelected,
            ]}
            onPress={() => setSelectedAccount(account)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountType}>
                {ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}
              </Text>
              <Text style={styles.accountNumber}>**** {account.id.slice(-4)}</Text>
            </View>
            <Text style={styles.accountBalance}>
              {formatCurrency(account.balance)}
            </Text>
            {selectedAccount?.id === account.id && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Montant */}
        <Input
          label="Montant (XAF)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.input}
        />

        {/* Description */}
        <Input
          label="Description (optionnel)"
          value={description}
          onChangeText={setDescription}
          placeholder="Motif du dépôt"
          containerStyle={styles.input}
        />

        <Button
          title="Effectuer le dépôt"
          onPress={handleDeposit}
          variant="success"
          size="large"
          fullWidth
          loading={loading}
          disabled={!selectedAccount || !amount || loading}
        />
      </Card>
    </ScrollView>
  );
};

// Composant pour le retrait
const WithdrawTab: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte et saisir un montant');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < BUSINESS_RULES.MIN_TRANSFER) {
      Alert.alert('Erreur', `Le montant minimum de retrait est de ${BUSINESS_RULES.MIN_TRANSFER} XAF`);
      return;
    }

    if (numAmount > selectedAccount.balance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    if (numAmount > BUSINESS_RULES.MAX_WITHDRAWAL) {
      Alert.alert('Erreur', `Le montant maximum de retrait est de ${BUSINESS_RULES.MAX_WITHDRAWAL} XAF`);
      return;
    }

    try {
      setLoading(true);
      await transactionService.withdraw({
        accountId: selectedAccount.id,
        amount: numAmount,
        description: description || 'Retrait',
      });

      Alert.alert('Succès', 'Retrait effectué avec succès', [
        { text: 'OK', onPress: () => {
          setAmount('');
          setDescription('');
          setSelectedAccount(null);
        }}
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors du retrait');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.formCard}>
        <Text style={styles.tabTitle}>Effectuer un retrait</Text>

        {/* Sélection du compte */}
        <Text style={styles.label}>Sélectionner un compte</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.accountOption,
              selectedAccount?.id === account.id && styles.accountSelected,
            ]}
            onPress={() => setSelectedAccount(account)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountType}>
                {ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}
              </Text>
              <Text style={styles.accountNumber}>**** {account.id.slice(-4)}</Text>
            </View>
            <Text style={styles.accountBalance}>
              {formatCurrency(account.balance)}
            </Text>
            {selectedAccount?.id === account.id && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Montant */}
        <Input
          label="Montant (XAF)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.input}
        />

        {/* Description */}
        <Input
          label="Description (optionnel)"
          value={description}
          onChangeText={setDescription}
          placeholder="Motif du retrait"
          containerStyle={styles.input}
        />

        <Button
          title="Effectuer le retrait"
          onPress={handleWithdraw}
          variant="danger"
          size="large"
          fullWidth
          loading={loading}
          disabled={!selectedAccount || !amount || loading}
        />
      </Card>
    </ScrollView>
  );
};

// Composant pour le virement
const TransferTab: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const [fromAccount, setFromAccount] = useState<Account | null>(null);
  const [toAccount, setToAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!fromAccount || !toAccount || !amount) {
      Alert.alert('Erreur', 'Veuillez sélectionner les comptes et saisir un montant');
      return;
    }

    if (fromAccount.id === toAccount.id) {
      Alert.alert('Erreur', 'Les comptes source et destination doivent être différents');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < BUSINESS_RULES.MIN_TRANSFER) {
      Alert.alert('Erreur', `Le montant minimum de virement est de ${BUSINESS_RULES.MIN_TRANSFER} XAF`);
      return;
    }

    if (numAmount > fromAccount.balance) {
      Alert.alert('Erreur', 'Solde insuffisant sur le compte source');
      return;
    }

    if (numAmount > BUSINESS_RULES.MAX_TRANSFER) {
      Alert.alert('Erreur', `Le montant maximum de virement est de ${BUSINESS_RULES.MAX_TRANSFER} XAF`);
      return;
    }

    try {
      setLoading(true);
      await transactionService.transfer({
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount: numAmount,
        description: description || 'Virement',
      });

      Alert.alert('Succès', 'Virement effectué avec succès', [
        { text: 'OK', onPress: () => {
          setAmount('');
          setDescription('');
          setFromAccount(null);
          setToAccount(null);
        }}
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors du virement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.formCard}>
        <Text style={styles.tabTitle}>Effectuer un virement</Text>

        {/* Compte source */}
        <Text style={styles.label}>Compte source</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={`from-${account.id}`}
            style={[
              styles.accountOption,
              fromAccount?.id === account.id && styles.accountSelected,
            ]}
            onPress={() => setFromAccount(account)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountType}>
                {ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}
              </Text>
              <Text style={styles.accountNumber}>**** {account.id.slice(-4)}</Text>
            </View>
            <Text style={styles.accountBalance}>
              {formatCurrency(account.balance)}
            </Text>
            {fromAccount?.id === account.id && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Compte destination */}
        <Text style={styles.label}>Compte destination</Text>
        {accounts.map((account) => (
          <TouchableOpacity
            key={`to-${account.id}`}
            style={[
              styles.accountOption,
              toAccount?.id === account.id && styles.accountSelected,
              fromAccount?.id === account.id && styles.accountDisabled,
            ]}
            onPress={() => fromAccount?.id !== account.id && setToAccount(account)}
            disabled={fromAccount?.id === account.id}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountType}>
                {ACCOUNT_TYPE_LABELS[account.type as keyof typeof ACCOUNT_TYPE_LABELS]}
              </Text>
              <Text style={styles.accountNumber}>**** {account.id.slice(-4)}</Text>
            </View>
            <Text style={styles.accountBalance}>
              {formatCurrency(account.balance)}
            </Text>
            {toAccount?.id === account.id && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Montant */}
        <Input
          label="Montant (XAF)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
          containerStyle={styles.input}
        />

        {/* Description */}
        <Input
          label="Description (optionnel)"
          value={description}
          onChangeText={setDescription}
          placeholder="Motif du virement"
          containerStyle={styles.input}
        />

        <Button
          title="Effectuer le virement"
          onPress={handleTransfer}
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={!fromAccount || !toAccount || !amount || loading}
        />
      </Card>
    </ScrollView>
  );
};

// Écran principal avec les onglets
export const NewTransactionScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('deposit');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    if (!user?.customerId) return;

    try {
      setLoading(true);
      const data = await accountService.getAccountsByCustomerId(user.customerId) as Account[];
      setAccounts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des comptes:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'deposit' as TabType, label: 'Dépôt', icon: 'arrow-down-circle' },
    { key: 'withdraw' as TabType, label: 'Retrait', icon: 'arrow-up-circle' },
    { key: 'transfer' as TabType, label: 'Virement', icon: 'swap-horizontal' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'deposit':
        return <DepositTab accounts={accounts} />;
      case 'withdraw':
        return <WithdrawTab accounts={accounts} />;
      case 'transfer':
        return <TransferTab accounts={accounts} />;
      default:
        return <DepositTab accounts={accounts} />;
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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
          <Text style={styles.headerTitle}>Nouvelle transaction</Text>
        </View>
      </LinearGradient>

      {/* Custom Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? theme.colors.white : theme.colors.primary}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  tabItemActive: {
    backgroundColor: theme.colors.primary,
  },
  tabLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  tabLabelActive: {
    color: theme.colors.white,
  },
  tabContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  tabTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  accountSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  accountDisabled: {
    opacity: 0.5,
  },
  accountInfo: {
    flex: 1,
  },
  accountType: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  accountNumber: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
    fontFamily: 'monospace',
  },
  accountBalance: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
});
