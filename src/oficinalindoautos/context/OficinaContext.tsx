import React, { createContext, ReactNode, useContext, useMemo, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { syncOSToCloud, deleteOSFromCloud } from '../utils/cloudSync';

export type Agendamento = {
  id: string;
  cliente: string;
  carro: string;
  servico: string;
  data: string;
  telefone: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'EM_ATENDIMENTO' | 'CONCLUIDO' | 'NAO_COMPARECEU' | 'CANCELADO';
  placa?: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Orcamento = {
  id: string;
  cliente: string;
  carro: string;
  descricao: string;
  valor: string;
  status: 'ABERTO' | 'APROVADO' | 'REJEITADO';
  telefone: string;
  valorPecas: string;
  valorMaoObra: string;
  placa?: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  carro: string;
  ultimaVisita: string;
};

export type OrdemServico = {
  id: string;
  cliente: string;
  carro: string;
  servico: string;
  valor: string;
  status: 'ANALISE' | 'REPARO' | 'CONCLUIDO';
  dataInicio: string;
  telefone: string;
  valorPecas: string;
  valorMaoObra: string;
  placa: string;
  dataConclusao?: string;
};

type OficinaContextType = {
  agendamentos: Agendamento[];
  orcamentos: Orcamento[];
  clientes: Cliente[];
  ordensServico: OrdemServico[];
  adicionarAgendamento: (dados: Omit<Agendamento, 'id' | 'status'>) => void;
  adicionarOrcamento: (dados: Omit<Orcamento, 'id' | 'status'>) => void;
  adicionarOrdemServico: (dados: Omit<OrdemServico, 'id' | 'status' | 'dataInicio'>) => Promise<void>;
  adicionarCliente: (dados: Omit<Cliente, 'id' | 'ultimaVisita'>) => void;
  atualizarStatusOrdemServico: (id: string, status: 'ANALISE' | 'REPARO' | 'CONCLUIDO') => Promise<void>;
  atualizarStatusAgendamento: (id: string, status: Agendamento['status']) => void;
  atualizarStatusOrcamento: (id: string, status: 'ABERTO' | 'APROVADO' | 'REJEITADO') => void;
  excluirAgendamento: (id: string) => void;
  excluirOrcamento: (id: string) => void;
  excluirCliente: (id: string) => void;
  excluirOrdemServico: (id: string) => void;
  limparDados: () => Promise<void>;
  editarAgendamento: (id: string, dados: { carro: string; servico: string; data: string; telefone: string; placa?: string }) => void;
  editarOrcamento: (id: string, dados: { carro: string; descricao: string; valor: string; telefone: string; placa?: string }) => void;
  editarOrdemServico: (id: string, dados: { carro: string; servico: string; valor: string; telefone: string; placa: string }) => Promise<void>;
  editarCliente: (id: string, dados: { nome: string; telefone: string; carro: string }) => void;
};

const OficinaContext = createContext<OficinaContextType | undefined>(undefined);

const db = SQLite.openDatabaseSync('oficina.db');

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
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);

  useEffect(() => {
    try {
      try {
        db.getFirstSync('SELECT valorPecas FROM orcamentos LIMIT 1');
        db.getFirstSync('SELECT valorPecas FROM ordens_servico LIMIT 1');
      } catch (e) {
        db.execSync(`
          DROP TABLE IF EXISTS clientes;
          DROP TABLE IF EXISTS agendamentos;
          DROP TABLE IF EXISTS orcamentos;
          DROP TABLE IF EXISTS ordens_servico;
        `);
      }

      db.execSync(`
        PRAGMA journal_mode = WAL;
        
        CREATE TABLE IF NOT EXISTS clientes (
          id TEXT PRIMARY KEY NOT NULL,
          nome TEXT UNIQUE NOT NULL,
          telefone TEXT,
          carro TEXT,
          ultimaVisita TEXT
        );

        CREATE TABLE IF NOT EXISTS agendamentos (
          id TEXT PRIMARY KEY NOT NULL,
          cliente TEXT NOT NULL,
          carro TEXT NOT NULL,
          servico TEXT NOT NULL,
          data TEXT NOT NULL,
          telefone TEXT NOT NULL,
          status TEXT NOT NULL,
          placa TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS orcamentos (
          id TEXT PRIMARY KEY NOT NULL,
          cliente TEXT NOT NULL,
          carro TEXT NOT NULL,
          descricao TEXT NOT NULL,
          valor TEXT NOT NULL,
          status TEXT NOT NULL,
          telefone TEXT NOT NULL,
          valorPecas TEXT NOT NULL,
          valorMaoObra TEXT NOT NULL,
          placa TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS ordens_servico (
          id TEXT PRIMARY KEY NOT NULL,
          cliente TEXT NOT NULL,
          carro TEXT NOT NULL,
          servico TEXT NOT NULL,
          valor TEXT NOT NULL,
          status TEXT NOT NULL,
          dataInicio TEXT NOT NULL,
          telefone TEXT NOT NULL,
          valorPecas TEXT NOT NULL,
          valorMaoObra TEXT NOT NULL,
          placa TEXT NOT NULL DEFAULT ''
        );
      `);

      try {
        db.getFirstSync('SELECT placa FROM ordens_servico LIMIT 1');
      } catch (e) {
        try { db.execSync('ALTER TABLE ordens_servico ADD COLUMN placa TEXT NOT NULL DEFAULT ""'); } catch (err) {}
      }
      try {
        db.getFirstSync('SELECT placa FROM agendamentos LIMIT 1');
      } catch (e) {
        try { db.execSync('ALTER TABLE agendamentos ADD COLUMN placa TEXT NOT NULL DEFAULT ""'); } catch (err) {}
      }
      try {
        db.getFirstSync('SELECT placa FROM orcamentos LIMIT 1');
      } catch (e) {
        try { db.execSync('ALTER TABLE orcamentos ADD COLUMN placa TEXT NOT NULL DEFAULT ""'); } catch (err) {}
      }

      try { db.getFirstSync('SELECT criadoEm FROM agendamentos LIMIT 1'); } catch (e) { 
        try { 
          db.execSync('ALTER TABLE agendamentos ADD COLUMN criadoEm TEXT NOT NULL DEFAULT ""'); 
          db.execSync('ALTER TABLE agendamentos ADD COLUMN concluidoEm TEXT NOT NULL DEFAULT ""'); 
        } catch (err) {} 
      }
      try { db.getFirstSync('SELECT atualizadoEm FROM agendamentos LIMIT 1'); } catch (e) { 
        try { 
          db.execSync('ALTER TABLE agendamentos ADD COLUMN atualizadoEm TEXT NOT NULL DEFAULT ""'); 
        } catch (err) {} 
      }
      try { db.getFirstSync('SELECT criadoEm FROM orcamentos LIMIT 1'); } catch (e) { 
        try { 
          db.execSync('ALTER TABLE orcamentos ADD COLUMN criadoEm TEXT NOT NULL DEFAULT ""'); 
          db.execSync('ALTER TABLE orcamentos ADD COLUMN atualizadoEm TEXT NOT NULL DEFAULT ""'); 
        } catch (err) {} 
      }
      try { db.getFirstSync('SELECT dataConclusao FROM ordens_servico LIMIT 1'); } catch (e) { 
        try { db.execSync('ALTER TABLE ordens_servico ADD COLUMN dataConclusao TEXT NOT NULL DEFAULT ""'); } catch (err) {} 
      }

      // Migrar agendamentos antigos que tinham o status "PENDENTE" para "AGENDADO"
      try {
        db.execSync("UPDATE agendamentos SET status = 'AGENDADO' WHERE status = 'PENDENTE'");
      } catch (err) {}

      carregarDados();
    } catch (e) {
      console.error('Erro ao inicializar tabelas do SQLite', e);
    }
  }, []);

  const carregarDados = () => {
    try {
      const allAgendamentos = db.getAllSync<Agendamento>('SELECT * FROM agendamentos ORDER BY id DESC');
      const allOrcamentos = db.getAllSync<Orcamento>('SELECT * FROM orcamentos ORDER BY id DESC');
      const allClientes = db.getAllSync<Cliente>('SELECT * FROM clientes ORDER BY id DESC');
      const allOS = db.getAllSync<OrdemServico>('SELECT * FROM ordens_servico ORDER BY id DESC');

      setAgendamentos(allAgendamentos);
      setOrcamentos(allOrcamentos);
      setClientes(allClientes);
      setOrdensServico(allOS);
    } catch (error) {
      console.error('Erro ao ler tabelas do SQLite', error);
    }
  };

  const salvarClienteRecente = (
    nome: string,
    telefone: string,
    carro: string,
    ultimaVisita: string,
    idOffset = 1
  ) => {
    db.runSync(
      `INSERT INTO clientes (id, nome, telefone, carro, ultimaVisita)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(nome) DO UPDATE SET
         telefone = excluded.telefone,
         carro = excluded.carro,
         ultimaVisita = excluded.ultimaVisita`,
      [String(Date.now() + idOffset), nome, telefone, carro, ultimaVisita]
    );
  };

  const adicionarAgendamento = (dados: Omit<Agendamento, 'id' | 'status'>) => {
    const id = String(Date.now());
    const status: Agendamento['status'] = 'AGENDADO';
    const placaVal = dados.placa || '';
    const criadoEm = new Date().toISOString();

    try {
      db.runSync(
        'INSERT INTO agendamentos (id, cliente, carro, servico, data, telefone, status, placa, criadoEm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, dados.cliente, dados.carro, dados.servico, dados.data, dados.telefone, status, placaVal, criadoEm]
      );

      salvarClienteRecente(dados.cliente, dados.telefone, dados.carro, dados.data);

      carregarDados();
    } catch (e) {
      console.error('Erro ao salvar agendamento no SQLite', e);
      Alert.alert("Erro no Dispositivo ⚠️", "Não foi possível salvar o agendamento na memória do celular.");
    }
  };

  const adicionarOrcamento = (dados: Omit<Orcamento, 'id' | 'status'>) => {
    const id = String(Date.now());
    const status = 'ABERTO';
    const placaVal = dados.placa || '';
    const criadoEm = new Date().toISOString();

    try {
      db.runSync(
        'INSERT INTO orcamentos (id, cliente, carro, descricao, valor, status, telefone, valorPecas, valorMaoObra, placa, criadoEm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, dados.cliente, dados.carro, dados.descricao, dados.valor, status, dados.telefone, dados.valorPecas, dados.valorMaoObra, placaVal, criadoEm]
      );

      salvarClienteRecente(dados.cliente, dados.telefone, dados.carro, 'Novo orçamento', 2);

      carregarDados();
    } catch (e) {
      console.error('Erro ao salvar orçamento no SQLite', e);
      Alert.alert("Erro no Dispositivo ⚠️", "Não foi possível salvar o orçamento na memória do celular.");
    }
  };

  const adicionarOrdemServico = async (dados: Omit<OrdemServico, 'id' | 'status' | 'dataInicio'>) => {
    const id = String(Date.now());
    const status = 'ANALISE';
    const dataInicioISO = new Date().toISOString();
    const placaVal = dados.placa || '';

    try {
      db.runSync(
        'INSERT INTO ordens_servico (id, cliente, carro, servico, valor, status, dataInicio, telefone, valorPecas, valorMaoObra, placa, dataConclusao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, dados.cliente, dados.carro, dados.servico, dados.valor, status, dataInicioISO, dados.telefone, dados.valorPecas, dados.valorMaoObra, placaVal, '']
      );

      salvarClienteRecente(dados.cliente, dados.telefone, dados.carro, 'Nova Ordem de Serviço', 3);

      const novaOS: OrdemServico = {
        id,
        cliente: dados.cliente,
        carro: dados.carro,
        servico: dados.servico,
        valor: dados.valor,
        status,
        dataInicio: dataInicioISO,
        telefone: dados.telefone,
        valorPecas: dados.valorPecas,
        valorMaoObra: dados.valorMaoObra,
        placa: placaVal,
        dataConclusao: '',
      };

      if (placaVal.trim()) {
        const sincronizado = await syncOSToCloud(novaOS);
        if (!sincronizado) {
          Alert.alert(
            "Aviso de Sincronização ⚠️",
            "OS salva no celular, mas houve falha ao sincronizar com o portal web. Verifique sua conexão e edite a OS para tentar novamente."
          );
        }
      }

      carregarDados();
    } catch (e) {
      console.error('Erro ao criar OS no SQLite', e);
      Alert.alert("Erro no Dispositivo ⚠️", "Não foi possível criar a Ordem de Serviço na memória do celular.");
    }
  };

  const atualizarStatusOrdemServico = async (id: string, status: 'ANALISE' | 'REPARO' | 'CONCLUIDO') => {
    try {
      if (status === 'CONCLUIDO') {
        const concluidoEm = new Date().toISOString();
        db.runSync('UPDATE ordens_servico SET status = ?, dataConclusao = ? WHERE id = ?', [status, concluidoEm, id]);
      } else {
        db.runSync('UPDATE ordens_servico SET status = ? WHERE id = ?', [status, id]);
      }
      
      const osAtualizada = db.getFirstSync<OrdemServico>('SELECT * FROM ordens_servico WHERE id = ?', [id]);
      if (osAtualizada && osAtualizada.placa.trim()) {
        const sincronizado = await syncOSToCloud(osAtualizada);
        if (!sincronizado) {
          Alert.alert(
            "Aviso de Sincronização ⚠️",
            "Status atualizado no celular, mas não sincronizou com o portal web. Verifique sua conexão."
          );
        }
      }

      carregarDados();
    } catch (e) {
      console.error('Erro ao atualizar status da OS no SQLite', e);
      Alert.alert("Erro no Dispositivo ⚠️", "Não foi possível atualizar o status na memória do celular.");
    }
  };

  const atualizarStatusAgendamento = (id: string, status: Agendamento['status']) => {
    try {
      const atualizadoEm = new Date().toISOString();
      db.runSync('UPDATE agendamentos SET status = ?, atualizadoEm = ? WHERE id = ?', [status, atualizadoEm, id]);
      carregarDados();
    } catch (e) {
      console.error('Erro ao atualizar status do agendamento no SQLite', e);
    }
  };

  const atualizarStatusOrcamento = (id: string, status: 'ABERTO' | 'APROVADO' | 'REJEITADO') => {
    try {
      const orcamentoAtual = db.getFirstSync<Orcamento>('SELECT * FROM orcamentos WHERE id = ?', [id]);
      
      if (orcamentoAtual) {
        const atualizadoEm = new Date().toISOString();
        db.runSync('UPDATE orcamentos SET status = ?, atualizadoEm = ? WHERE id = ?', [status, atualizadoEm, id]);
        
        if (status === 'APROVADO' && orcamentoAtual.status !== 'APROVADO') {
          adicionarOrdemServico({
            cliente: orcamentoAtual.cliente,
            carro: orcamentoAtual.carro,
            servico: orcamentoAtual.descricao,
            valor: orcamentoAtual.valor,
            telefone: orcamentoAtual.telefone,
            valorPecas: orcamentoAtual.valorPecas,
            valorMaoObra: orcamentoAtual.valorMaoObra,
            placa: orcamentoAtual.placa || '',
          });
        }
      }
      carregarDados();
    } catch (e) {
      console.error('Erro ao atualizar status do orçamento no SQLite', e);
    }
  };

  const excluirAgendamento = (id: string) => {
    try {
      db.runSync('DELETE FROM agendamentos WHERE id = ?', [id]);
      carregarDados();
    } catch (e) {
      console.error('Erro ao excluir agendamento no SQLite', e);
    }
  };

  const excluirOrcamento = (id: string) => {
    try {
      db.runSync('DELETE FROM orcamentos WHERE id = ?', [id]);
      carregarDados();
    } catch (e) {
      console.error('Erro ao excluir orçamento no SQLite', e);
    }
  };

  const excluirCliente = (id: string) => {
    try {
      db.runSync('DELETE FROM clientes WHERE id = ?', [id]);
      carregarDados();
    } catch (e) {
      console.error('Erro ao excluir cliente no SQLite', e);
    }
  };

  const excluirOrdemServico = (id: string) => {
    try {
      const osParaExcluir = db.getFirstSync<OrdemServico>('SELECT * FROM ordens_servico WHERE id = ?', [id]);
      if (osParaExcluir && osParaExcluir.placa) {
        deleteOSFromCloud(osParaExcluir.placa, osParaExcluir.id);
      }

      db.runSync('DELETE FROM ordens_servico WHERE id = ?', [id]);
      carregarDados();
    } catch (e) {
      console.error('Erro ao excluir OS no SQLite', e);
    }
  };

  const limparDados = async () => {
    try {
      const todasOS = db.getAllSync<OrdemServico>('SELECT * FROM ordens_servico');
      for (const os of todasOS) {
        if (os.placa) {
          deleteOSFromCloud(os.placa);
        }
      }

      db.execSync(`
        DELETE FROM agendamentos;
        DELETE FROM orcamentos;
        DELETE FROM clientes;
        DELETE FROM ordens_servico;
      `);
      carregarDados();
    } catch (e) {
      console.error('Erro ao limpar tabelas do SQLite', e);
    }
  };

  const adicionarCliente = (dados: Omit<Cliente, 'id' | 'ultimaVisita'>) => {
    const id = String(Date.now());
    const ultimaVisita = 'Cadastrado manualmente';

    try {
      db.runSync(
        `INSERT INTO clientes (id, nome, telefone, carro, ultimaVisita) 
         VALUES (?, ?, ?, ?, ?) 
         ON CONFLICT(nome) DO UPDATE SET 
           telefone = excluded.telefone, 
           carro = excluded.carro`,
        [id, dados.nome, dados.telefone, dados.carro, ultimaVisita]
      );
      carregarDados();
    } catch (e) {
      console.error('Erro ao adicionar cliente no SQLite', e);
    }
  };

  const editarAgendamento = (id: string, dados: { carro: string; servico: string; data: string; telefone: string; placa?: string }) => {
    try {
      db.runSync(
        'UPDATE agendamentos SET carro = ?, servico = ?, data = ?, telefone = ?, placa = ? WHERE id = ?',
        [dados.carro, dados.servico, dados.data, dados.telefone, dados.placa || '', id]
      );
      carregarDados();
    } catch (e) {
      console.error('Erro ao editar agendamento no SQLite', e);
    }
  };

  const editarOrcamento = (id: string, dados: { carro: string; descricao: string; valor: string; telefone: string; placa?: string }) => {
    try {
      db.runSync(
        'UPDATE orcamentos SET carro = ?, descricao = ?, valor = ?, telefone = ?, placa = ? WHERE id = ?',
        [dados.carro, dados.descricao, dados.valor, dados.telefone, dados.placa || '', id]
      );
      carregarDados();
    } catch (e) {
      console.error('Erro ao editar orçamento no SQLite', e);
    }
  };

  const editarOrdemServico = async (id: string, dados: { carro: string; servico: string; valor: string; telefone: string; placa: string }) => {
    try {
      const osAntiga = db.getFirstSync<OrdemServico>('SELECT * FROM ordens_servico WHERE id = ?', [id]);
      const placaAntiga = osAntiga?.placa;

      db.runSync(
        'UPDATE ordens_servico SET carro = ?, servico = ?, valor = ?, telefone = ?, placa = ? WHERE id = ?',
        [dados.carro, dados.servico, dados.valor, dados.telefone, dados.placa, id]
      );

      const osAtualizada = db.getFirstSync<OrdemServico>('SELECT * FROM ordens_servico WHERE id = ?', [id]);
      if (osAtualizada) {
        // Se trocou a placa, primeiro deleta a OS antiga no Firebase, depois cria a nova
        if (placaAntiga && placaAntiga.toUpperCase() !== osAtualizada.placa.toUpperCase()) {
          await deleteOSFromCloud(placaAntiga, id);
        }
        
        if (osAtualizada.placa.trim()) {
          const sincronizado = await syncOSToCloud(osAtualizada);
          if (!sincronizado) {
            Alert.alert(
              "Aviso de Sincronização ⚠️",
              "OS atualizada no celular, mas não sincronizou com o portal web. Verifique sua conexão e edite novamente."
            );
          }
        }
      }

      carregarDados();
    } catch (e) {
      console.error('Erro ao editar ordem de serviço no SQLite', e);
      Alert.alert("Erro no Dispositivo ⚠️", "Não foi possível editar a Ordem de Serviço.");
    }
  };

  const editarCliente = (id: string, dados: { nome: string; telefone: string; carro: string }) => {
    try {
      db.runSync(
        'UPDATE clientes SET nome = ?, telefone = ?, carro = ? WHERE id = ?',
        [dados.nome, dados.telefone, dados.carro, id]
      );
      carregarDados();
    } catch (e) {
      console.error('Erro ao editar cliente no SQLite', e);
    }
  };

  const value = useMemo(
    () => ({
      agendamentos,
      orcamentos,
      clientes,
      ordensServico,
      adicionarAgendamento,
      adicionarOrcamento,
      adicionarOrdemServico,
      adicionarCliente,
      atualizarStatusOrdemServico,
      atualizarStatusAgendamento,
      atualizarStatusOrcamento,
      excluirAgendamento,
      excluirOrcamento,
      excluirCliente,
      excluirOrdemServico,
      limparDados,
      editarAgendamento,
      editarOrcamento,
      editarOrdemServico,
      editarCliente,
    }),
    [agendamentos, orcamentos, clientes, ordensServico]
  );

  return <OficinaContext.Provider value={value}>{children}</OficinaContext.Provider>;
}
