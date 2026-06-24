import { NavigationContainer } from '@react-navigation/native';
import { MainTabs } from './tabs/main-tabs';

export function RootNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
