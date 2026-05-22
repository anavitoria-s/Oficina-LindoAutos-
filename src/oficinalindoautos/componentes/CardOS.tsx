import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrdemServico, useOficina } from '../context/OficinaContext';
import { enviarMensagemWhatsApp } from '../utils/whatsapp';
import { formatarDataHoraBrasileira } from '../utils/formatacao';
import PressableAnimado from './PressableAnimado';

type Props = {
  ordem: OrdemServico;
  onEdit: (ordem: OrdemServico) => void;
};

export default function CardOS({ ordem, onEdit }: Props) {
  const { atualizarStatusOrdemServico, excluirOrdemServico } = useOficina();

  const getStatusInfo = (status: OrdemServico['status']) => {
    switch (status) {
      case 'ANALISE':
        return { label: 'Em Análise', color: '#E6A23C', nextStatus: 'REPARO', btnLabel: 'Iniciar Trabalho ⚙️' };
      case 'REPARO':
        return { label: 'Em Andamento', color: '#007AFF', nextStatus: 'CONCLUIDO', btnLabel: 'Concluir ✅' };
      case 'CONCLUIDO':
        return { label: 'Concluído', color: '#2bcf67', nextStatus: null, btnLabel: 'Concluído 🎉' };
    }
  };

  const statusInfo = getStatusInfo(ordem.status);

  const handleNextStatus = () => {
    if (statusInfo.nextStatus) {
      atualizarStatusOrdemServico(ordem.id, statusInfo.nextStatus as any);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.carName}>{ordem.carro}</Text>
          {ordem.placa ? <Text style={styles.plateText}>🎫 Placa: {ordem.placa}</Text> : null}
        </View>
        <View style={[styles.badge, { borderColor: statusInfo.color }]}>
          <Text style={[styles.badgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>Cliente: <Text style={styles.value}>{ordem.cliente}</Text></Text>
      <Text style={styles.label}>Telefone: <Text style={styles.value}>{ordem.telefone || 'Não informado'}</Text></Text>
      <Text style={styles.label}>Serviço: <Text style={styles.value}>{ordem.servico}</Text></Text>
      {ordem.status === 'ANALISE' && (
        <Text style={styles.label}>Recebido em: <Text style={styles.value}>{formatarDataHoraBrasileira(ordem.dataInicio)}</Text></Text>
      )}
      {ordem.status === 'REPARO' && (
        <Text style={styles.label}>Em andamento desde: <Text style={styles.value}>{formatarDataHoraBrasileira(ordem.dataInicio)}</Text></Text>
      )}
      {ordem.status === 'CONCLUIDO' && (
        <>
          <Text style={styles.label}>Recebido em: <Text style={styles.value}>{formatarDataHoraBrasileira(ordem.dataInicio)}</Text></Text>
          {ordem.dataConclusao ? (
            <Text style={styles.label}>Concluído em: <Text style={[styles.value, { color: '#2bcf67', fontWeight: '800' }]}>{formatarDataHoraBrasileira(ordem.dataConclusao)}</Text></Text>
          ) : null}
        </>
      )}
      <Text style={styles.label}>Valor do Serviço: <Text style={styles.valorTotalText}>{ordem.valor}</Text></Text>

      <View style={styles.actionRow}>
        {statusInfo.nextStatus ? (
          <PressableAnimado style={[styles.btnAction, styles.btnNext]} onPress={handleNextStatus}>
            <Text style={styles.btnActionText}>{statusInfo.btnLabel}</Text>
          </PressableAnimado>
        ) : (
          <View style={[styles.btnAction, styles.btnFinished]}>
            <Text style={styles.btnFinishedText}>{statusInfo.btnLabel}</Text>
          </View>
        )}

        <PressableAnimado 
          style={[styles.btnAction, styles.btnEdit]} 
          onPress={() => onEdit(ordem)}
        >
          <Text style={styles.btnEditText}>Editar ✏️</Text>
        </PressableAnimado>

        <PressableAnimado 
          style={[styles.btnAction, styles.btnDelete]} 
          onPress={() => excluirOrdemServico(ordem.id)}
        >
          <Text style={styles.btnDeleteText}>Excluir OS 🗑️</Text>
        </PressableAnimado>
      </View>

      <PressableAnimado 
        style={styles.btnWhatsApp} 
        onPress={() => {
          const statusTxt = ordem.status === 'ANALISE' ? 'Análise Técnica 🔎' : ordem.status === 'REPARO' ? 'Serviço em Andamento ⚙️' : 'Pronto para Retirada! 🎉✅';
          const placaLimpa = (ordem.placa || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          const portalLink = `https://lindo-autos.web.app/?placa=${placaLimpa}`;
          
          const msg = ordem.status === 'CONCLUIDO' 
            ? `Olá, *${ordem.cliente}*!\nÓtimas notícias! 🎉\nO serviço do seu *${ordem.carro}* (Placa: ${ordem.placa}) foi concluído com sucesso e o veículo já está pronto para ser retirado na oficina *LindoAutos*! 🚗✅\n\n📋 *Serviço*: ${ordem.servico}\n💵 *Valor final*: ${ordem.valor}\n\nAcompanhe o status online:\n👉 ${portalLink}`
            : `Olá, *${ordem.cliente}*!\nPassando para informar que o seu *${ordem.carro}* (Placa: ${ordem.placa}) já está na fase de *${statusTxt}* na oficina *LindoAutos*! ⚙️🛠️\n\n📋 *Serviço*: ${ordem.servico}\n💵 *Valor estimado*: ${ordem.valor}\n\nAcompanhe o status em tempo real online:\n👉 ${portalLink}`;
            
          enviarMensagemWhatsApp(ordem.telefone, msg);
        }}
      >
        <Text style={styles.btnWhatsAppText}>Notificar via WhatsApp 💬</Text>
      </PressableAnimado>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  carName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#007AFF',
  },
  plateText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#666',
    marginTop: 2,
  },
  badge: {
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontWeight: '500',
    color: '#000',
  },
  valorTotalText: {
    color: '#2bcf67',
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btnAction: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginHorizontal: 4,
  },
  btnNext: {
    backgroundColor: '#000',
  },
  btnActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  btnFinished: {
    backgroundColor: '#f1f1f1',
    borderColor: '#ddd',
  },
  btnFinishedText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '700',
  },
  btnDelete: {
    backgroundColor: '#FFF5F5',
    borderColor: '#E53E3E',
  },
  btnDeleteText: {
    color: '#E53E3E',
    fontSize: 13,
    fontWeight: '700',
  },
  btnEdit: {
    backgroundColor: '#FFD166',
  },
  btnEditText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
  btnWhatsApp: {
    backgroundColor: '#EFFFEC',
    borderWidth: 2,
    borderColor: '#2bcf67',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnWhatsAppText: {
    color: '#2bcf67',
    fontSize: 13,
    fontWeight: '800',
  },
});
