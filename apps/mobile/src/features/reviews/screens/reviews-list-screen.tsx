import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useOrders } from '../../orders/hooks/use-orders';

export function ReviewsListScreen(): JSX.Element {
  const { data, isLoading } = useOrders();

  const reviewables = useMemo(() => {
    return (data?.items ?? []).map((item) => ({
      id: item.id,
      packageName: item.wellnessPackage.name,
      status: item.status,
      date: new Date(item.orderDate).toLocaleDateString()
    }));
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading review list...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reviewables}
      keyExtractor={(item) => item.id}
      contentContainerStyle={reviewables.length === 0 ? styles.emptyContainer : styles.listContainer}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.statusText}>No completed orders to review yet.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.packageName}</Text>
          <Text style={styles.meta}>Status: {item.status}</Text>
          <Text style={styles.meta}>Order date: {item.date}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
    padding: 24
  },
  statusText: {
    color: '#2f435d'
  }
});
