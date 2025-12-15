const STORAGE_KEY = "financas-pro-data";
const THEME_KEY = "financas-pro-theme";
const PROFILE_KEY = "financas-pro-profile";

const CATEGORIES = {
  alimentacao: { label: "Alimentação", icon: "bi-basket" },
  aluguel: { label: "Moradia", icon: "bi-house-door" },
  lazer: { label: "Lazer", icon: "bi-controller" },
  transporte: { label: "Transporte", icon: "bi-car-front" },
  saude: { label: "Saúde", icon: "bi-heart-pulse" },
  educacao: { label: "Educação", icon: "bi-book" },
  compras: { label: "Compras", icon: "bi-bag" },
  outros: { label: "Outros", icon: "bi-grid" },
};

let PERSONS = {
  eu: "Eu",
  parceiro: "Parceiro(a)",
  ambos: "Ambos",
};

const PALETTE_CATEGORIES = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#3b82f6",
];
const PALETTE_PERSONS = ["#f59e0b", "#ef4444", "#84cc16", "#d946ef", "#f97316"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

let state = {
  transactions: [],
  filters: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    category: "all",
    person: "all",
  },
  theme: "light",
  editingId: null,
  userProfile: {
    name: "",
    partnerName: "",
  },
};

let peer = null;
let conn = null;
let myPeerId = null;
let pendingImportData = null;
let tempImportAsPartner = false;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadProfile() {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) {
    state.userProfile = JSON.parse(stored);
    updatePersonLabels();
    document.getElementById("appContent").style.display = "block";
  } else {
    document.getElementById("onboardingScreen").style.display = "flex";
    document.getElementById("appContent").style.display = "none";
  }
}

function finishOnboarding() {
  const myName = document.getElementById("setupMyName").value.trim() || "Eu";
  const partnerName =
    document.getElementById("setupPartnerName").value.trim() || "Parceiro(a)";

  state.userProfile = { name: myName, partnerName: partnerName };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(state.userProfile));

  updatePersonLabels();

  document.getElementById("onboardingScreen").style.display = "none";
  document.getElementById("appContent").style.display = "block";

  if (!localStorage.getItem(STORAGE_KEY)) {
    state.transactions = getSampleTransactions();
    saveData();
  }

  setupFilters();
  render();
}

function updatePersonLabels() {
  PERSONS.eu = state.userProfile.name;
  PERSONS.parceiro = state.userProfile.partnerName;
  document.getElementById("tabBtnEu").textContent = PERSONS.eu;
  document.getElementById("tabBtnParceiro").textContent = PERSONS.parceiro;

  if (conn && conn.open) {
    sendData({ type: "profile_sync", data: state.userProfile });
  }
}

function initPeer() {
  peer = new Peer(null, {
    debug: 2,
  });

  peer.on("open", (id) => {
    myPeerId = id;
    document.getElementById("myPeerIdDisplay").value = id;
    updateConnectionStatus("online");
    document.getElementById("peerStatusMsg").textContent =
      "Pronto para conectar";
    document.getElementById("peerStatusMsg").className = "small text-success";
  });

  peer.on("connection", (connection) => {
    handleConnection(connection);
  });

  peer.on("disconnected", () => {
    updateConnectionStatus("offline");
    document.getElementById("peerStatusMsg").textContent =
      "Desconectado do servidor";
  });

  peer.on("error", (err) => {
    console.error(err);
    showToast("Erro de conexão: " + err.type, "error");
  });
}

function connectToPeer() {
  const remoteId = document.getElementById("remotePeerIdInput").value.trim();
  if (!remoteId) return showToast("Insira o ID do parceiro", "error");

  if (conn) {
    conn.close();
  }

  const connection = peer.connect(remoteId);
  handleConnection(connection);
}

function handleConnection(connection) {
  conn = connection;

  conn.on("open", () => {
    document.getElementById("connectedPeerSection").style.display = "flex";
    updateConnectionStatus("connected");

    document.getElementById("syncModal").classList.remove("active");
    showToast("Parceiro conectado!", "success");

    sendData({ type: "profile_sync", data: state.userProfile });
    sendData({ type: "full_sync", data: state.transactions });
  });

  conn.on("data", (payload) => {
    handleReceivedData(payload);
  });

  conn.on("close", () => {
    document.getElementById("connectedPeerSection").style.display = "none";
    updateConnectionStatus("online");
    showToast("Parceiro desconectado", "warning");
  });
}

function sendData(payload) {
  if (conn && conn.open) {
    conn.send(payload);
  }
}

function swapTransactionOwnership(t) {
  const newT = { ...t };
  if (newT.person === "eu") {
    newT.person = "parceiro";
  } else if (newT.person === "parceiro") {
    newT.person = "eu";
  }
  return newT;
}

function handleReceivedData(payload) {
  switch (payload.type) {
    case "profile_sync":
      break;

    case "full_sync":
      const swappedList = payload.data.map(swapTransactionOwnership);
      mergeTransactions(swappedList);
      break;

    case "transaction_update":
      const swappedTransaction = swapTransactionOwnership(payload.data);
      mergeSingleTransaction(swappedTransaction);
      break;

    case "transaction_delete":
      deleteLocalTransaction(payload.data.id, false);
      break;
  }
}

function mergeTransactions(incomingList) {
  let changed = false;
  incomingList.forEach((t) => {
    const exists = state.transactions.find((local) => local.id === t.id);
    if (!exists) {
      state.transactions.push(t);
      changed = true;
    } else {
      if (JSON.stringify(exists) !== JSON.stringify(t)) {
        Object.assign(exists, t);
        changed = true;
      }
    }
  });

  if (changed) {
    saveData(false);
    render();
    showToast("Dados sincronizados", "success");
  }
}

function mergeSingleTransaction(t) {
  const idx = state.transactions.findIndex((local) => local.id === t.id);
  if (idx !== -1) {
    state.transactions[idx] = t;
  } else {
    state.transactions.push(t);
  }
  saveData(false);
  render();
  showToast("Nova transação recebida");
}

function updateConnectionStatus(status) {
  const el = document.getElementById("connectionStatus");
  el.className = "connection-badge " + status;
  if (status === "connected") el.innerHTML = '<i class="bi bi-link"></i>';
  else if (status === "online") el.innerHTML = '<i class="bi bi-wifi"></i>';
  else el.innerHTML = '<i class="bi bi-wifi-off"></i>';
}

function getSampleTransactions() {
  return [];
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateForInput(date) {
  return date.toISOString().split("T")[0];
}

function saveData(broadcast = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  if (broadcast && conn && conn.open) {
  }
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      state.transactions = JSON.parse(stored);
    } catch (e) {
      state.transactions = [];
    }
  } else {
    state.transactions = [];
  }
}

function exportData() {
  const dataStr = JSON.stringify(state.transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup_financas_${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  link.click();
  showToast("Backup baixado com sucesso!", "success");
}

function triggerImport() {
  document.getElementById("importFile").click();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        pendingImportData = data;
        document.getElementById("importStep1").style.display = "block";
        document.getElementById("importStep2").style.display = "none";
        document.getElementById("importOptionsModal").classList.add("active");
      } else {
        showToast("Formato inválido", "error");
      }
    } catch (error) {
      showToast("Erro ao processar", "error");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function selectImportPerson(asPartner) {
  tempImportAsPartner = asPartner;
  document.getElementById("importStep1").style.display = "none";
  document.getElementById("importStep2").style.display = "block";
}

function executeImport(action) {
  if (!pendingImportData) return;

  let finalData = pendingImportData;
  if (tempImportAsPartner) {
    finalData = pendingImportData.map(swapTransactionOwnership);
  }

  if (action === "replace") {
    state.transactions = finalData;
    showToast("Dados substituídos com sucesso!", "success");
  } else if (action === "merge") {
    const existingIds = new Set(state.transactions.map((t) => t.id));
    const newItems = finalData.filter((t) => !existingIds.has(t.id));
    state.transactions = [...state.transactions, ...newItems];
    showToast(
      `${newItems.length} novos itens adicionados.`,
      newItems.length > 0 ? "success" : "warning"
    );
  }

  saveData();
  render();

  if (conn && conn.open) {
    sendData({ type: "full_sync", data: state.transactions });
  }

  document.getElementById("importOptionsModal").classList.remove("active");
  pendingImportData = null;
  tempImportAsPartner = false;
}

function saveTheme() {
  localStorage.setItem(THEME_KEY, state.theme);
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) state.theme = stored;
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    state.theme = "dark";
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  document.documentElement.setAttribute("data-bs-theme", state.theme);
  const icon = document.getElementById("themeIcon");
  if (state.theme === "dark") {
    icon.classList.replace("bi-moon-stars", "bi-sun");
  } else {
    icon.classList.replace("bi-sun", "bi-moon-stars");
  }
}

function getFilteredTransactions() {
  return state.transactions.filter((t) => {
    const date = new Date(t.date + "T00:00:00");
    return (
      date.getMonth() === state.filters.month &&
      date.getFullYear() === state.filters.year &&
      (state.filters.category === "all" ||
        t.category === state.filters.category) &&
      (state.filters.person === "all" || t.person === state.filters.person)
    );
  });
}

function calculateSummary(filtered) {
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const count = filtered.filter((t) => t.type === "expense").length;
  return {
    income,
    expense,
    balance: income - expense,
    average: count ? expense / count : 0,
  };
}

function render() {
  const filtered = getFilteredTransactions();
  const summary = calculateSummary(filtered);

  document.getElementById("totalIncome").textContent = formatCurrency(
    summary.income
  );
  document.getElementById("totalExpense").textContent = formatCurrency(
    summary.expense
  );
  const balEl = document.getElementById("totalBalance");
  balEl.textContent = formatCurrency(summary.balance);
  balEl.className = `summary-value ${
    summary.balance >= 0 ? "income" : "expense"
  }`;
  document.getElementById("averageExpense").textContent = formatCurrency(
    summary.average
  );

  renderTransactions(filtered);
  renderCharts(filtered, summary);
}

function renderTransactions(list) {
  const container = document.getElementById("transactionsList");
  if (list.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-secondary);">
      <i class="bi bi-inbox" style="font-size: 2rem;"></i><br>Nenhum registro.
    </div>`;
    return;
  }
  const sorted = [...list].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateB - dateA !== 0) {
      return dateB - dateA;
    }
    return b.id.localeCompare(a.id);
  });

  container.innerHTML = sorted
    .map((t) => {
      const catData = CATEGORIES[t.category] || {
        label: t.category,
        icon: "bi-tag",
      };
      const personLabel = PERSONS[t.person] || t.person;

      return `
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="t-icon-box ${t.type}">
            <i class="bi ${catData.icon}"></i>
          </div>
          <div class="t-details">
            <h4>${t.description}</h4>
            <div class="t-meta">
              <span>${catData.label}</span>
              <span class="t-dot"></span>
              <span>${personLabel}</span>
              <span class="t-dot"></span>
              <span>${formatDate(t.date)}</span>
              ${
                t.isRecurring
                  ? '<i class="bi bi-arrow-repeat" title="Recorrente"></i>'
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="transaction-right">
          <span class="t-amount ${t.type}">
            ${t.type === "income" ? "+" : "-"} ${formatCurrency(t.amount)}
          </span>
          <div class="t-actions">
            <button class="btn-icon-sm" onclick="editTransaction('${
              t.id
            }')"><i class="bi bi-pencil"></i></button>
            <button class="btn-icon-sm delete" onclick="confirmDelete('${
              t.id
            }')"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function generateBarChartHTML(inc, exp) {
  const tot = Math.max(inc, exp, 1);
  const incPct = (inc / tot) * 100;
  const expPct = (exp / tot) * 100;
  return `
      <div class="bar-chart">
        <div class="bar-item">
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
              <span class="bar-label">Receitas</span>
              <span style="font-weight:bold; color:var(--success)">${formatCurrency(
                inc
              )}</span>
          </div>
          <div class="bar-track"><div class="bar-fill income" style="width: ${incPct}%"></div></div>
        </div>
        <div class="bar-item">
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
              <span class="bar-label">Despesas</span>
              <span style="font-weight:bold; color:var(--danger)">${formatCurrency(
                exp
              )}</span>
          </div>
          <div class="bar-track"><div class="bar-fill expense" style="width: ${expPct}%"></div></div>
        </div>
      </div>
    `;
}

function generateCategoryListHTML(transactions, type) {
  const groups = {};
  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });

  const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0)
    return '<div style="color:var(--text-secondary);font-size:0.85rem;padding:0.5rem 0;">Sem registros</div>';

  return sorted
    .map(
      ([cat, val]) => `
        <div class="mini-list-item">
            <span>${CATEGORIES[cat] ? CATEGORIES[cat].label : cat}</span>
            <span class="mini-val ${type}">${formatCurrency(val)}</span>
        </div>
    `
    )
    .join("");
}

function renderPersonSpecificTab(containerId, personKey, list) {
  const pList = list.filter((t) => t.person === personKey);
  const inc = pList
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const exp = pList
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const bal = inc - exp;

  const html = `
        <div class="person-summary-row">
            <div class="p-card inc">
                <span>Receitas</span>
                <strong>${formatCurrency(inc)}</strong>
            </div>
            <div class="p-card exp">
                <span>Despesas</span>
                <strong>${formatCurrency(exp)}</strong>
            </div>
            <div class="p-card bal">
                <span>Saldo</span>
                <strong>${formatCurrency(bal)}</strong>
            </div>
        </div>

        ${generateBarChartHTML(inc, exp)}

        <div class="detail-lists-grid">
            <div class="detail-col">
                <h5>Entradas por Fonte</h5>
                ${generateCategoryListHTML(pList, "income")}
            </div>
            <div class="detail-col">
                <h5>Saídas por Categoria</h5>
                ${generateCategoryListHTML(pList, "expense")}
            </div>
        </div>
    `;

  document.getElementById(containerId).innerHTML = html;
}

function renderCharts(list, summary) {
  // 1. Gráfico de Categorias
  const cats = {};
  list
    .filter((t) => t.type === "expense")
    .forEach((t) => (cats[t.category] = (cats[t.category] || 0) + t.amount));

  renderPieChart(
    "categoryChart",
    "categoryLegend",
    cats,
    CATEGORIES,
    PALETTE_CATEGORIES
  );

  // 2. Gráfico por Pessoa
  const people = {};
  list
    .filter((t) => t.type === "expense")
    .forEach((t) => (people[t.person] = (people[t.person] || 0) + t.amount));

  renderPieChart(
    "personChart",
    "personLegend",
    people,
    PERSONS,
    PALETTE_PERSONS,
    true
  );

  // 3. Gráfico de Barras (Fluxo)
  document.getElementById("incomeExpenseChart").innerHTML =
    generateBarChartHTML(summary.income, summary.expense);

  // --- CÁLCULO DOS INDICADORES E PREVISÃO ---

  // Taxa de Economia Atual
  const savedPct =
    summary.income > 0
      ? ((summary.income - summary.expense) / summary.income) * 100
      : 0;

  // Lógica de Previsão: Soma apenas transações RECORRENTES ativas
  const recurring = state.transactions.filter((t) => t.isRecurring);

  const calcRecurring = (personKey) => {
    const pList = recurring.filter(
      (t) => personKey === "ambos" || t.person === personKey
    );
    const inc = pList
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = pList
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { inc, exp, bal: inc - exp };
  };

  const nextEu = calcRecurring("eu");
  const nextParceiro = calcRecurring("parceiro");

  // HTML atualizado dos Indicadores
  document.getElementById("fluxoIndicators").innerHTML = `
    <div class="indicator-group">
        <div class="indicator-box">
            <div class="indicator-title">Taxa de Economia</div>
            <div class="indicator-val ${
              savedPct >= 0 ? "positive" : "negative"
            }">
                ${savedPct.toFixed(1)}%
            </div>
        </div>
        <div class="indicator-box">
            <div class="indicator-title">Resultado Líquido</div>
            <div class="indicator-val ${
              summary.balance >= 0 ? "positive" : "negative"
            }">
                ${formatCurrency(summary.balance)}
            </div>
        </div>
    </div>

    <div style="width:100%; text-align:left; font-size:0.8rem; margin-top:1rem; margin-bottom:0.5rem;">
        <i class="bi bi-calendar-check"></i> Previsão Fixa (Próx. Mês)
    </div>

    <div class="indicator-group">
        <div class="indicator-box highlight">
            <h6>${PERSONS.eu}</h6>
            <div class="indicator-row">
                <span>Fixos (+):</span>
                <span class="indicator-mini-val text-inc">${formatCurrency(
                  nextEu.inc
                )}</span>
            </div>
            <div class="indicator-row">
                <span>Fixos (-):</span>
                <span class="indicator-mini-val text-exp">${formatCurrency(
                  nextEu.exp
                )}</span>
            </div>
            <hr style="margin: 5px 0; border-color: var(--border)">
             <div class="indicator-row">
                <span>Sobra:</span>
                <span class="indicator-mini-val" style="color: ${
                  nextEu.bal >= 0 ? "var(--text-primary)" : "var(--danger)"
                }">
                    ${formatCurrency(nextEu.bal)}
                </span>
            </div>
        </div>

        <div class="indicator-box highlight">
            <h6>${PERSONS.parceiro}</h6>
            <div class="indicator-row">
                <span>Fixos (+):</span>
                <span class="indicator-mini-val text-inc">${formatCurrency(
                  nextParceiro.inc
                )}</span>
            </div>
            <div class="indicator-row">
                <span>Fixos (-):</span>
                <span class="indicator-mini-val text-exp">${formatCurrency(
                  nextParceiro.exp
                )}</span>
            </div>
             <hr style="margin: 5px 0; border-color: var(--border)">
             <div class="indicator-row">
                <span>Sobra:</span>
                <span class="indicator-mini-val" style="color: ${
                  nextParceiro.bal >= 0
                    ? "var(--text-primary)"
                    : "var(--danger)"
                }">
                    ${formatCurrency(nextParceiro.bal)}
                </span>
            </div>
        </div>
    </div>
  `;

  renderPersonSpecificTab("detailEu", "eu", list);
  renderPersonSpecificTab("detailParceiro", "parceiro", list);
}

function renderPieChart(
  containerId,
  legendId,
  dataObj,
  mapping,
  palette,
  isSimpleMap = false
) {
  const entries = Object.entries(dataObj).filter(([_, v]) => v > 0);
  const total = entries.reduce((s, [_, v]) => s + v, 0);
  const container = document.getElementById(containerId);
  const legend = legendId ? document.getElementById(legendId) : null;

  if (entries.length === 0) {
    container.innerHTML =
      '<span style="color:var(--text-secondary); font-size:0.9rem;">Sem dados</span>';
    if (legend) legend.innerHTML = "";
    return;
  }

  let cumulative = 0;
  const svg = `<svg class="pie-chart" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" stroke-width="20" />
    ${entries
      .map(([key, val], i) => {
        const pct = (val / total) * 100;
        const color = palette[i % palette.length];
        const dash = (pct / 100) * (2 * Math.PI * 40);
        const gap = 2 * Math.PI * 40 - dash;
        const offset = -(cumulative / 100) * (2 * Math.PI * 40);
        cumulative += pct;

        let label = isSimpleMap ? mapping[key] : mapping[key].label;
        if (!label) label = key;

        return `<circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="20" 
              stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${offset}" class="donut-segment">
              <title>${label}: ${formatCurrency(val)}</title></circle>`;
      })
      .join("")}
  </svg>`;
  container.innerHTML = svg;

  if (legend) {
    legend.innerHTML = entries
      .map(([key, val], i) => {
        let label = isSimpleMap ? mapping[key] : mapping[key].label;
        if (!label) label = key;

        const color = palette[i % palette.length];
        return `<div class="legend-item"><span class="legend-color" style="background:${color}"></span>${label} (${Math.round(
          (val / total) * 100
        )}%)</div>`;
      })
      .join("");
  }
}

function openModal(transaction = null) {
  state.editingId = transaction ? transaction.id : null;
  const modal = document.getElementById("transactionModal");
  document.getElementById("modalTitle").textContent = transaction
    ? "Editar Transação"
    : "Nova Transação";
  document.getElementById("txDescription").value =
    transaction?.description || "";
  document.getElementById("txAmount").value = transaction?.amount || "";
  document.getElementById("txDate").value =
    transaction?.date || formatDateForInput(new Date());
  document.getElementById("txCategory").value =
    transaction?.category || "outros";
  document.getElementById("txPerson").value = transaction?.person || "eu";
  document.getElementById("txRecurring").checked =
    transaction?.isRecurring || false;
  setType(transaction?.type || "expense");
  modal.classList.add("active");
}

function editTransaction(id) {
  const transaction = state.transactions.find((t) => t.id === id);
  if (transaction) openModal(transaction);
  else showToast("Erro ao encontrar transação.", "error");
}

function closeModal() {
  document.getElementById("transactionModal").classList.remove("active");
  document
    .querySelectorAll(".form-control.error")
    .forEach((el) => el.classList.remove("error"));
}

function setType(type) {
  document.getElementById("txType").value = type;
  const container = document.querySelector(".type-toggle-container");
  const btns = document.querySelectorAll(".type-btn");
  btns.forEach((b) => b.classList.remove("active"));
  if (type === "income") {
    container.classList.add("income-active");
    document.getElementById("typeIncome").classList.add("active");
  } else {
    container.classList.remove("income-active");
    document.getElementById("typeExpense").classList.add("active");
  }
}

function saveTransaction() {
  const descEl = document.getElementById("txDescription");
  const amountEl = document.getElementById("txAmount");
  const dateEl = document.getElementById("txDate");

  if (
    !descEl.value.trim() ||
    !amountEl.value ||
    amountEl.value <= 0 ||
    !dateEl.value
  ) {
    if (!descEl.value) descEl.classList.add("error");
    if (!amountEl.value || amountEl.value <= 0) amountEl.classList.add("error");
    if (!dateEl.value) dateEl.classList.add("error");
    showToast("Preencha os campos obrigatórios", "error");
    return;
  }

  const transaction = {
    id: state.editingId || generateId(),
    description: descEl.value.trim(),
    amount: parseFloat(amountEl.value),
    date: dateEl.value,
    category: document.getElementById("txCategory").value,
    person: document.getElementById("txPerson").value,
    type: document.getElementById("txType").value,
    isRecurring: document.getElementById("txRecurring").checked,
  };

  if (state.editingId) {
    const idx = state.transactions.findIndex((t) => t.id === state.editingId);
    if (idx !== -1) state.transactions[idx] = transaction;
    showToast("Atualizado com sucesso!");
  } else {
    state.transactions.push(transaction);
    showToast("Adicionado com sucesso!");
  }

  saveData(true);
  if (conn && conn.open)
    sendData({ type: "transaction_update", data: transaction });

  render();
  closeModal();
}

let deleteId = null;
function confirmDelete(id) {
  deleteId = id;
  document.getElementById("confirmModal").classList.add("active");
}

function deleteLocalTransaction(id, broadcast = true) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveData(false);
  render();
  if (broadcast && conn && conn.open) {
    sendData({ type: "transaction_delete", data: { id } });
  }
}

function showToast(msg, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="bi ${
    type === "success" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"
  }"></i> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function setupFilters() {
  const catSel = document.getElementById("txCategory");
  const filterCat = document.getElementById("filterCategory");
  catSel.innerHTML = "";
  filterCat.innerHTML = "";

  Object.entries(CATEGORIES).forEach(([k, v]) => {
    catSel.innerHTML += `<option value="${k}">${v.label}</option>`;
    filterCat.innerHTML += `<option value="${k}">${v.label}</option>`;
  });
  filterCat.insertAdjacentHTML(
    "afterbegin",
    '<option value="all">Todas Categorias</option>'
  );

  const perSel = document.getElementById("txPerson");
  const filterPer = document.getElementById("filterPerson");
  perSel.innerHTML = "";
  filterPer.innerHTML = "";

  Object.entries(PERSONS).forEach(([k, v]) => {
    perSel.innerHTML += `<option value="${k}">${v}</option>`;
    filterPer.innerHTML += `<option value="${k}">${v}</option>`;
  });
  filterPer.insertAdjacentHTML(
    "afterbegin",
    '<option value="all">Todas Pessoas</option>'
  );
}

function init() {
  loadTheme();
  loadData();
  loadProfile();
  initPeer();

  setupFilters();

  const mSel = document.getElementById("filterMonth");
  MONTHS.forEach(
    (m, i) =>
      (mSel.innerHTML += `<option value="${i}" ${
        i === state.filters.month ? "selected" : ""
      }>${m}</option>`)
  );

  const ySel = document.getElementById("filterYear");
  for (let i = 2023; i <= 2030; i++)
    ySel.innerHTML += `<option value="${i}" ${
      i === state.filters.year ? "selected" : ""
    }>${i}</option>`;

  document.getElementById("btnFinishOnboarding").onclick = finishOnboarding;
  document.getElementById("btnImportMenu").onclick = triggerImport;
  document.getElementById("importFile").onchange = importData;
  document.getElementById("btnExportMenu").onclick = exportData;

  document.getElementById("btnSyncMenu").onclick = () => {
    document.getElementById("syncModal").classList.add("active");
  };
  document.getElementById("btnCloseSyncX").onclick = () => {
    document.getElementById("syncModal").classList.remove("active");
  };
  document.getElementById("btnCopyPeerId").onclick = () => {
    const idField = document.getElementById("myPeerIdDisplay");
    idField.select();
    document.execCommand("copy");
    showToast("ID copiado!", "success");
  };
  document.getElementById("btnConnectPeer").onclick = connectToPeer;
  document.getElementById("btnForceSync").onclick = () => {
    sendData({ type: "full_sync", data: state.transactions });
    showToast("Sincronização forçada enviada");
  };

  document.getElementById("btnTheme").onclick = () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    saveTheme();
  };

  document.getElementById("btnToggleFilters").onclick = () => {
    document.getElementById("filterContainer").classList.toggle("open");
  };

  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document
        .querySelectorAll(".view-section")
        .forEach((sec) => sec.classList.remove("active"));
      const target = tab.getAttribute("data-tab");
      if (target === "dashboard")
        document.getElementById("viewDashboard").classList.add("active");
      else document.getElementById("viewManagement").classList.add("active");
    };
  });

  const cardTabs = document.querySelectorAll(".card-tab-btn");
  cardTabs.forEach((tab) => {
    tab.onclick = () => {
      cardTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document
        .querySelectorAll(".tab-content-inner")
        .forEach((c) => (c.style.display = "none"));
      const targetId = tab.getAttribute("data-target");
      document.getElementById(targetId).style.display = "block";
    };
  });

  document.getElementById("btnAddTransaction").onclick = () => openModal();
  document.getElementById("btnCloseModalX").onclick = closeModal;
  document.getElementById("btnCancelTransaction").onclick = closeModal;
  document.getElementById("btnSaveTransaction").onclick = saveTransaction;
  document.getElementById("typeExpense").onclick = () => setType("expense");
  document.getElementById("typeIncome").onclick = () => setType("income");

  document.getElementById("btnConfirmDelete").onclick = () => {
    deleteLocalTransaction(deleteId);
    showToast("Item excluído");
    document.getElementById("confirmModal").classList.remove("active");
  };
  document.getElementById("btnCancelDelete").onclick = () =>
    document.getElementById("confirmModal").classList.remove("active");

  document.getElementById("btnClearDataMenu").onclick = () =>
    document.getElementById("clearDataModal").classList.add("active");
  document.getElementById("btnConfirmClear").onclick = () => {
    state.transactions = [];
    saveData();
    render();
    if (conn && conn.open) sendData({ type: "full_sync", data: [] });
    showToast("Tudo limpo");
    document.getElementById("clearDataModal").classList.remove("active");
  };
  document.getElementById("btnCancelClear").onclick = () =>
    document.getElementById("clearDataModal").classList.remove("active");

  document.getElementById("btnCloseImportOptions").onclick = () => {
    document.getElementById("importOptionsModal").classList.remove("active");
    pendingImportData = null;
    tempImportAsPartner = false;
  };

  document.getElementById("btnImportAsMe").onclick = () =>
    selectImportPerson(false);
  document.getElementById("btnImportAsPartner").onclick = () =>
    selectImportPerson(true);

  document.getElementById("btnActionMerge").onclick = () =>
    executeImport("merge");
  document.getElementById("btnActionReplace").onclick = () =>
    executeImport("replace");

  ["filterMonth", "filterYear", "filterCategory", "filterPerson"].forEach(
    (id) => {
      document.getElementById(id).onchange = (e) => {
        const field = id.replace("filter", "").toLowerCase();
        state.filters[field] =
          field === "month" || field === "year"
            ? parseInt(e.target.value)
            : e.target.value;
        render();
      };
    }
  );

  if (state.userProfile.name) {
    render();
  }
}

document.getElementById("btnDeleteAccountMenu").onclick = () => {
  document.getElementById("deleteAccountModal").classList.add("active");
};

document.getElementById("btnCancelDeleteAccount").onclick = () => {
  document.getElementById("deleteAccountModal").classList.remove("active");
};

document.getElementById("btnConfirmDeleteAccount").onclick = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(THEME_KEY);
  if (peer) peer.destroy();
  location.reload();
};

window.addEventListener("DOMContentLoaded", init);
