import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from '@tanstack/react-form';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { CURRENT_USER_ID } from '../../../constants/current-user';
import { useToast } from '../../../providers/toast-provider';
import { useWellnessPackages } from '../../wellness-packages/hooks/use-wellness-packages';
import { useCreateOrder } from '../hooks/use-orders';
import type { OrdersStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderCreate'>;

const createOrderFormSchema = z.object({
  packageId: z.string().uuid('Select a valid package ID'),
  quantity: z.coerce.number().int().min(1, 'Minimum quantity is 1')
});

export function OrderCreateScreen({ navigation }: Props): JSX.Element {
  const { showToast } = useToast();
  const createOrderMutation = useCreateOrder();
  const packagesQuery = useWellnessPackages('');

  const activePackageIds = useMemo(() => {
    return packagesQuery.data?.items.map((item) => item.id).join(', ') ?? 'Loading package IDs...';
  }, [packagesQuery.data]);

  const form = useForm({
    defaultValues: {
      packageId: '',
      quantity: 1
    },
    onSubmit: async ({ value }) => {
      const parsed = createOrderFormSchema.safeParse(value);
      if (!parsed.success) {
        showToast(parsed.error.issues[0]?.message ?? 'Invalid order form', 'error');
        return;
      }

      await createOrderMutation.mutateAsync({
        userId: CURRENT_USER_ID,
        wellnessPackageId: parsed.data.packageId,
        quantity: parsed.data.quantity,
        paymentProvider: 'STRIPE'
      });

      showToast('Order created successfully');
      navigation.navigate('OrdersList');
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.note}>Available package IDs: {activePackageIds}</Text>

      <form.Field
        name="packageId"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Package ID</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Enter package UUID"
              style={styles.input}
            />
          </View>
        )}
      />

      <form.Field
        name="quantity"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={String(field.state.value)}
              onChangeText={(nextValue) => field.handleChange(Number(nextValue) || 1)}
              onBlur={field.handleBlur}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        )}
      />

      <Pressable
        style={styles.submitButton}
        onPress={() => form.handleSubmit()}
        disabled={createOrderMutation.isPending}
      >
        <Text style={styles.submitButtonText}>
          {createOrderMutation.isPending ? 'Creating Order...' : 'Create Order'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: '#f4f7fb',
    minHeight: '100%'
  },
  note: {
    color: '#49617e',
    fontSize: 12
  },
  fieldGroup: {
    gap: 6
  },
  label: {
    color: '#1b2a41',
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c9d7ea',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  submitButton: {
    marginTop: 4,
    backgroundColor: '#1e4c84',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  }
});
