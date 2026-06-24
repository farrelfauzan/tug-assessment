import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useOrderDetail } from '../hooks/use-orders';
import type { OrdersStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function OrderDetailScreen({ route }: Props): JSX.Element {
  const { orderId } = route.params;
  const { data, isLoading, isError } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading order detail...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Failed to load order detail.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{data.wellnessPackage.name}</Text>
      <Text style={styles.meta}>Order ID: {data.id}</Text>
      <Text style={styles.meta}>Status: {data.status}</Text>
      <Text style={styles.meta}>Total: {formatPrice(data.totalAmount)}</Text>
      <Text style={styles.meta}>Payment: {data.payment?.provider ?? 'Pending'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
    backgroundColor: '#f4f7fb',
    minHeight: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b2a41'
  },
  meta: {
    color: '#49617e'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  statusText: {
    color: '#2f435d'
  }
});
