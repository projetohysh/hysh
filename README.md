# 🟪 Hysh
# Projeto em React Native + Expo

APK Download: https://drive.google.com/file/d/1fm1IR9dpRRZfmRPYnxeC0seEqLKMZBzn/view?usp=sharing

# ⚙️ Requisitos

Antes de iniciar, você precisa ter instalado:

- **Aplicativo Expo Go no celular para testes e visualização em tempo real das alterações feitas**:
- **Node.js** (recomendado v18 ou superior)  
- **Yarn** ou **npm**  
- **Expo CLI**:

```bash
npm install -g expo-cli
# ou
yarn global add expo-cli
```
**Instalação do Projeto**
```bash
Clone o repositório:

git clone git@github.com:projetohysh/hysh.git
cd hysh
```

**Instale as dependências:**
```bash
yarn install
# ou
npm install
```

**Inicie o Expo:**
```bash
npm run start
```
Abrirá o Metro Bundler.<br>
Você poderá abrir no aplicativo Expo Go utilizando QR Code disponibilizado no terminal.

**Importante**
- Sempre que abrir o projeto é importante fazer um git pull para garantir que está trabalhando na versão mais recente do projeto
- Após o git pull, no terminal do projeto rode npm install para garantir que todas as dependências necessárias estão instaladas.
```bash
npm install
```
- Se realizar alterações, após se certificar de que está tudo ok, suba a versão atualizada para que o restante do time consiga acessar também
  

# 🟪 Estilos
## Cores:
Cor principal (Roxo):  #5C39BE<br>
Roxo 2:  #6F46E5<br>
Roxo 3:  #825AF7<br>
Cinza escuro:  #717171<br>
Cinza claro:  #A7A7A7<br>
Verde: #17FF82<br>

### Light Mode (Padrão):
Background: white (#ffffff)<br>
text: black (#000000)<br>

### Dark Mode:
Background: black (#000000)<br>
text: white (#ffffff)<br>
##Colors.ts<br>
Nesse arquivo são  definidos os estilos que serão reutilizados em diversas telas do app. Ex: cor background no modo dark.<br> 



# 🟪 Tabs
Telas que vão aparecer no menu de navegação principal do app devem ser criadas na pasta (tabs) com o nome da aba e extensão tsx ou jsx (preferencialmente tsx). Ex: Comunidades.tsx
# 🟪 Components
Aqui iremos armazenar elementos que podem ser reutilizados em mais de uma tela do app. Ex: Card de postagem, botões, input de comentários, etc.
# 🟪 Telas
Telas que não aparecem no menu principal, por ex: login, lista de amigos, etc ficam armazenadas diretamente na pasta app com extensão tsx ou jsx (preferencialmente tsx) Ex: editarPerfil.tsx

