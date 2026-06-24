'use client';

import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { saveTokens } from '../../../lib/auth';
import { showErrorToast, showSuccessToast } from '../../../lib/toast';
import { loginSchema } from '../../../features/auth/schemas/login.schema';
import { login } from '../../../features/auth/services/auth.service';

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      showSuccessToast('Login successful');
      router.replace('/dashboard');
    },
    onError: () => {
      showErrorToast('Login failed. Please check your credentials.');
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
        showErrorToast(parsed.error.issues[0]?.message ?? 'Invalid form');
        return;
      }

      await loginMutation.mutateAsync(parsed.data);
    }
  });

  return (
    <main className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to manage wellness packages, orders, and reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
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
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors[0] ? (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  ) : null}
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
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">Password</span>
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors[0] ? (
                    <span className="text-xs text-destructive">{field.state.meta.errors[0]}</span>
                  ) : null}
                </label>
              )}
            </form.Field>

            <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
