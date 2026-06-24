import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ label }: { label: string }): JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{label}</Text>
    </View>
  );
}

export function MainTabs(): JSX.Element {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Packages" component={() => <PlaceholderScreen label="Packages" />} />
      <Tab.Screen name="Orders" component={() => <PlaceholderScreen label="Orders" />} />
      <Tab.Screen name="Profile" component={() => <PlaceholderScreen label="Profile" />} />
    </Tab.Navigator>
  );
}
