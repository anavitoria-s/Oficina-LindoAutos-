import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useOficina } from '../context/OficinaContext';

export default function Orcamentos() {
  const { orcamentos } = useOficina();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Orçamentos</Text>
      {orcamentos.length === 0 ? (
        <Text style={styles.subtitle}>Nenhum orçamento cadastrado ainda.</Text>
      ) : (
        orcamentos.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.carro}</Text>
            <Text style={styles.cardLine}>Cliente: {item.cliente}</Text>
            <Text style={styles.cardLine}>Descrição: {item.descricao}</Text>
            <Text style={styles.cardLine}>Valor: {item.valor}</Text>
            <Text style={styles.cardStatus}>{item.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8f8f8' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  subtitle: { fontSize: 14, color: '#666' },
  card: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#000', borderRadius: 8, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#007AFF', marginBottom: 8 },
  cardLine: { fontSize: 13, marginBottom: 4, color: '#000' },
  cardStatus: { marginTop: 8, fontSize: 12, fontWeight: '700', color: '#000' },
});
