# Real-time Location Map

Aplicação full-stack que sincroniza coordenadas de vários utilizadores em tempo real. React no frontend, Node.js + Socket.IO no backend, sem base de dados.

## Como correr localmente

- Backend  
  ```bash
  cd backend
  npm install
  npm run dev        # ou npm start
  ```
  Variáveis:
  - `PORT` (opcional, default `4000`)
  - `CLIENT_ORIGIN` (opcional, CSV de origens permitidas para CORS; default `*`)

- Frontend  
  ```bash
  cd frontend
  npm install
  npm run dev        # Vite em http://localhost:5173
  ```
  Variáveis:
  - `VITE_SOCKET_URL` (URL do backend, ex.: `http://localhost:4000`)

## Decisões técnicas
- **Socket.IO** para transporte bidirecional simples e fiável; o servidor mantém um `Map` em memória com as coordenadas atuais de cada socket.
- **Leaflet + react-leaflet** para o mapa; marcador circular destaca o utilizador atual e marcadores padrão mostram os restantes.
- **Atualização periódica**: o cliente emite coordenadas imediatamente e a cada 4s, além do `watchPosition` para reagir a mudanças.
- **Limpeza em tempo real**: ao `disconnect`, o servidor remove o utilizador e transmite a lista atualizada.
- **Sem base de dados**: o estado vive apenas na memória do processo, alinhado com o requisito.
- **Hardcoded para deploy rápido**:  
  - Backend está com `CLIENT_ORIGIN` padrão `https://mapapp-one.vercel.app`. Ajuste se mudar o domínio do frontend.  
  - Frontend usa fallback `VITE_SOCKET_URL=https://mapp-app.onrender.com`. Defina a env em produção para o host atual do backend.

## Deploy sugerido
- **Backend (Render/Railway/Fly.io)**  
  - Runtime: Node 20+.  
  - Comando: `npm start` na pasta `backend`.  
  - Variáveis: `PORT` (fornecida pela plataforma), `CLIENT_ORIGIN` com o domínio do frontend.  
  - Garanta WebSockets ativados.
- **Frontend (Netlify/Vercel)**  
  - Build command: `npm run build` na pasta `frontend`.  
  - Publish directory: `frontend/dist`.  
  - Env: `VITE_SOCKET_URL` apontando para o backend público.

## Notas de uso
- O navegador pede permissão de localização; se recusada, um alerta aparece no painel.
- A lista mostra as tuas coordenadas e de todos os outros utilizadores ligados naquele momento, atualizando sem refresh.
- Ao fechar a aba ou perder ligação, o utilizador sai automaticamente da lista para todos os clientes.
