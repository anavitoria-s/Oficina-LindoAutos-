# Oficina LindoAutos 🚗🎓

**Este é um projeto universitário desenvolvido para fins acadêmicos e de aprendizado.**

Aplicativo para gestão de uma oficina mecânica e centro automotivo, desenvolvido com **Expo, React Native e TypeScript**.

O projeto permite controlar agendamentos, orçamentos, clientes e ordens de serviço localmente com banco de dados SQLite. Ele também possui uma integração com o Firebase para sincronização em tempo real e uma página web associada para o cliente consultar o andamento do serviço pela placa do veículo.

- agendar serviços
- criar orçamentos
- cadastrar e listar clientes
- criar e acompanhar ordens de serviço
- sincronizar o status das ordens de serviço com o Firebase
- permitir que o cliente acompanhe o serviço pelo portal web

## Estrutura principal

- `src/oficinalindoautos/App.tsx` — navegação principal com abas e pilha para formulários
- `src/oficinalindoautos/context/OficinaContext.tsx` — estado global e persistência local com SQLite
- `src/oficinalindoautos/telas/Inicio.tsx` — tela inicial com dados reais e botões de ação
- `src/oficinalindoautos/telas/Agenda.tsx` — lista de agendamentos
- `src/oficinalindoautos/telas/Orcamentos.tsx` — lista de orçamentos
- `src/oficinalindoautos/telas/Clientes.tsx` — lista de clientes
- `src/oficinalindoautos/telas/ListaOS.tsx` — lista e cadastro de ordens de serviço
- `src/oficinalindoautos/telas/NovoAgendamento.tsx` — formulário de agendamento funcional
- `src/oficinalindoautos/telas/NovoOrcamento.tsx` — formulário de orçamento funcional
- `src/oficinalindoautos/componentes/` — componentes reutilizáveis da interface
- `src/oficinalindoautos/utils/` — funções auxiliares, como formatação, WhatsApp e sincronização com Firebase
- `src/oficinalindoautos/web-cliente/` — página web pública para consulta do cliente

## Tecnologias usadas

- Expo
- React Native
- TypeScript
- SQLite local com `expo-sqlite`
- Firebase Realtime Database
- Firebase Hosting

## Rodar o app

No diretório `src/oficinalindoautos` execute:

```bash
npm start
```

Abra o QR code no Expo Go do celular ou no emulador para ver o app funcionar.

## Validar o TypeScript

No diretório `src/oficinalindoautos`, execute:

```bash
npm run typecheck
```

Esse comando verifica se existem erros de TypeScript sem gerar arquivos de build.

## Gerar APK do aplicativo

O projeto usa EAS Build para gerar o APK Android.

No diretório `src/oficinalindoautos`, faça login na sua conta Expo, se necessário:

```bash
eas login
```

Depois execute:

```bash
eas build -p android --profile preview
```

O perfil `preview` está configurado no arquivo `eas.json` para gerar um APK de distribuição interna:

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

Ao final do processo, o EAS exibirá um link para baixar o arquivo `.apk`.

## Como fazer alterações no projeto

Antes de alterar qualquer coisa, abra a pasta do app:

```text
src/oficinalindoautos
```

Depois de cada alteração importante, rode:

```bash
npm run typecheck
```

Esse comando ajuda a encontrar erros de TypeScript antes de testar no celular.

## Alterar o aplicativo mobile

As telas do aplicativo ficam em:

```text
src/oficinalindoautos/telas
```

### Como alterar Cores e Estilos no Aplicativo

O aplicativo utiliza o sistema nativo do React Native para estilização (`StyleSheet.create`). 

- **Onde ficam as cores e estilos?** No final de cada arquivo de tela (ex: `Inicio.tsx`, `Agenda.tsx`, etc.) e de componentes (ex: `BotaoCartao.tsx`), existe uma constante chamada `styles` criada com `StyleSheet.create`.
- **Como alterar uma cor?** Basta procurar pela propriedade de estilo correspondente, como:
  - `backgroundColor` (cor de fundo)
  - `color` (cor do texto)
  - `borderColor` (cor da borda)
- **Cores padrão do app:**
  - Azul Destaque/Ativo: `#007AFF`
  - Bordas e Textos Fortes: `#000000` (Preto) e `#ffffff` (Branco) para dar um visual limpo e contrastante "estilo Neobrutalismo".
  - Vermelho de Alerta (Exclusão/Limpeza): `#E53E3E`

- **Navegação (Abas inferiores):** Se quiser mudar as cores dos botões de navegação inferiores ou o fundo da barra, edite o arquivo `App.tsx` onde o `Tab.Navigator` e a constante `styles` do `tabBar` estão configurados.

Arquivos mais comuns para alteração:

- `Inicio.tsx` — tela inicial e resumo dos dados.
- `Agenda.tsx` — listagem e edição dos agendamentos.
- `Orcamentos.tsx` — listagem e aprovação dos orçamentos.
- `Clientes.tsx` — cadastro e gerenciamento dos clientes.
- `ListaOS.tsx` — cadastro, edição e acompanhamento das ordens de serviço.
- `NovoAgendamento.tsx` — formulário para criar agendamentos.
- `NovoOrcamento.tsx` — formulário para criar orçamentos.

Os componentes reutilizáveis ficam em:

```text
src/oficinalindoautos/componentes
```

Os dados, ações e banco local ficam concentrados em:

```text
src/oficinalindoautos/context/OficinaContext.tsx
```

Se precisar alterar regras de cadastro, edição, exclusão ou sincronização dos dados, esse é o arquivo principal.

Para testar mudanças no app, execute:

```bash
npm start
```

Depois abra no Expo Go pelo QR Code ou use um emulador Android.

## Alterar a página web do cliente

A página web pública fica em:

```text
src/oficinalindoautos/web-cliente/index.html
```

Nesse arquivo estão juntos:

- estrutura HTML da página
- estilos CSS
- JavaScript que consulta o Firebase

A página busca os dados no Firebase Realtime Database usando a placa do veículo:

```text
/ordens/{PLACA}.json
```

Se alterar apenas texto, cores, layout ou comportamento da página do cliente, normalmente basta editar o arquivo `index.html`.

Para testar rapidamente a página web, abra o arquivo no navegador ou use uma extensão de servidor local, como Live Server.

Depois de testar, publique novamente no Firebase a partir da raiz do projeto:

```bash
firebase deploy
```

## Cuidados ao alterar

- Não altere o caminho `/ordens/{PLACA}` sem atualizar também o app mobile e a página web.
- Se mudar os campos de uma ordem de serviço, revise `OficinaContext.tsx`, `utils/cloudSync.ts` e `web-cliente/index.html`.
- Depois de alterar o app, rode `npm run typecheck`.
- Depois de alterar o portal web, teste uma placa existente antes de publicar.

## Guia rápido para estudantes

O fluxo principal do app é:

1. A oficina cria agendamentos, orçamentos, clientes e ordens de serviço no aplicativo.
2. Os dados ficam salvos localmente no celular usando SQLite.
3. Quando uma ordem de serviço possui placa, o app envia o status para o Firebase.
4. O cliente acessa o portal web e consulta o andamento pela placa do veículo.

Arquivos importantes para começar a estudar:

- `App.tsx` — define a navegação entre as telas.
- `context/OficinaContext.tsx` — concentra os dados, ações e persistência local.
- `telas/ListaOS.tsx` — gerencia as ordens de serviço.
- `utils/cloudSync.ts` — envia e remove ordens de serviço no Firebase.
- `web-cliente/index.html` — portal público usado pelos clientes.

## Portal web do cliente

A página web do cliente fica em:

```text
src/oficinalindoautos/web-cliente/index.html
```

Ela permite consultar o status de uma ordem de serviço pela placa do veículo.

O app sincroniza as ordens de serviço com o Firebase Realtime Database no caminho:

```text
/ordens/{PLACA}/{ID_DA_ORDEM}
```

## Hospedagem no Firebase

A configuração da hospedagem fica no arquivo:

```text
firebase.json
```

O Firebase Hosting está configurado para publicar a pasta:

```text
src/oficinalindoautos/web-cliente
```

Para publicar o portal, use o Firebase CLI a partir da raiz do projeto:

```bash
firebase deploy
```

## Observações

- O app ainda está em desenvolvimento.
- O banco local do app é SQLite.
- O portal web depende dos dados sincronizados com o Firebase.
- O logo está carregado em `src/oficinalindoautos/assets/logo.jpeg`.
