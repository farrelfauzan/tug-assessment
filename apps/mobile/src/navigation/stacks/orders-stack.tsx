import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderCreateScreen } from '../../features/orders/screens/order-create-screen';
import { OrderDetailScreen } from '../../features/orders/screens/order-detail-screen';
import { OrdersListScreen } from '../../features/orders/screens/orders-list-screen';
import type { OrdersStackParamList } from '../types';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export function OrdersStack(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrdersList" component={OrdersListScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Order Detail' }}
      />
      <Stack.Screen
        name="OrderCreate"
        component={OrderCreateScreen}
        options={{ title: 'Create Order' }}
      />
    </Stack.Navigator>
  );
}
