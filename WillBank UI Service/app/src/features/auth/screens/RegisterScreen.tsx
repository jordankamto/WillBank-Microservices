import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { theme } from '../../../config/theme';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setError('');
    
    // Validation simple
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implémenter l'inscription réelle
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation.replace('Login');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez WillBank aujourd'hui</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Prénom"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="Jean"
              icon={<Ionicons name="person-outline" size={20} color={theme.colors.gray400} />}
            />

            <Input
              label="Nom"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              placeholder="DUPONT"
              icon={<Ionicons name="person-outline" size={20} color={theme.colors.gray400} />}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="jean.dupont@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={theme.colors.gray400} />}
            />

            <Input
              label="Téléphone"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="699123456"
              keyboardType="phone-pad"
              icon={<Ionicons name="call-outline" size={20} color={theme.colors.gray400} />}
            />

            <Input
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              icon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray400} />}
            />

            <Input
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              icon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.gray400} />}
            />

            <Button
              title={loading ? "Inscription..." : "S'inscrire"}
              onPress={handleRegister}
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
            />

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    marginLeft: theme.spacing.sm,
    flex: 1,
    fontSize: theme.typography.sizes.sm,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
});