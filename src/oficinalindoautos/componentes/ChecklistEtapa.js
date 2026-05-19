import React from 'react';
import { View, Text } from 'react-native';

import styles from '../styles/servicoStyles';

export default function ChecklistEtapa({ etapas }) {
  return (
    <View>
      <Text style={styles.subtitulo}>
        Checklist
      </Text>

      {etapas.map((etapa, index) => (
        <Text key={index}>
          • {etapa}
        </Text>
      ))}
    </View>
  );
}
