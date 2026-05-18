import React from 'react';
import { View, Text, FlatList } from 'react-native';
import CardOS from './CardOS';
import styles from './servicoStyles';

const ordens = [
  {
    id: '1',
    cliente: 'João Silva',
    veiculo: 'Honda Civic 2019',
    servico: 'Polimento cristalizado',
    status: 'Em análise'
  },
  {
    id: '2',
    cliente: 'Maria Souza',
    veiculo: 'VW Polo 2021',
    servico: 'Reparo para-choque',
    status: 'Em reparo'
  }
];

export default function ListaOS() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ordens de Serviço</Text>

      <FlatList
        data={ordens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardOS ordem={item} />}
      />
    </View>
  );
}
