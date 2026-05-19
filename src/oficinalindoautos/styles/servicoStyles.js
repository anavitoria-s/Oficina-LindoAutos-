import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5'
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#004AAD'
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },

  label: {
    fontWeight: 'bold',
    marginTop: 10
  },

  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#CCC'
  },

  botao: {
    backgroundColor: '#004AAD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  botaoTexto: {
    color: '#FFF',
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
  },

  nome: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  badge: {
    backgroundColor: '#004AAD',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start'
  },

  badgeTexto: {
    color: '#FFF',
    fontWeight: 'bold'
  }
});

export default styles;
