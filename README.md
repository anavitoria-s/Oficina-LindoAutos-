# Oficina-LindoAutos

Aplicativo mobile desenvolvido com React Native, JavaScript e PostgreSQL, como projeto de extensão universitária, para uma funilaria local, permitindo agendamento de serviços, solicitação de orçamentos e gestão de clientes, com foco na digitalização e no apoio à comunidade.

Aplicativo mobile desenvolvido com Expo e React Native em TypeScript para gestão de uma oficina. O app roda no Expo Go (apenas nativo), com navegação por abas e formulários reais para:

- agendar serviços
- criar orçamentos
- cadastrar e listar clientes

## Estrutura principal

- `src/oficinalindoautos/App.tsx` — navegação principal com abas e pilha para formulários
- `src/oficinalindoautos/context/OficinaContext.tsx` — estado global de agendamentos, orçamentos e clientes
- `src/oficinalindoautos/telas/Inicio.tsx` — tela inicial com dados reais e botões de ação
- `src/oficinalindoautos/telas/Agenda.tsx` — lista de agendamentos
- `src/oficinalindoautos/telas/Orcamentos.tsx` — lista de orçamentos
- `src/oficinalindoautos/telas/Clientes.tsx` — lista de clientes
- `src/oficinalindoautos/telas/NovoAgendamento.tsx` — formulário de agendamento funcional
- `src/oficinalindoautos/telas/NovoOrcamento.tsx` — formulário de orçamento funcional

## Rodar o app

No diretório `src/oficinalindoautos` execute:

```bash
npx expo start
```

Abra o QR code no Expo Go do celular ou no emulador para ver o app funcionar.

## Observações

- O app ainda está em desenvolvimento.
- Estamos usando o Expo apenas para testar o app no celular ou emulador.
- O logo está carregado em `src/oficinalindoautos/assets/logo.jpeg`.
