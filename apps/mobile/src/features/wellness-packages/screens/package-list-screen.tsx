import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useWellnessPackages } from '../hooks/use-wellness-packages';
import type { WellnessPackageItem } from '../types/wellness-package-types';
import type { PackagesStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<PackagesStackParamList, 'PackageList'>;

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function PackageListScreen({ navigation }: Props): JSX.Element {
  const [searchInput, setSearchInput] = useState('');
  const search = useMemo(() => searchInput.trim(), [searchInput]);
  const { data, isLoading, isError, refetch, isRefetching } = useWellnessPackages(search);

  const items = data?.items ?? [];

  const renderItem = ({ item }: { item: WellnessPackageItem }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('PackageDetail', { packageId: item.id })}
      >
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>{formatPrice(item.price)}</Text>
        <Text style={styles.meta}>{item.durationWeeks} weeks</Text>
        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading packages...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Failed to load packages.</Text>
        <Pressable style={styles.actionButton} onPress={() => refetch()}>
          <Text style={styles.actionButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search packages"
        value={searchInput}
        onChangeText={setSearchInput}
        style={styles.searchInput}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.statusText}>No packages found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb'
  },
  searchInput: {
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c9d7ea',
    backgroundColor: '#ffffff'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d9e4f3'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b2a41'
  },
  meta: {
    marginTop: 2,
    fontSize: 13,
    color: '#49617e'
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: '#2f435d'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 10
  },
  statusText: {
    textAlign: 'center',
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
