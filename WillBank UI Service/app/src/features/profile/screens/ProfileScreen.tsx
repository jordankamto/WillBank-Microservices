import React from 'react';
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
import { useAuth } from '../../../core/auth/AuthContext';
import { Card } from '../../../shared/components/Card';
import { theme } from '../../../config/theme';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: '1',
      icon: 'person-outline',
      label: 'Informations personnelles',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: '2',
      icon: 'shield-checkmark-outline',
      label: 'Sécurité',
      onPress: () => {},
    },
    {
      id: '3',
      icon: 'notifications-outline',
      label: 'Notifications',
      onPress: () => {},
    },
    {
      id: '4',
      icon: 'settings-outline',
      label: 'Paramètres',
      onPress: () => {},
    },
    {
      id: '5',
      icon: 'help-circle-outline',
      label: 'Aide & Support',
      onPress: () => {},
    },
    {
      id: '6',
      icon: 'document-text-outline',
      label: 'Conditions d\'utilisation',
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header avec profil */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.email || 'Utilisateur'}</Text>
          <Text style={styles.userRole}>Client WillBank</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={theme.colors.primary} 
                  />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.gray400} 
              />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2026 WillBank - Équipe SI-5</Text>
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
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  userName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  userRole: {
    fontSize: theme.typography.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    marginTop: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  menuCard: {
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.weights.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
    gap: theme.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.danger,
    fontWeight: theme.typography.weights.semibold,
  },
  version: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray400,
    marginBottom: theme.spacing.xs,
  },
  copyright: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray400,
    marginBottom: theme.spacing.xl,
  },
});
