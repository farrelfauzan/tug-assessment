import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateReviewScreen } from '../../features/reviews/screens/create-review-screen';
import { PackageDetailScreen } from '../../features/wellness-packages/screens/package-detail-screen';
import { PackageListScreen } from '../../features/wellness-packages/screens/package-list-screen';
import { PackageReviewsScreen } from '../../features/wellness-packages/screens/package-reviews-screen';
import type { PackagesStackParamList } from '../types';

const Stack = createNativeStackNavigator<PackagesStackParamList>();

export function PackagesStack(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PackageList"
        component={PackageListScreen}
        options={{ title: 'Wellness Packages' }}
      />
      <Stack.Screen
        name="PackageDetail"
        component={PackageDetailScreen}
        options={{ title: 'Package Detail' }}
      />
      <Stack.Screen
        name="PackageReviews"
        component={PackageReviewsScreen}
        options={{ title: 'Package Reviews' }}
      />
      <Stack.Screen
        name="CreateReview"
        component={CreateReviewScreen}
        options={{ title: 'Write Review' }}
      />
    </Stack.Navigator>
  );
}
