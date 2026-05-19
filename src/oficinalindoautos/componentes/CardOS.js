import React from 'react';
import { View, Text } from 'react-native';

import StatusBadge from './StatusBadge';
import styles from '../styles/servicoStyles';

export default function CardOS({ ordem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>
        {ordem.cliente}
      </Text>

      <Text>{ordem.veiculo}</Text>

      <Text>{ordem.servico}</Text>

      <StatusBadge status={ordem.status} />
    </View>
  );
}
