import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text } from 'react-native';

export default function App(): JSX.Element {
  return (
    <SafeAreaView>
      <Text>Mobile app is running.</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
