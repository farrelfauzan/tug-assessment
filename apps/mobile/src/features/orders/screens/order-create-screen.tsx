import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from '@tanstack/react-form';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { z } from 'zod';
import { useAuthSession } from '../../auth/hooks/use-auth-session';
import { useToast } from '../../../providers/toast-provider';
import { useWellnessPackages } from '../../wellness-packages/hooks/use-wellness-packages';
import { useCreateOrder } from '../hooks/use-orders';
import type { OrdersStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderCreate'>;

const createOrderFormSchema = z.object({
  packageId: z.string().uuid('Please select a package'),
  quantityText: z
    .string()
    .min(1, 'Quantity is required')
    .regex(/^\d+$/, 'Quantity must be a number')
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function OrderCreateScreen({ navigation }: Props): JSX.Element {
  const { session } = useAuthSession();
  const { showToast } = useToast();
  const createOrderMutation = useCreateOrder();
  const packagesQuery = useWellnessPackages('');

  const form = useForm({
    defaultValues: {
      packageId: '',
      quantityText: '1'
    },
    onSubmit: async ({ value }) => {
      const parsed = createOrderFormSchema.safeParse(value);
      if (!parsed.success) {
        showToast(parsed.error.issues[0]?.message ?? 'Invalid order form', 'error');
        return;
      }

      const quantity = Number(parsed.data.quantityText);
      if (!Number.isInteger(quantity) || quantity < 1) {
        showToast('Minimum quantity is 1', 'error');
        return;
      }

      if (!session) {
        showToast('Session missing. Please sign in again.', 'error');
        return;
      }

      await createOrderMutation.mutateAsync({
        userId: session.user.id,
        wellnessPackageId: parsed.data.packageId,
        quantity,
        paymentProvider: 'STRIPE'
      });

      showToast('Order created successfully');
      navigation.navigate('OrdersList');
    }
  });

  if (packagesQuery.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading available packages...</Text>
      </View>
    );
  }

  if (packagesQuery.isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Failed to load packages.</Text>
        <Pressable style={styles.retryButton} onPress={() => packagesQuery.refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  const packages = packagesQuery.data?.items ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Choose a package</Text>

      <form.Field
        name="packageId"
        children={(field) => (
          <View style={styles.fieldGroup}>
            {packages.map((item) => {
              const selected = field.state.value === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => field.handleChange(item.id)}
                  style={[styles.packageCard, selected ? styles.packageCardSelected : null]}
                >
                  <Text style={styles.packageName}>{item.name}</Text>
                  <Text style={styles.packageMeta}>{formatPrice(item.price)}</Text>
                  <Text style={styles.packageMeta}>{item.durationWeeks} weeks</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />

      <form.Field
        name="quantityText"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={field.state.value}
              onChangeText={(nextValue) => {
                const sanitized = nextValue.replace(/[^0-9]/g, '');
                field.handleChange(sanitized);
              }}
              onBlur={() => {
                field.handleBlur();
                if (field.state.value.length === 0) {
                  field.handleChange('1');
                }
              }}
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
  heading: {
    color: '#1b2a41',
    fontWeight: '700',
    fontSize: 16
  },
  fieldGroup: {
    gap: 6
  },
  packageCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c9d7ea',
    borderRadius: 10,
    padding: 12,
    gap: 4
  },
  packageCardSelected: {
    borderColor: '#1e4c84',
    backgroundColor: '#eaf1fb'
  },
  packageName: {
    color: '#1b2a41',
    fontWeight: '700'
  },
  packageMeta: {
    color: '#49617e'
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 10
  },
  statusText: {
    color: '#2f435d'
  },
  retryButton: {
    backgroundColor: '#1e4c84',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600'
  }
});
