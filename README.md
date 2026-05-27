# Oficina LindoAutos 🚗🎓

**Este é um projeto universitário desenvolvido para fins acadêmicos e de aprendizado.**

Aplicativo para gestão de uma oficina mecânica e centro automotivo, desenvolvido com **Expo, React Native e TypeScript**.

O projeto permite controlar agendamentos, orçamentos, clientes e ordens de serviço localmente com banco de dados SQLite. Ele também possui uma integração com o Firebase para sincronização em tempo real e uma página web associada para o cliente consultar o andamento do serviço pela placa do veículo.

- agendar serviços (com nova agenda dividida em abas, máscara automática de data/hora, status avançados e modal de remarcar)
- criar orçamentos
- cadastrar e listar clientes
- criar e acompanhar ordens de serviço (altamente otimizado com renderização virtualizada de lista)
- sincronizar o status das ordens de serviço com o Firebase
- permitir que o cliente acompanhe o serviço pelo portal web

## Novidades da Refatoração (Gestão e Performance) 🚀

- **📅 Nova Agenda por Abas:** Os agendamentos agora são divididos em abas inteligentes (`Hoje`, `Futuro`, `Passado` e `Tudo`), facilitando o controle operacional da oficina.
- **✍️ Máscara de Data e Hora:** Input de agendamento aprimorado com formatação automática em tempo real (`DD/MM/AAAA às HH:mm`) para evitar digitações inválidas.
- **⏰ Recurso de Remarcação:** Modal interativo de remarcar funcional, integrando teclado numérico inteligente e persistência de dados correta.
- **⚡ Performance Otimizada:** Substituição completa de mapeamentos de listas estáticas (`ScrollView` + `map`) por listas virtualizadas (`FlatList`). Utilização de ganchos de memorização (`useMemo` e `React.memo` para `CardOS` e `CardAgendamento`), permitindo navegação fluida com milhares de itens e prevenindo re-renderizações desnecessárias.
- **🛡️ Migração SQLite Segura:** Adicionado script de migração automático no banco SQLite para a coluna `atualizadoEm`, prevenindo quebras em versões de aplicativos legadas.

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

### Principais Dependências do Projeto

Para ajudar os estudantes a compreenderem o ecossistema do app, aqui estão as principais bibliotecas (dependências) instaladas no `package.json` e o papel de cada uma:

* **`expo` (~54.0.33)**: O framework base que facilita o desenvolvimento React Native, dando acesso a APIs nativas do celular sem precisar mexer em código Java/Kotlin ou Swift/Objective-C.
* **`expo-sqlite` (~16.0.10)**: Biblioteca que cria e gerencia o banco de dados SQL local direto no armazenamento do celular. É onde ficam salvos os clientes, agendamentos e ordens de serviço.
* **`expo-font` (~14.0.11)**: Utilizada para carregar fontes personalizadas (como as fontes variáveis *Open Sans*) dinamicamente durante a inicialização do app.
* **`@react-navigation/native` & `@react-navigation/bottom-tabs` & `@react-navigation/native-stack`**: O conjunto de bibliotecas oficial para controle de telas e navegação do app. 
  * `native-stack`: Permite abrir telas sobrepostas com efeito de transição deslizante (como a tela de *Novo Agendamento*).
  * `bottom-tabs`: Cria o menu de navegação inferior com ícones animados na barra inferior do app.
* **`@expo/vector-icons` (^15.0.3)**: Fornece o conjunto de ícones prontos (da coleção *Ionicons*) usados no menu inferior de abas e nos botões.
* **`react-native-safe-area-context`**: Garante que o conteúdo do app não fique escondido sob barras de status, "entalhes" (*notches*) da câmera ou botões virtuais do sistema do celular.

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

### 1. Build de Produção (Recomendado para Atualizações) 🚀
Gera o APK oficial assinado com a Keystore cadastrada na sua conta Expo. Isso permite instalar o app por cima do atual no seu celular **sem perder nenhum dado do SQLite local**:

```bash
npx eas build --platform android --profile production
```

### 2. Build de Preview (Testes Rápidos) 🧪
Gera um APK de distribuição interna simples:

```bash
npx eas build --platform android --profile preview
```

> **Configuração:** Ambas as opções (`production` e `preview`) estão configuradas no arquivo `eas.json` com `"buildType": "apk"` para que a Expo gere arquivos `.apk` prontos para instalação direta, em vez de pacotes `.aab` (usados apenas para subir na loja Google Play).

Ao final do processo, o EAS exibirá um QR Code no terminal e um link para baixar o arquivo `.apk`.

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

### Como Publicar as Alterações no Firebase (Deploy)

Para que qualquer alteração feita no arquivo `index.html` vá para a internet, você precisa ter as ferramentas do Firebase instaladas. Siga este passo a passo:

1. **Instalar o Firebase CLI** (necessário apenas na primeira vez):
   Abra o seu terminal e instale as ferramentas globalmente:
   ```bash
   npm install -g firebase-tools
   ```

2. **Fazer Login na sua conta Firebase**:
   Na raiz do projeto, execute o comando abaixo para conectar o terminal à sua conta Google onde o Firebase foi criado:
   ```bash
   firebase login
   ```
   *Um navegador se abrirá para você autorizar o acesso.*

3. **Publicar (Fazer o Deploy)**:
   Ainda na raiz do projeto (onde fica o arquivo `firebase.json`), execute:
   ```bash
   firebase deploy
   ```

O Firebase enviará o arquivo `index.html` da pasta `web-cliente` diretamente para os links de produção (`lindo-autos.web.app`).

## Observações

- O app ainda está em desenvolvimento.
- O banco local do app é SQLite.
- O portal web depende dos dados sincronizados com o Firebase.
- O logo está carregado em `src/oficinalindoautos/assets/logo.jpeg`.
