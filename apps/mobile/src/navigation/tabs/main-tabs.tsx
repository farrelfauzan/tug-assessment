import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from '../../features/profile/screens/profile-screen';
import { ReviewsListScreen } from '../../features/reviews/screens/reviews-list-screen';
import { OrdersStack } from '../stacks/orders-stack';
import { PackagesStack } from '../stacks/packages-stack';
import type { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs(): JSX.Element {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Browse"
        component={PackagesStack}
        options={{ headerShown: false, title: 'Browse' }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{ headerShown: false, title: 'Orders' }}
      />
      <Tab.Screen name="Reviews" component={ReviewsListScreen} options={{ title: 'Reviews' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
