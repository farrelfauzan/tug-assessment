import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthSession } from '../../auth/hooks/use-auth-session';

export function ProfileScreen(): JSX.Element {
  const { session, signOut } = useAuthSession();

  const fullName = session
    ? `${session.user.firstName} ${session.user.lastName}`
    : 'Not signed in';
  const email = session?.user.email ?? '-';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{fullName}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b2a41'
  },
  card: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d9e4f3',
    padding: 14,
    gap: 6
  },
  label: {
    fontSize: 12,
    color: '#49617e'
  },
  value: {
    fontSize: 16,
    color: '#1b2a41',
    marginBottom: 8
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#a12d2f',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  }
});
