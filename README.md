# 💰 Finanças Pro

**Finanças Pro** é um aplicativo web moderno para controle financeiro pessoal e compartilhado, ideal para uso individual ou em casal/família.  
O projeto foi desenvolvido utilizando apenas **HTML, CSS e JavaScript**, sem backend, com foco em simplicidade, visualização clara dos gastos e sincronização em tempo real entre duas pessoas.

---

## ✨ Funcionalidades

- 📊 **Dashboard financeiro**

  - Total de receitas, despesas, saldo e média de gastos
  - Fluxo financeiro mensal
  - Indicadores de economia e resultado líquido

- 👥 **Gestão familiar (até 5 integrantes)**

  - Cadastro de 1 a 5 integrantes já no primeiro acesso
  - Adicionar, renomear e remover integrantes na aba Gerência
  - Todo lançamento é atribuído a um integrante; a visão "Geral" soma todos (a divisão de quem paga quanto fica a critério da família)
  - Aba detalhada e previsão de gastos fixos por integrante

- 🏷️ **Categorias personalizadas** (gerenciadas na aba Gerência)

  - Alimentação, Moradia, Lazer, Transporte, Saúde, Educação, Compras e Outros
  - Gráficos por categoria

- 🔁 **Transações recorrentes**

  - Marcação de gastos fixos mensais
  - Fixos entram automaticamente nos meses seguintes, no mesmo dia, sem confirmação ("Automático" quando a data já chegou, "Previsto" quando é futura) — só previsão, nada é gravado
  - Caixinhas (metas) com depósito automático mensal: o valor entra como despesa "para a caixinha" e o saldo previsto aparece ao filtrar meses futuros
  - Card "Próximos meses" com o saldo previsto de cada mês (estilo fatura)

- 🔍 **Filtros avançados**

  - Filtro por mês, ano, categoria e pessoa

- 🌗 **Tema claro e escuro**

  - Escolha manual pelo usuário
  - Detecção automática do tema do sistema

- 🔄 **Sincronização entre integrantes (P2P)**

  - Sincronização direta entre dois navegadores usando **PeerJS**
  - Compartilhamento de dados sem servidor
  - Conectar **não envia dados**: cada lado escolhe "Enviar meus dados" e o outro aceita ou cancela
  - Na hora de aceitar, o app mostra "Quem é quem?" para associar integrantes com nomes diferentes em cada aparelho
  - Antes de mesclar, é salvo um **backup automático** (menu ⋮ → Backup automático), que pode ser restaurado
  - Depois do primeiro aceite, lançamentos, metas, categorias e novos integrantes sincronizam **em tempo real**
  - O PeerJS só é carregado ao abrir "Sincronizar integrantes"

- 📦 **Importação e exportação**

  - Exportar backup cifrado (JSON criptografado com o **PIN do arquivo**: o PIN em uso no dia da exportação; trocar o PIN depois não altera backups já gerados)
  - Importar backups cifrados ou backups antigos em JSON aberto
  - `exemplo-apresentacao.json`: backup cifrado de demonstração (Antonio e Maria, PIN **1234**). Agosto/2026 tem despesas extras (saldo negativo) para demonstrar o filtro. As caixinhas "Reserva de emergência" (dia 6) e "Viagem de férias" (dia 7) têm depósito automático a partir de dezembro/2026: filtre meses futuros para ver os fixos e os depósitos previstos. Importe pelo menu ⋮ → Importar backup: a tela "Quem é quem?" mostra os integrantes do arquivo e permite associar, criar ou marcar "Não importar"

- 💾 **Persistência local criptografada**
  - Dados salvos automaticamente no `localStorage`, criptografados com o PIN do usuário

---

## 🖥️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Bootstrap 5
- Bootstrap Icons
- PeerJS
- LocalStorage

---

## 📁 Estrutura do Projeto

 ```
├── index.html      # Estrutura da página, modais e importação de bibliotecas
├── style.css       # Estilos personalizados, temas e animações
├── security.js     # Criptografia (cofre local, PIN e backups cifrados)
├── script.js       # Lógica de negócio, gráficos, PeerJS e manipulação de dados
└── README.md       # Documentação do projeto
 ```
---

## 🚀 Como Executar

1. Baixe ou clone o projeto
2. Abra o arquivo `index.html` no navegador

---

## 🔐 Privacidade

Nenhum dado financeiro é enviado para servidores.
Todas as informações permanecem localmente no navegador ou sincronizadas via P2P.

- Os dados ficam em um cofre criptografado com **AES-GCM 256** no `localStorage`.
- A chave é derivada do **PIN** do usuário com **PBKDF2-SHA256 (600.000 iterações)**.
- O PIN nunca é salvo; os dados abertos existem apenas em memória enquanto o app está desbloqueado.
- Os backups exportados também são criptografados e exigem o PIN usado na exportação.
- O PIN tem no mínimo 4 caracteres. PINs simples (ex.: 1234) são permitidos, mas o medidor indica a segurança como **Baixa**. Os campos de PIN têm botão para mostrar/ocultar o que foi digitado.
- O PIN pode ser alterado (menu ⋮ → Alterar PIN) informando o PIN atual.
- A sincronização entre integrantes é **criptografada ponta a ponta**: cada aparelho tem um par de chaves ECDH P-256 (a privada fica no cofre cifrado). A chave de sessão AES-GCM é derivada dos dois lados, sem combinar senha. O recomendado é enviar o ID de conexão diretamente ao integrante; a busca de integrantes online (lobby) é opcional.
- No primeiro acesso é exigido o aceite dos **Termos de uso e Política de privacidade** (menu ⋮ → Termos e privacidade).
- ⚠️ **Se o PIN for perdido ou esquecido, não há como recuperar os dados.**
- Na busca de integrantes online, apenas o seu nome e um ID temporário de conexão são enviados ao serviço de lobby.

---

## 🛠️ Melhorias Futuras

- Versão PWA
- Metas financeiras
- Histórico mensal
- Sincronização com mais de dois dispositivos ao mesmo tempo

---

## 📄 Licença

Uso livre para fins pessoais e educacionais.
