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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../../core/auth/AuthContext';
import profileService from '../services/profileService';
import { Spinner } from '../../../shared/components/Spinner';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Card } from '../../../shared/components/Card';
import { theme } from '../../../config/theme';
import { Customer } from '../../../types/api.types';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user?.customerId) return;

    try {
      setLoading(true);
      const data = await profileService.getCustomerProfile(user.customerId) as Customer;
      setCustomer(data);

      // Initialize form with current data
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      Alert.alert('Erreur', 'Impossible de charger les informations du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.customerId || !firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Adresse email invalide');
      return;
    }

    try {
      setSaving(true);
      await profileService.updateCustomerProfile(user.customerId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
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
          <Text style={styles.headerTitle}>Modifier le profil</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <Input
            label="Prénom *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Votre prénom"
            containerStyle={styles.input}
          />

          <Input
            label="Nom *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Votre nom"
            containerStyle={styles.input}
          />

          <Input
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.input}
          />

          <Input
            label="Téléphone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+237 6XX XXX XXX"
            keyboardType="phone-pad"
            containerStyle={styles.input}
          />

          <Input
            label="Adresse"
            value={address}
            onChangeText={setAddress}
            placeholder="Votre adresse"
            multiline
            numberOfLines={3}
            containerStyle={styles.input}
          />

          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              Les champs marqués d'un * sont obligatoires
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Annuler"
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="large"
              fullWidth
              style={styles.cancelButton}
            />
            <Button
              title={saving ? "Enregistrement..." : "Enregistrer"}
              onPress={handleSave}
              variant="primary"
              size="large"
              fullWidth
              loading={saving}
              disabled={saving}
            />
          </View>
        </Card>

        {/* Informations du compte */}
        {customer && (
          <Card style={styles.accountInfoCard}>
            <Text style={styles.sectionTitle}>Informations du compte</Text>

            <View style={styles.accountDetail}>
              <Text style={styles.detailLabel}>ID Client</Text>
              <Text style={styles.detailValue}>{customer.id}</Text>
            </View>

            <View style={styles.accountDetail}>
              <Text style={styles.detailLabel}>Statut</Text>
              <Text style={styles.detailValue}>
                {customer.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </Text>
            </View>

            <View style={styles.accountDetail}>
              <Text style={styles.detailLabel}>Créé le</Text>
              <Text style={styles.detailValue}>
                {new Date(customer.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </Card>
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
    padding: theme.spacing.lg,
  },
  formCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.info + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.info,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  cancelButton: {
    marginBottom: 0,
  },
  accountInfoCard: {
    padding: theme.spacing.lg,
  },
  accountDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
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
});
