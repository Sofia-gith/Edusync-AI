import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConnectivity } from '@/hooks/useConnectivity';
import { Colors } from '@/app/styles/theme';

interface ConnectivityIndicatorProps {
  /**
   * Mostrar informações detalhadas?
   * @default false
   */
  detailed?: boolean;

  /**
   * Callback quando o usuário clica no indicador
   */
  onPress?: () => void;

  /**
   * Estilo customizado
   */
  style?: any;
}

/**
 * Componente que mostra o status de conectividade do dispositivo
 * 
 * Exemplo de uso:
 * ```tsx
 * // Versão simples (badge no header)
 * <ConnectivityIndicator />
 * 
 * // Versão detalhada
 * <ConnectivityIndicator detailed />
 * 
 * // Com ação ao clicar
 * <ConnectivityIndicator 
 *   onPress={() => navigation.navigate('Settings')} 
 * />
 * ```
 */
export const ConnectivityIndicator: React.FC<ConnectivityIndicatorProps> = ({
  detailed = false,
  onPress,
  style,
}) => {
  const { isConnected, type, quality, isLoading } = useConnectivity();

  // ========================================
  // Helpers: Cores e ícones
  // ========================================
  const getStatusColor = () => {
    if (!isConnected) return Colors.error;
    if (type === 'wifi') return Colors.success;
    if (type === 'cellular') return Colors.warning;
    return Colors.textTertiary;
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    if (!isConnected) return 'cloud-offline';
    if (type === 'wifi') return 'wifi';
    if (type === 'cellular') return 'cellular';
    return 'help-circle';
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking...';
    if (!isConnected) return 'Offline';
    if (type === 'wifi') return 'WiFi';
    if (type === 'cellular') return 'Cellular';
    return 'Unknown';
  };

  const getQualityText = () => {
    if (!quality) return null;
    switch (quality.quality) {
      case 'excellent': return '⚡ Excellent';
      case 'good': return '✓ Good';
      case 'fair': return '~ Fair';
      case 'poor': return '✗ Poor';
      default: return null;
    }
  };

  // ========================================
  // Render: Versão simples (badge)
  // ========================================
  if (!detailed) {
    const Container = onPress ? TouchableOpacity : View;
    
    return (
      <Container 
        style={[styles.badge, style]} 
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.badgeText}>{getStatusText()}</Text>
      </Container>
    );
  }

  // ========================================
  // Render: Versão detalhada (card)
  // ========================================
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getStatusIcon()} 
            size={24} 
            color={getStatusColor()} 
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{getStatusText()}</Text>
          {quality && (
            <Text style={[
              styles.cardSubtitle,
              { color: getStatusColor() }
            ]}>
              {getQualityText()} • {quality.latency}ms
            </Text>
          )}
        </View>
      </View>

      {isConnected && (
        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            {type === 'wifi' 
              ? '✓ Best for syncing data' 
              : '⚠️ Consider using WiFi for large downloads'}
          </Text>
        </View>
      )}

      {!isConnected && (
        <View style={[styles.cardFooter, { backgroundColor: '#FEE2E2' }]}>
          <Text style={[styles.footerText, { color: '#991B1B' }]}>
            📱 App works offline. Sync when connected.
          </Text>
        </View>
      )}
    </Container>
  );
};

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Badge (versão simples)
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // Card (versão detalhada)
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  cardFooter: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 16,
  },
});

export default ConnectivityIndicator;