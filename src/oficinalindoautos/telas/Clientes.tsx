import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useOficina } from '../context/OficinaContext';

export default function Clientes() {
  const { clientes } = useOficina();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Clientes</Text>
      {clientes.length === 0 ? (
        <Text style={styles.subtitle}>Nenhum cliente registrado ainda.</Text>
      ) : (
        clientes.map(cliente => (
          <View key={cliente.id} style={styles.card}>
            <Text style={styles.cardTitle}>{cliente.nome}</Text>
            <Text style={styles.cardLine}>Telefone: {cliente.telefone || 'Não informado'}</Text>
            <Text style={styles.cardLine}>Carro: {cliente.carro}</Text>
            <Text style={styles.cardLine}>Última visita: {cliente.ultimaVisita}</Text>
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
});
