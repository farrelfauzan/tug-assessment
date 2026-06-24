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
import { usePackageReviews } from '../hooks/use-wellness-packages';
import type { ReviewItem } from '../types/wellness-package-types';
import type { PackagesStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<PackagesStackParamList, 'PackageReviews'>;

function stars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function PackageReviewsScreen({ route }: Props): JSX.Element {
  const { packageId, packageName } = route.params;
  const { data, isLoading, isError, refetch, isRefetching } = usePackageReviews(packageId);

  const reviews = data?.items ?? [];

  const renderItem = ({ item }: { item: ReviewItem }) => {
    return (
      <View style={styles.reviewCard}>
        <Text style={styles.reviewerName}>
          {item.user.firstName} {item.user.lastName}
        </Text>
        <Text style={styles.rating}>{stars(item.rating)}</Text>
        <Text style={styles.comment}>{item.comment ?? 'No comment provided.'}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading reviews...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Failed to load reviews.</Text>
        <Pressable style={styles.actionButton} onPress={() => refetch()}>
          <Text style={styles.actionButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{packageName}</Text>
      <Text style={styles.subheader}>
        Average rating: {data?.averageRating ? data.averageRating.toFixed(1) : 'No rating yet'}
      </Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.statusText}>No reviews yet for this package.</Text>
          </View>
        }
        contentContainerStyle={reviews.length === 0 ? styles.emptyContainer : styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb'
  },
  header: {
    marginTop: 16,
    marginHorizontal: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1b2a41'
  },
  subheader: {
    marginTop: 4,
    marginHorizontal: 16,
    marginBottom: 12,
    color: '#49617e'
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9e4f3',
    borderRadius: 12,
    padding: 12,
    gap: 6
  },
  reviewerName: {
    fontWeight: '700',
    color: '#1b2a41'
  },
  rating: {
    color: '#d08a00'
  },
  comment: {
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
