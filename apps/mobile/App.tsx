import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './src/providers/app-providers';
import { RootNavigator } from './src/navigation/root-navigator';

export default function App(): JSX.Element {
  return (
    <AppProviders>
      <RootNavigator />
      <StatusBar style="auto" />
    </AppProviders>
  );
}
