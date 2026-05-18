import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { nome: string; descricao: string; data: string };

export default function CartaoAvaliacao({ nome, descricao, data }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}><Text style={styles.icone}>ℹ️</Text></View>
      <View style={styles.txt}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.descricao}>{descricao}</Text>
        <Text style={styles.data}>{data}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderColor: '#000', backgroundColor: '#fff', padding: 12, flexDirection: 'row', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderWidth: 2, borderColor: '#007AFF', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icone: { fontSize: 22 },
  txt: { flex: 1 },
  nome: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  descricao: { fontSize: 12, color: '#666', marginBottom: 6 },
  data: { fontSize: 11, color: '#999' },
});
