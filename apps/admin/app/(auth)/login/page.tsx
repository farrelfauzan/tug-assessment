'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { saveTokens } from '../../../lib/auth';
import { showToast } from '../../../lib/toast';
import { loginSchema } from '../../../features/auth/schemas/login.schema';
import { login } from '../../../features/auth/services/auth.service';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      showToast('Login successful');
      router.replace('/dashboard');
    },
    onError: () => {
      showToast('Login failed. Please check your credentials.');
    }
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value);
      if (!parsed.success) {
        showToast(parsed.error.issues[0]?.message ?? 'Invalid form');
        return;
      }

      await loginMutation.mutateAsync(parsed.data);
    }
  });

  return (
    <main className="card">
      <h1 className="title">Welcome back</h1>
      <p className="muted">Sign in to manage wellness packages, orders, and reviews.</p>
      <form
        className="form"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              loginSchema.shape.email.safeParse(value).success ? undefined : 'Invalid email format'
          }}
        >
          {(field) => (
            <label className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors[0] ? <span className="error">{field.state.meta.errors[0]}</span> : null}
            </label>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              loginSchema.shape.password.safeParse(value).success
                ? undefined
                : 'Password must be at least 8 characters'
          }}
        >
          {(field) => (
            <label className="field">
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors[0] ? <span className="error">{field.state.meta.errors[0]}</span> : null}
            </label>
          )}
        </form.Field>

        <button className="button" type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
