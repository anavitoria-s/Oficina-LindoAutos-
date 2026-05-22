import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PressableAnimado from './PressableAnimado';

type Props = { titulo: string; icone?: string; variante?: 'azul' | 'branco'; onPress?: () => void };

export default function BotaoCartao({ titulo, icone, variante = 'azul', onPress }: Props) {
  return (
    <PressableAnimado
      style={[styles.btn, variante === 'azul' ? styles.azul : styles.branco]}
      onPress={onPress}
    >
      <Text style={styles.icone}>{icone}</Text>
      <Text style={[styles.titulo, variante === 'branco' && styles.preto]}>{titulo}</Text>
    </PressableAnimado>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  azul: { backgroundColor: '#007AFF' },
  branco: { backgroundColor: '#fff' },
  icone: { fontSize: 28, marginBottom: 8, color: '#fff' },
  titulo: { color: '#fff', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  preto: { color: '#000' },
});

