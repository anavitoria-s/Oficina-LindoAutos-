import { Linking, Alert } from 'react-native';

export const enviarMensagemWhatsApp = (telefone: string, mensagem: string) => {
  if (!telefone) {
    Alert.alert('Aviso', 'Este cliente não possui telefone cadastrado.');
    return;
  }

  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  if (telefoneLimpo.length < 8) {
    Alert.alert('Aviso', 'O número de telefone cadastrado é inválido.');
    return;
  }

  const numeroCompleto = telefoneLimpo.startsWith('55') 
    ? telefoneLimpo 
    : `55${telefoneLimpo}`;

  const url = `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(mensagem)}`;

  Linking.canOpenURL(url)
    .then(() => {
      Linking.openURL(url);
    })
    .catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp neste dispositivo.');
    });
};
