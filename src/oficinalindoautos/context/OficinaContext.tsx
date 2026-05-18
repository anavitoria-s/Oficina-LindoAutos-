import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Agendamento = {
  id: string;
  cliente: string;
  carro: string;
  servico: string;
  data: string;
  telefone: string;
  status: 'PENDENTE' | 'CONCLUIDO';
};

export type Orcamento = {
  id: string;
  cliente: string;
  carro: string;
  descricao: string;
  valor: string;
  status: 'ABERTO' | 'APROVADO' | 'REJEITADO';
};

export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  carro: string;
  ultimaVisita: string;
};

type OficinaContextType = {
  agendamentos: Agendamento[];
  orcamentos: Orcamento[];
  clientes: Cliente[];
  adicionarAgendamento: (dados: Omit<Agendamento, 'id' | 'status'>) => void;
  adicionarOrcamento: (dados: Omit<Orcamento, 'id' | 'status'>) => void;
};

const OficinaContext = createContext<OficinaContextType | undefined>(undefined);

export function useOficina() {
  const context = useContext(OficinaContext);
  if (!context) {
    throw new Error('useOficina deve ser usado dentro de OficinaProvider');
  }
  return context;
}

export function OficinaProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const adicionarAgendamento = (dados: Omit<Agendamento, 'id' | 'status'>) => {
    const novoAgendamento: Agendamento = {
      ...dados,
      id: String(Date.now()),
      status: 'PENDENTE',
    };

    setAgendamentos(prev => [novoAgendamento, ...prev]);
    setClientes(prev => {
      const existe = prev.some(cliente => cliente.nome === dados.cliente);
      if (existe) {
        return prev.map(cliente =>
          cliente.nome === dados.cliente
            ? { ...cliente, ultimaVisita: dados.data, carro: dados.carro, telefone: dados.telefone }
            : cliente
        );
      }

      return [
        {
          id: String(Date.now() + 1),
          nome: dados.cliente,
          telefone: dados.telefone,
          carro: dados.carro,
          ultimaVisita: dados.data,
        },
        ...prev,
      ];
    });
  };

  const adicionarOrcamento = (dados: Omit<Orcamento, 'id' | 'status'>) => {
    const novoOrcamento: Orcamento = {
      ...dados,
      id: String(Date.now()),
      status: 'ABERTO',
    };

    setOrcamentos(prev => [novoOrcamento, ...prev]);
    setClientes(prev => {
      const existe = prev.some(cliente => cliente.nome === dados.cliente);
      if (existe) {
        return prev;
      }

      return [
        {
          id: String(Date.now() + 2),
          nome: dados.cliente,
          telefone: '',
          carro: dados.carro,
          ultimaVisita: 'Novo orçamento',
        },
        ...prev,
      ];
    });
  };

  const value = useMemo(
    () => ({ agendamentos, orcamentos, clientes, adicionarAgendamento, adicionarOrcamento }),
    [agendamentos, orcamentos, clientes]
  );

  return <OficinaContext.Provider value={value}>{children}</OficinaContext.Provider>;
}
