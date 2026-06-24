import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useOrders } from '../hooks/use-orders';
import type { OrderListItem } from '../types/order-types';
import type { OrdersStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrdersList'>;

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function OrdersListScreen({ navigation }: Props): JSX.Element {
  const { data, isLoading, isError, refetch, isRefetching } = useOrders();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading orders...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Failed to load orders.</Text>
        <Pressable style={styles.actionButton} onPress={() => refetch()}>
          <Text style={styles.actionButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const items = data?.items ?? [];

  const renderItem = ({ item }: { item: OrderListItem }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      >
        <Text style={styles.title}>{item.wellnessPackage.name}</Text>
        <Text style={styles.meta}>Status: {item.status}</Text>
        <Text style={styles.meta}>Total: {formatPrice(item.totalAmount)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      <Pressable style={styles.createButton} onPress={() => navigation.navigate('OrderCreate')}>
        <Text style={styles.createButtonText}>Create New Order</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.statusText}>No orders yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f7fb'
  },
  createButton: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    backgroundColor: '#1e4c84',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center'
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  listContainer: {
    padding: 16,
    gap: 10,
    backgroundColor: '#f4f7fb'
  },
  emptyContainer: {
    flexGrow: 1,
    backgroundColor: '#f4f7fb'
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e4f3',
    borderRadius: 12,
    padding: 14,
    gap: 4
  },
  title: {
    fontSize: 16,
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
    padding: 24,
    gap: 10
  },
  statusText: {
    color: '#2f435d'
  },
  actionButton: {
    backgroundColor: '#1e4c84',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  }
});
