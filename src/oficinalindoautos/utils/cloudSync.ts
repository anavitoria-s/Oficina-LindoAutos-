import { OrdemServico } from '../context/OficinaContext';
import { Alert } from 'react-native';

const FIREBASE_URL = 'https://lindo-autos-default-rtdb.firebaseio.com';

export function limparPlaca(placa: string): string {
  return placa.replace(/[^A-Za-zA-Z0-9]/g, '').toUpperCase();
}

export async function syncOSToCloud(ordem: OrdemServico): Promise<void> {
  if (!ordem.placa || !ordem.placa.trim()) {
    return;
  }

  const placaChave = limparPlaca(ordem.placa);
  const url = `${FIREBASE_URL}/ordens/${placaChave}/${ordem.id}.json`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: ordem.id,
        cliente: ordem.cliente,
        carro: ordem.carro,
        placa: ordem.placa.toUpperCase(),
        servico: ordem.servico,
        valor: ordem.valor,
        status: ordem.status,
        dataInicio: ordem.dataInicio,
        dataConclusao: ordem.dataConclusao,
        ultimaAtualizacao: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.warn('Erro ao sincronizar com Firebase:', response.statusText);
      Alert.alert(
        "Aviso de Sincronização ⚠️", 
        "Houve um problema ao salvar os dados no Portal do Cliente. O status no site pode estar desatualizado."
      );
    }
  } catch (error) {
    console.warn('Falha na conexão de rede ao sincronizar com Firebase:', error);
    Alert.alert(
      "Sem Conexão com a Internet 📶", 
      "Os dados foram salvos no seu celular, mas não conseguimos enviá-los para o Portal Web do Cliente. Verifique a internet e edite a OS novamente para re-enviar."
    );
  }
}

export async function deleteOSFromCloud(placa: string, id?: string): Promise<void> {
  if (!placa || !placa.trim()) {
    return;
  }

  const placaChave = limparPlaca(placa);
  const url = id 
    ? `${FIREBASE_URL}/ordens/${placaChave}/${id}.json`
    : `${FIREBASE_URL}/ordens/${placaChave}.json`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.warn('Erro ao deletar do Firebase:', response.statusText);
      Alert.alert("Aviso de Sincronização ⚠️", "O registro foi excluído do seu celular, mas houve falha ao excluir do portal web.");
    }
  } catch (error) {
    console.warn('Falha na conexão de rede ao deletar do Firebase:', error);
    Alert.alert("Sem Conexão 📶", "Registro excluído do seu aparelho, mas não do portal web. Verifique a internet.");
  }
}
