import { StyleSheet, Text, View } from 'react-native';
import { CURRENT_USER_PROFILE } from '../../../constants/current-user';

export function ProfileScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
          {CURRENT_USER_PROFILE.firstName} {CURRENT_USER_PROFILE.lastName}
        </Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{CURRENT_USER_PROFILE.email}</Text>
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
  }
});
