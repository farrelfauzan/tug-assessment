import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
    </Tab.Navigator>
  );
}
