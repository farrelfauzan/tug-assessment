import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuthSession } from '../features/auth/hooks/use-auth-session';
import { AuthStack } from './stacks/auth-stack';
import { MainTabs } from './tabs/main-tabs';

export function RootNavigator(): JSX.Element {
  const { isAuthenticated, isHydrated } = useAuthSession();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
