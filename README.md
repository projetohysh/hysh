# 🟪 Hysh
# Projeto em React Native + Expo

# ⚙️ Requisitos

Antes de iniciar, você precisa ter instalado:

- **Node.js** (recomendado v18 ou superior)  
- **Yarn** ou **npm**  
- **Expo CLI**:

```bash
npm install -g expo-cli
# ou
yarn global add expo-cli

**Instalação do Projeto**

Clone o repositório:

git clone git@github.com:projetohysh/hysh.git
cd hysh


**Instale as dependências:**

yarn install
# ou
npm install


**Inicie o Expo:**
expo start
Abrirá o Metro Bundler.
Você poderá abrir no aplicativo Expo Go utilizando QR Code disponibilizado no terminal.

# 🟪 Estilos
## Cores:
Cor principal (Roxo):  #5C39BE
Roxo 2:  #6F46E5
Roxo 3:  #825AF7
Cinza escuro:  #717171
Cinza claro:  #A7A7A7
Verde: #17FF82

### Light Mode (Padrão):
Background: white (#ffffff)
text: black (#000000)

### Dark Mode:
Background: black (#000000)
text: white (#ffffff)
##Colors.ts
Nesse arquivo são  definidos os estilos que serão reutilizados em diversas telas do app. Ex: cor background no modo dark. 



# 🟪 Tabs
Telas que vão aparecer no menu de navegação principal do app devem ser criadas na pasta (tabs) com o nome da aba e extensão tsx ou jsx (preferencialmente tsx). Ex: Comunidades.tsx
# 🟪 Components
Aqui iremos armazenar elementos que podem ser reutilizados em mais de uma tela do app. Ex: Card de postagem, botões, input de comentários, etc.
# 🟪 Telas
Telas que não aparecem no menu principal, por ex: login, lista de amigos, etc ficam armazenadas diretamente na pasta app com extensão tsx ou jsx (preferencialmente tsx) Ex: editarPerfil.tsx

