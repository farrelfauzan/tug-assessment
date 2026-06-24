import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { loginSchema } from '@tug/api-schemas';
import { useAuthSession } from '../hooks/use-auth-session';
import { login } from '../services/auth-api';
import type { AuthStackParamList } from '../../../navigation/types';
import { useToast } from '../../../providers/toast-provider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({}: Props): JSX.Element {
  const { signIn } = useAuthSession();
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session);
      showToast('Welcome back!');
    },
    onError: () => {
      showToast('Login failed. Please check your credentials.', 'error');
    }
  });

  const form = useForm({
    defaultValues: {
      email: 'admin@example.com',
      password: 'Admin123!'
    },
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value);

      if (!parsed.success) {
        showToast(parsed.error.issues[0]?.message ?? 'Invalid login form', 'error');
        return;
      }

      await loginMutation.mutateAsync(parsed.data);
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Use seeded account to continue</Text>

      <form.Field
        name="email"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              secureTextEntry
              style={styles.input}
            />
          </View>
        )}
      />

      <Pressable
        style={styles.submitButton}
        onPress={() => form.handleSubmit()}
        disabled={loginMutation.isPending}
      >
        <Text style={styles.submitButtonText}>
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f4f7fb',
    padding: 18,
    gap: 12
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1b2a41'
  },
  subtitle: {
    color: '#49617e',
    marginBottom: 8
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
    marginTop: 8,
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
