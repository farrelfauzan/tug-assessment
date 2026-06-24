import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from '@tanstack/react-form';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import { useAuthSession } from '../../auth/hooks/use-auth-session';
import type { PackagesStackParamList } from '../../../navigation/types';
import { useToast } from '../../../providers/toast-provider';
import { useCreateReview } from '../hooks/use-create-review';

type Props = NativeStackScreenProps<PackagesStackParamList, 'CreateReview'>;

const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000)
});

export function CreateReviewScreen({ navigation, route }: Props): JSX.Element {
  const { packageId, packageName } = route.params;
  const { session } = useAuthSession();
  const { showToast } = useToast();
  const createReviewMutation = useCreateReview();

  const form = useForm({
    defaultValues: {
      rating: 5,
      comment: ''
    },
    onSubmit: async ({ value }) => {
      const parsed = createReviewSchema.safeParse(value);
      if (!parsed.success) {
        showToast(parsed.error.issues[0]?.message ?? 'Invalid review form', 'error');
        return;
      }

      if (!session) {
        showToast('Session missing. Please sign in again.', 'error');
        return;
      }

      await createReviewMutation.mutateAsync({
        userId: session.user.id,
        wellnessPackageId: packageId,
        rating: parsed.data.rating,
        comment: parsed.data.comment
      });

      showToast('Review submitted');
      navigation.navigate('PackageReviews', { packageId, packageName });
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review for {packageName}</Text>

      <form.Field
        name="rating"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Rating (1-5)</Text>
            <TextInput
              value={String(field.state.value)}
              onChangeText={(nextValue) => field.handleChange(Number(nextValue) || 1)}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
        )}
      />

      <form.Field
        name="comment"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Comment</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.multilineInput]}
              placeholder="Share your experience"
            />
          </View>
        )}
      />

      <Pressable
        style={styles.submitButton}
        onPress={() => form.handleSubmit()}
        disabled={createReviewMutation.isPending}
      >
        <Text style={styles.submitButtonText}>
          {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b2a41'
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
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top'
  },
  submitButton: {
    marginTop: 6,
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
