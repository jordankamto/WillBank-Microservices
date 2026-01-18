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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../core/auth/AuthContext';
import notificationService from '../services/notificationService';
import { Spinner } from '../../../shared/components/Spinner';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { formatRelativeDate } from '../../../core/utils/formatters';
import { theme } from '../../../config/theme';
import { Notification } from '../../../types/api.types';

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user?.customerId) return;

    try {
      setLoading(true);
      const data = await notificationService.getNotificationsByCustomerId(user.customerId) as Notification[];
      // Trier par date décroissante
      const sortedNotifications = data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('transaction') || lowerTitle.includes('paiement')) {
      return 'card-outline';
    } else if (lowerTitle.includes('compte') || lowerTitle.includes('solde')) {
      return 'wallet-outline';
    } else if (lowerTitle.includes('sécurité') || lowerTitle.includes('connexion')) {
      return 'shield-checkmark-outline';
    } else {
      return 'notifications-outline';
    }
  };

  const getNotificationColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('transaction') || lowerTitle.includes('paiement')) {
      return theme.colors.success;
    } else if (lowerTitle.includes('compte') || lowerTitle.includes('solde')) {
      return theme.colors.primary;
    } else if (lowerTitle.includes('sécurité') || lowerTitle.includes('connexion')) {
      return theme.colors.warning;
    } else {
      return theme.colors.info;
    }
  };

  const markAsRead = (notificationId: string) => {
    // Simulation de marquage comme lu
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, status: 'READ' }
          : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => n.status !== 'READ').length;

  if (loading && notifications.length === 0) {
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Badge
              text={unreadCount.toString()}
              variant="danger"
              style={styles.unreadBadge}
            />
          )}
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

        <View style={styles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  notification.status !== 'READ' && styles.notificationUnread,
                ]}
                onPress={() => markAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons
                    name={getNotificationIcon(notification.title) as any}
                    size={24}
                    color={getNotificationColor(notification.title)}
                  />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    {notification.status !== 'READ' && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationDate}>
                    {formatRelativeDate(notification.createdAt)}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.gray400}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={64} color={theme.colors.gray400} />
              <Text style={styles.emptyText}>Aucune notification</Text>
              <Text style={styles.emptySubtext}>
                Vous serez notifié des activités importantes de votre compte
              </Text>
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
    flex: 1,
  },
  unreadBadge: {
    marginLeft: theme.spacing.sm,
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
  notificationsList: {
    padding: theme.spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  notificationTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  notificationMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  notificationDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.gray500,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.gray400,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.gray400,
    textAlign: 'center',
    lineHeight: 18,
  },
});
