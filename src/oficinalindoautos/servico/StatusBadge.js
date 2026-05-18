import React from 'react';
import { View, Text } from 'react-native';
import styles from './servicoStyles';

export default function StatusBadge({ status }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeTexto}>{status}</Text>
    </View>
  );
}
