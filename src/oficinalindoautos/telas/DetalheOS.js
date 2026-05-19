import React from 'react';
import { View, Text } from 'react-native';

import ChecklistEtapa from '../components/ChecklistEtapa';
import styles from '../styles/servicoStyles';

export default function DetalheOS() {
  const etapas = [
    'Lixamento',
    'Pintura',
    'Polimento'
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Detalhes da Ordem
      </Text>

      <Text style={styles.label}>
        Cliente:
      </Text>

      <Text>João Silva</Text>

      <Text style={styles.label}>
        Veículo:
      </Text>

      <Text>Honda Civic 2019</Text>

      <Text style={styles.label}>
        Status:
      </Text>

      <Text>Em reparo</Text>

      <ChecklistEtapa etapas={etapas} />
    </View>
  );
}
