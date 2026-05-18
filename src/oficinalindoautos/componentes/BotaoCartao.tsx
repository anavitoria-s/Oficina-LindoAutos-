import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = { titulo: string; icone?: string; variante?: 'azul' | 'branco'; onPress?: () => void };

export default function BotaoCartao({ titulo, icone, variante = 'azul', onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.btn, variante === 'azul' ? styles.azul : styles.branco]}
      onPress={onPress}
    >
      <Text style={styles.icone}>{icone}</Text>
      <Text style={[styles.titulo, variante === 'branco' && styles.preto]}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#000',
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  azul: { backgroundColor: '#007AFF' },
  branco: { backgroundColor: '#fff' },
  icone: { fontSize: 28, marginBottom: 8, color: '#fff' },
  titulo: { color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  preto: { color: '#000' },
});
