import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useWellnessPackageDetail } from '../hooks/use-wellness-packages';
import type { PackagesStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<PackagesStackParamList, 'PackageDetail'>;

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function PackageDetailScreen({ navigation, route }: Props): JSX.Element {
  const { packageId } = route.params;
  const { data, isLoading, isError, refetch } = useWellnessPackageDetail(packageId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading package detail...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Failed to load package detail.</Text>
        <Pressable style={styles.actionButton} onPress={() => refetch()}>
          <Text style={styles.actionButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.meta}>{formatPrice(data.price)}</Text>
      <Text style={styles.meta}>{data.durationWeeks} weeks</Text>
      <Text style={styles.description}>{data.description}</Text>

      <Pressable
        style={styles.reviewButton}
        onPress={() =>
          navigation.navigate('PackageReviews', {
            packageId: data.id,
            packageName: data.name
          })
        }
      >
        <Text style={styles.reviewButtonText}>See Reviews</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate('CreateReview', {
            packageId: data.id,
            packageName: data.name
          })
        }
      >
        <Text style={styles.secondaryButtonText}>Write Review</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    gap: 10,
    backgroundColor: '#f4f7fb',
    minHeight: '100%'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b2a41'
  },
  meta: {
    fontSize: 14,
    color: '#49617e'
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
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
  },
  reviewButton: {
    marginTop: 12,
    backgroundColor: '#1e4c84',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  reviewButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  secondaryButton: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e4c84',
    alignSelf: 'flex-start'
  },
  secondaryButtonText: {
    color: '#1e4c84',
    fontWeight: '600'
  }
});
