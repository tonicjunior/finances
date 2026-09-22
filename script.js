const STORAGE_KEY = "financas-pro-data";
const THEME_KEY = "financas-pro-theme";
const PROFILE_KEY = "financas-pro-profile";
const GOALS_KEY = "financas-pro-goals";
const HAS_SYNCED_KEY = "financas-pro-has-synced";
const LOBBY_API_URL = "https://apijs-0ypv.onrender.com";
const GOAL_CATEGORY = "investimentos";

const DEFAULT_CATEGORIES = {
  alimentacao: { label: "Alimentação", icon: "bi-basket", color: "#6366f1" },
  aluguel: { label: "Moradia", icon: "bi-house-door", color: "#0ea5e9" },
  lazer: { label: "Lazer", icon: "bi-controller", color: "#10b981" },
  transporte: { label: "Transporte", icon: "bi-car-front", color: "#8b5cf6" },
  saude: { label: "Saúde", icon: "bi-heart-pulse", color: "#ec4899" },
  educacao: { label: "Educação", icon: "bi-book", color: "#14b8a6" },
  compras: { label: "Compras", icon: "bi-bag", color: "#3b82f6" },
  assinaturas: {
    label: "Assinaturas",
    icon: "bi-collection-play",
    color: "#a855f7",
  },
  investimentos: {
    label: "Investimentos",
    icon: "bi-graph-up-arrow",
    color: "#22c55e",
  },
  salario: { label: "Salário", icon: "bi-cash-coin", color: "#16a34a" },
  freelance: { label: "Freelance", icon: "bi-briefcase", color: "#0891b2" },
  viagem: { label: "Viagem", icon: "bi-airplane", color: "#f97316" },
  presentes: { label: "Presentes", icon: "bi-gift", color: "#f43f5e" },
  pets: { label: "Pets", icon: "bi-heart", color: "#d946ef" },
  utilidades: {
    label: "Utilidades",
    icon: "bi-lightning-charge",
    color: "#eab308",
  },
  impostos: { label: "Impostos", icon: "bi-receipt", color: "#64748b" },
  beleza: { label: "Beleza", icon: "bi-magic", color: "#e879f9" },
  tecnologia: { label: "Tecnologia", icon: "bi-laptop", color: "#0284c7" },
  outros: { label: "Outros", icon: "bi-grid", color: "#6b7280" },
};

const CUSTOM_CATEGORIES_KEY = "financas-pro-custom-categories";

const ICON_CHOICES = [
  "bi-basket",
  "bi-house-door",
  "bi-controller",
  "bi-car-front",
  "bi-heart-pulse",
  "bi-book",
  "bi-bag",
  "bi-grid",
  "bi-collection-play",
  "bi-graph-up-arrow",
  "bi-cash-coin",
  "bi-briefcase",
  "bi-airplane",
  "bi-gift",
  "bi-heart",
  "bi-lightning-charge",
  "bi-receipt",
  "bi-magic",
  "bi-laptop",
  "bi-piggy-bank",
  "bi-cup-hot",
  "bi-tools",
  "bi-star",
  "bi-tag",
  "bi-wallet2",
  "bi-cart",
  "bi-phone",
  "bi-wifi",
  "bi-fuel-pump",
  "bi-umbrella",
];

let customCategories = {};
let CATEGORIES = { ...DEFAULT_CATEGORIES };
let selectedCategoryIcon = ICON_CHOICES[0];

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

const ACHIEVEMENTS = [
  // Uso do sistema
  {
    id: "primeiro_passo",
    label: "Primeiro Passo",
    description: "Registre sua primeira transação.",
    icon: "bi-flag-fill",
    check: (ctx) => ctx.totalTransactions >= 1,
  },
  {
    id: "em_ritmo",
    label: "Em Ritmo",
    description: "Registre 10 transações no total.",
    icon: "bi-journal-check",
    check: (ctx) => ctx.totalTransactions >= 10,
    progress: (ctx) => `${Math.min(ctx.totalTransactions, 10)}/10`,
  },
  {
    id: "dedicado",
    label: "Dedicado",
    description: "Registre 50 transações no total.",
    icon: "bi-journal-bookmark-fill",
    check: (ctx) => ctx.totalTransactions >= 50,
    progress: (ctx) => `${Math.min(ctx.totalTransactions, 50)}/50`,
  },
  {
    id: "veterano",
    label: "Veterano",
    description: "Registre 100 transações no total.",
    icon: "bi-award-fill",
    check: (ctx) => ctx.totalTransactions >= 100,
    progress: (ctx) => `${Math.min(ctx.totalTransactions, 100)}/100`,
  },
  {
    id: "lenda_financas",
    label: "Lenda das Finanças",
    description: "Registre 250 transações no total.",
    icon: "bi-trophy-fill",
    check: (ctx) => ctx.totalTransactions >= 250,
    progress: (ctx) => `${Math.min(ctx.totalTransactions, 250)}/250`,
  },

  // Consistência ao longo do tempo
  {
    id: "um_trimestre",
    label: "Um Trimestre de Dados",
    description: "Registre transações em 3 meses diferentes.",
    icon: "bi-calendar3",
    check: (ctx) => ctx.distinctMonthsActive >= 3,
    progress: (ctx) => `${Math.min(ctx.distinctMonthsActive, 3)}/3`,
  },
  {
    id: "meio_ano_dados",
    label: "Meio Ano de Consistência",
    description: "Registre transações em 6 meses diferentes.",
    icon: "bi-calendar2-range",
    check: (ctx) => ctx.distinctMonthsActive >= 6,
    progress: (ctx) => `${Math.min(ctx.distinctMonthsActive, 6)}/6`,
  },
  {
    id: "ano_completo",
    label: "Um Ano Completo",
    description: "Registre transações em 12 meses diferentes.",
    icon: "bi-calendar-heart-fill",
    check: (ctx) => ctx.distinctMonthsActive >= 12,
    progress: (ctx) => `${Math.min(ctx.distinctMonthsActive, 12)}/12`,
  },

  // Estabilidade financeira (saldo positivo)
  {
    id: "tres_meses_azul",
    label: "Três Meses no Azul",
    description: "Feche 3 meses seguidos com saldo positivo.",
    icon: "bi-graph-up-arrow",
    check: (ctx) => ctx.positiveStreak >= 3,
    progress: (ctx) => `${Math.min(ctx.positiveStreak, 3)}/3`,
  },
  {
    id: "meio_ano_azul",
    label: "Meio Ano no Azul",
    description: "Feche 6 meses seguidos com saldo positivo.",
    icon: "bi-bar-chart-line-fill",
    check: (ctx) => ctx.positiveStreak >= 6,
    progress: (ctx) => `${Math.min(ctx.positiveStreak, 6)}/6`,
  },
  {
    id: "ano_no_azul",
    label: "Um Ano no Azul",
    description: "Feche 12 meses seguidos com saldo positivo.",
    icon: "bi-rocket-takeoff-fill",
    check: (ctx) => ctx.positiveStreak >= 12,
    progress: (ctx) => `${Math.min(ctx.positiveStreak, 12)}/12`,
  },

  // Taxa de poupança
  {
    id: "poupador_iniciante",
    label: "Poupador Iniciante",
    description: "Alcance 10% de taxa de poupança em algum mês.",
    icon: "bi-piggy-bank",
    check: (ctx) => ctx.bestSavingsRate >= 10,
  },
  {
    id: "poupador",
    label: "Poupador",
    description: "Alcance 20% de taxa de poupança em algum mês.",
    icon: "bi-piggy-bank-fill",
    check: (ctx) => ctx.bestSavingsRate >= 20,
  },
  {
    id: "super_poupador",
    label: "Super Poupador",
    description: "Alcance 40% de taxa de poupança em algum mês.",
    icon: "bi-gem",
    check: (ctx) => ctx.bestSavingsRate >= 40,
  },
  {
    id: "poupador_lendario",
    label: "Poupador Lendário",
    description: "Alcance 60% de taxa de poupança em algum mês.",
    icon: "bi-stars",
    check: (ctx) => ctx.bestSavingsRate >= 60,
  },

  // Entendimento sobre os gastos (categorias)
  {
    id: "explorador_categorias",
    label: "Explorador de Categorias",
    description: "Registre gastos em 5 categorias diferentes.",
    icon: "bi-compass-fill",
    check: (ctx) => ctx.distinctCategoriesUsed >= 5,
    progress: (ctx) => `${Math.min(ctx.distinctCategoriesUsed, 5)}/5`,
  },
  {
    id: "curador_financeiro",
    label: "Curador Financeiro",
    description: "Registre gastos em 8 categorias diferentes.",
    icon: "bi-collection-fill",
    check: (ctx) => ctx.distinctCategoriesUsed >= 8,
    progress: (ctx) => `${Math.min(ctx.distinctCategoriesUsed, 8)}/8`,
  },
  {
    id: "mapeador_completo",
    label: "Mapeador Completo",
    description: "Registre gastos em 12 categorias diferentes.",
    icon: "bi-map-fill",
    check: (ctx) => ctx.distinctCategoriesUsed >= 12,
    progress: (ctx) => `${Math.min(ctx.distinctCategoriesUsed, 12)}/12`,
  },
  {
    id: "categorizador",
    label: "Categorizador",
    description: "Crie sua primeira categoria personalizada.",
    icon: "bi-tags-fill",
    check: (ctx) => ctx.customCategoryCount >= 1,
  },
  {
    id: "curador_categorias",
    label: "Curador de Categorias",
    description: "Crie 3 categorias personalizadas.",
    icon: "bi-bookmark-star-fill",
    check: (ctx) => ctx.customCategoryCount >= 3,
    progress: (ctx) => `${Math.min(ctx.customCategoryCount, 3)}/3`,
  },

  // Organização (transações fixas)
  {
    id: "organizado",
    label: "Organizado",
    description: "Cadastre 3 transações fixas (recorrentes).",
    icon: "bi-calendar-check-fill",
    check: (ctx) => ctx.recurringCount >= 3,
    progress: (ctx) => `${Math.min(ctx.recurringCount, 3)}/3`,
  },
  {
    id: "muito_organizado",
    label: "Muito Organizado",
    description: "Cadastre 6 transações fixas (recorrentes).",
    icon: "bi-calendar2-week-fill",
    check: (ctx) => ctx.recurringCount >= 6,
    progress: (ctx) => `${Math.min(ctx.recurringCount, 6)}/6`,
  },
  {
    id: "mestre_organizacao",
    label: "Mestre da Organização",
    description: "Cadastre 10 transações fixas (recorrentes).",
    icon: "bi-calendar-range-fill",
    check: (ctx) => ctx.recurringCount >= 10,
    progress: (ctx) => `${Math.min(ctx.recurringCount, 10)}/10`,
  },

  // Uso a dois
  {
    id: "equilibrio_a_dois",
    label: "Equilíbrio a Dois",
    description: "Registre transações para você e para o(a) parceiro(a).",
    icon: "bi-people-fill",
    check: (ctx) => ctx.hasEuTransactions && ctx.hasParceiroTransactions,
  },
  {
    id: "sincronizado",
    label: "Sincronizado",
    description: "Conecte-se com seu parceiro(a) via sincronização em par.",
    icon: "bi-link-45deg",
    check: (ctx) => ctx.hasSynced,
  },

  // Metas
  {
    id: "sonhador",
    label: "Sonhador",
    description: "Crie sua primeira meta financeira.",
    icon: "bi-stars",
    check: (ctx) => ctx.totalGoals >= 1,
  },
  {
    id: "planejador",
    label: "Planejador",
    description: "Crie 3 metas financeiras.",
    icon: "bi-diagram-3-fill",
    check: (ctx) => ctx.totalGoals >= 3,
    progress: (ctx) => `${Math.min(ctx.totalGoals, 3)}/3`,
  },
  {
    id: "meta_alcancada",
    label: "Meta Alcançada",
    description: "Complete uma meta financeira.",
    icon: "bi-trophy-fill",
    check: (ctx) => ctx.completedGoals >= 1,
  },
  {
    id: "conquistador_metas",
    label: "Conquistador de Metas",
    description: "Complete 3 metas financeiras.",
    icon: "bi-trophy",
    check: (ctx) => ctx.completedGoals >= 3,
    progress: (ctx) => `${Math.min(ctx.completedGoals, 3)}/3`,
  },
  {
    id: "compromisso_financeiro",
    label: "Compromisso Financeiro",
    description: "Configure uma contribuição mensal para uma meta.",
    icon: "bi-calendar-check",
    check: (ctx) => ctx.hasMonthlyContributionSet,
  },
  {
    id: "disciplina_mensal",
    label: "Disciplina Mensal",
    description: "Registre 2 contribuições mensais para uma meta.",
    icon: "bi-repeat",
    check: (ctx) => ctx.hasTwoMonthlyContributions,
  },
  {
    id: "guardando_futuro",
    label: "Guardando para o Futuro",
    description: "Acumule R$ 500 guardados em suas metas.",
    icon: "bi-wallet2",
    check: (ctx) => ctx.goalsSavedTotal >= 500,
  },
  {
    id: "investidor_sonhos",
    label: "Investidor de Sonhos",
    description: "Acumule R$ 2.000 guardados em suas metas.",
    icon: "bi-safe2-fill",
    check: (ctx) => ctx.goalsSavedTotal >= 2000,
  },

  // Patrimônio acumulado (saldo líquido de todo o período)
  {
    id: "primeira_reserva",
    label: "Primeira Reserva",
    description: "Alcance R$ 1.000 de saldo líquido acumulado.",
    icon: "bi-cash-coin",
    check: (ctx) => ctx.totalNetBalance >= 1000,
  },
  {
    id: "reserva_solida",
    label: "Reserva Sólida",
    description: "Alcance R$ 5.000 de saldo líquido acumulado.",
    icon: "bi-bank2",
    check: (ctx) => ctx.totalNetBalance >= 5000,
  },
  {
    id: "patrimonio_construcao",
    label: "Patrimônio em Construção",
    description: "Alcance R$ 10.000 de saldo líquido acumulado.",
    icon: "bi-building-fill",
    check: (ctx) => ctx.totalNetBalance >= 10000,
  },
];

let state = {
  transactions: [],
  goals: [],
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
let pendingImportCategories = null;
let pendingImportGoals = null;
let tempImportAsPartner = false;
let editingGoalId = null;
let selectedGoalIcon = ICON_CHOICES[0];
let goalDetailId = null;
let goalValueType = "deposit";
let confirmDeleteAction = null;
let pendingConnections = {};
let incomingRequestPeerId = null;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function rebuildCategories() {
  CATEGORIES = { ...DEFAULT_CATEGORIES, ...customCategories };
}

function loadCustomCategories() {
  const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
  if (stored) {
    try {
      customCategories = JSON.parse(stored);
    } catch (e) {
      customCategories = {};
    }
  }
  rebuildCategories();
}

function saveCustomCategories(broadcast = true) {
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
  rebuildCategories();
  if (broadcast && conn && conn.open) {
    sendData({ type: "categories_sync", data: customCategories });
  }
}

function slugifyCategoryName(name) {
  return name
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function renderIconGrid() {
  const grid = document.getElementById("iconGrid");
  if (!grid) return;
  grid.innerHTML = ICON_CHOICES.map(
    (icon) =>
      `<button type="button" class="icon-choice ${
        icon === selectedCategoryIcon ? "active" : ""
      }" data-icon="${icon}"><i class="bi ${icon}"></i></button>`
  ).join("");
  grid.querySelectorAll(".icon-choice").forEach((btn) => {
    btn.onclick = () => {
      selectedCategoryIcon = btn.getAttribute("data-icon");
      grid
        .querySelectorAll(".icon-choice")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
  });
}

function renderCategoryManageList() {
  const container = document.getElementById("categoryManageList");
  if (!container) return;
  const entries = Object.entries(CATEGORIES);
  container.innerHTML = entries
    .map(([key, cat]) => {
      const isCustom = !DEFAULT_CATEGORIES[key];
      return `
      <div class="category-manage-item">
        <div class="category-manage-info">
          <span class="category-dot" style="background:${
            cat.color || "#6b7280"
          }"></span>
          <i class="bi ${cat.icon}"></i>
          <span>${cat.label}</span>
        </div>
        ${
          isCustom
            ? `<button class="btn-icon-sm delete" onclick="deleteCustomCategory('${key}')" title="Remover"><i class="bi bi-trash"></i></button>`
            : `<span class="badge-default">Padrão</span>`
        }
      </div>`;
    })
    .join("");
}

function openCategoryModal() {
  selectedCategoryIcon = ICON_CHOICES[0];
  document.getElementById("newCategoryName").value = "";
  document.getElementById("newCategoryColor").value = "#6366f1";
  renderIconGrid();
  renderCategoryManageList();
  document.getElementById("categoryModal").classList.add("active");
}

function addCustomCategory() {
  const nameInput = document.getElementById("newCategoryName");
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add("error");
    showToast("Digite um nome para a categoria", "error");
    return;
  }
  nameInput.classList.remove("error");

  let key = slugifyCategoryName(name);
  if (!key) {
    showToast("Nome inválido", "error");
    return;
  }
  if (CATEGORIES[key]) {
    key = key + "_" + Date.now().toString(36).slice(-4);
  }

  const icon = selectedCategoryIcon || "bi-tag";
  const color =
    document.getElementById("newCategoryColor").value || "#6366f1";

  customCategories[key] = { label: name, icon, color };
  saveCustomCategories();
  setupFilters();
  renderCategoryManageList();

  nameInput.value = "";
  showToast("Categoria criada!", "success");
}

function deleteCustomCategory(key) {
  if (!customCategories[key]) return;
  delete customCategories[key];
  saveCustomCategories();
  setupFilters();
  renderCategoryManageList();
  render();
  showToast("Categoria removida");
}

// ── METAS (GOALS) ──
function loadGoals() {
  const stored = localStorage.getItem(GOALS_KEY);
  if (stored) {
    try {
      state.goals = JSON.parse(stored);
    } catch (e) {
      state.goals = [];
    }
  } else {
    state.goals = [];
  }
}

function saveGoals(broadcast = true) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(state.goals));
  if (broadcast && conn && conn.open) {
    sendData({ type: "goals_sync", data: state.goals });
  }
}

function mergeGoals(incomingList) {
  let changed = false;
  incomingList.forEach((g) => {
    const exists = state.goals.find((local) => local.id === g.id);
    if (!exists) {
      state.goals.push(g);
      changed = true;
    } else if (JSON.stringify(exists) !== JSON.stringify(g)) {
      Object.assign(exists, g);
      changed = true;
    }
  });

  if (changed) {
    saveGoals(false);
    renderGoals();
    if (goalDetailId) renderGoalDetail();
    renderAchievements();
    showToast("Metas sincronizadas", "success");
  }
}

function getGoalSaved(goal) {
  if (Array.isArray(goal.history)) {
    return goal.history.reduce(
      (sum, h) => sum + (h.type === "withdraw" ? -h.amount : h.amount),
      0
    );
  }
  return goal.saved || 0;
}

function hasContributedThisMonth(goal) {
  const now = new Date();
  return (goal.history || []).some((h) => {
    if (!h.isMonthly) return false;
    const d = new Date(h.date + "T00:00:00");
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  });
}

function renderGoals() {
  const container = document.getElementById("goalsSection");
  if (!container) return;

  const cards = state.goals
    .map((g) => {
      const saved = getGoalSaved(g);
      const pct =
        g.target > 0 ? Math.min(Math.round((saved / g.target) * 100), 100) : 0;
      const completed = g.target > 0 && saved >= g.target;
      const circumference = 2 * Math.PI * 30;
      const dash = (pct / 100) * circumference;
      const color = completed ? cssVar("--success") : g.color || "#6366f1";
      const iconHtml = g.icon
        ? `<i class="bi ${g.icon}"></i>`
        : `<span class="goal-emoji-text">${g.emoji || "🎯"}</span>`;

      return `
        <div class="goal-card ${completed ? "completed" : ""}" onclick="openGoalDetail('${g.id}')">
          <div class="goal-ring">
            <svg viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="30" fill="none" stroke="var(--border)" stroke-width="4" />
              <circle cx="34" cy="34" r="30" fill="none" stroke="${color}"
                stroke-width="4" stroke-linecap="round"
                stroke-dasharray="${dash} ${circumference}"
                transform="rotate(-90 34 34)" />
            </svg>
            <span class="goal-emoji" style="color:${color}">${iconHtml}</span>
          </div>
          <span class="goal-pct">${pct}%</span>
          <h4>${g.name}</h4>
          <div class="goal-progress-track">
            <div class="goal-progress-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <div class="goal-amounts">
            <div class="goal-amount-row saved">
              <span>Guardado</span>
              <strong>${formatCurrency(saved)}</strong>
            </div>
            <div class="goal-amount-row">
              <span>Meta</span>
              <strong>${formatCurrency(g.target)}</strong>
            </div>
          </div>
          ${
            completed
              ? '<div class="goal-completed-badge"><i class="bi bi-check-circle-fill"></i> Concluída!</div>'
              : ""
          }
        </div>`;
    })
    .join("");

  container.innerHTML =
    cards +
    `<button type="button" class="goal-add-card" onclick="openGoalEditModal()">
      <i class="bi bi-plus-circle"></i>
      <span>Nova Meta</span>
    </button>`;

  renderGoalsSummary();
}

function renderGoalsSummary() {
  const countEl = document.getElementById("goalsActiveCount");
  if (!countEl) return;

  let savedTotal = 0;
  let remainingTotal = 0;
  let completed = 0;

  state.goals.forEach((g) => {
    const saved = Math.max(getGoalSaved(g), 0);
    savedTotal += saved;
    if (g.target > 0 && saved >= g.target) {
      completed++;
    } else if (g.target > 0) {
      remainingTotal += g.target - saved;
    }
  });

  countEl.textContent = state.goals.length - completed;
  document.getElementById("goalsSavedTotal").textContent =
    formatCurrency(savedTotal);
  document.getElementById("goalsRemainingTotal").textContent =
    formatCurrency(remainingTotal);
  document.getElementById("goalsCompletedCount").textContent = completed;
}

// ── Edição de metas (dados base: nome, ícone, cor, alvo) ──
function renderGoalIconGrid() {
  const grid = document.getElementById("goalIconGrid");
  if (!grid) return;
  grid.innerHTML = ICON_CHOICES.map(
    (icon) =>
      `<button type="button" class="icon-choice ${
        icon === selectedGoalIcon ? "active" : ""
      }" data-icon="${icon}"><i class="bi ${icon}"></i></button>`
  ).join("");
  grid.querySelectorAll(".icon-choice").forEach((btn) => {
    btn.onclick = () => {
      selectedGoalIcon = btn.getAttribute("data-icon");
      grid
        .querySelectorAll(".icon-choice")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    };
  });
}

function openGoalEditModal(id = null) {
  editingGoalId = id;
  const goal = id ? state.goals.find((g) => g.id === id) : null;

  document.getElementById("goalEditModalTitle").textContent = goal
    ? "Editar Meta"
    : "Nova Meta";
  document.getElementById("goalName").value = goal?.name || "";
  document.getElementById("goalName").classList.remove("error");
  document.getElementById("goalTarget").value = goal?.target || "";
  document.getElementById("goalMonthly").value = goal?.monthlyContribution || "";
  document.getElementById("goalColor").value = goal?.color || "#6366f1";
  document.getElementById("goalPerson").value = goal?.person || "eu";

  selectedGoalIcon = goal?.icon || ICON_CHOICES[0];
  renderGoalIconGrid();

  document.getElementById("goalInitialValueRow").style.display = goal
    ? "none"
    : "block";
  document.getElementById("goalInitialValue").value = "";

  document.getElementById("btnDeleteGoal").style.display = goal
    ? "inline-flex"
    : "none";

  document.getElementById("goalDetailModal").classList.remove("active");
  document.getElementById("goalEditModal").classList.add("active");
}

function closeGoalEditModal() {
  document.getElementById("goalEditModal").classList.remove("active");
  editingGoalId = null;
}

function saveGoalEdit() {
  const nameEl = document.getElementById("goalName");
  const name = nameEl.value.trim();
  const target = parseFloat(document.getElementById("goalTarget").value) || 0;
  const monthlyContribution =
    parseFloat(document.getElementById("goalMonthly").value) || 0;
  const color = document.getElementById("goalColor").value || "#6366f1";
  const person = document.getElementById("goalPerson").value || "eu";
  const icon = selectedGoalIcon;

  if (!name) {
    nameEl.classList.add("error");
    showToast("Dê um nome para a meta", "error");
    return;
  }
  nameEl.classList.remove("error");

  if (editingGoalId) {
    const goal = state.goals.find((g) => g.id === editingGoalId);
    goal.name = name;
    goal.icon = icon;
    goal.color = color;
    goal.target = target;
    goal.monthlyContribution = monthlyContribution;
    goal.person = person;
  } else {
    const goal = {
      id: generateId(),
      name,
      icon,
      color,
      target,
      monthlyContribution,
      person,
      history: [],
    };
    state.goals.push(goal);

    const initialValue =
      parseFloat(document.getElementById("goalInitialValue").value) || 0;
    if (initialValue > 0) {
      addGoalEntry(goal, {
        amount: initialValue,
        type: "deposit",
        note: "Valor inicial",
        isMonthly: false,
      });
    }
  }

  saveGoals();
  render();
  closeGoalEditModal();
  showToast("Meta salva!", "success");
}

function confirmDeleteGoalFromEdit() {
  if (!editingGoalId) return;
  const idToDelete = editingGoalId;
  confirmDeleteAction = () => deleteGoalById(idToDelete);
  document.getElementById("goalEditModal").classList.remove("active");
  document.getElementById("confirmModal").classList.add("active");
}

function deleteGoalById(id) {
  state.goals = state.goals.filter((g) => g.id !== id);
  saveGoals();
  renderGoals();
  renderAchievements();
  if (goalDetailId === id) closeGoalDetailModal();
  showToast("Meta removida");
}

// ── Detalhe da meta: progresso, contribuições e histórico ──
function openGoalDetail(id) {
  goalDetailId = id;
  renderGoalDetail();
  document.getElementById("goalValueAmount").value = "";
  document.getElementById("goalValueAmount").classList.remove("error");
  document.getElementById("goalValueNote").value = "";
  setGoalValueType("deposit");
  document.getElementById("goalDetailModal").classList.add("active");
}

function closeGoalDetailModal() {
  document.getElementById("goalDetailModal").classList.remove("active");
  goalDetailId = null;
}

function setGoalValueType(type) {
  goalValueType = type;
  const container = document.getElementById("goalValueTypeToggle");
  document
    .getElementById("goalTypeDeposit")
    .classList.toggle("active", type === "deposit");
  document
    .getElementById("goalTypeWithdraw")
    .classList.toggle("active", type === "withdraw");
  container.classList.toggle("income-active", type === "withdraw");
}

function renderGoalDetail() {
  const goal = state.goals.find((g) => g.id === goalDetailId);
  if (!goal) return;

  const saved = getGoalSaved(goal);
  const pct =
    goal.target > 0 ? Math.min(Math.round((saved / goal.target) * 100), 100) : 0;
  const completed = goal.target > 0 && saved >= goal.target;
  const color = completed ? cssVar("--success") : goal.color || "#6366f1";
  const circumference = 2 * Math.PI * 42;
  const dash = (pct / 100) * circumference;

  const iconEl = document.getElementById("goalDetailIcon");
  iconEl.innerHTML = goal.icon
    ? `<i class="bi ${goal.icon}"></i>`
    : goal.emoji || "🎯";
  iconEl.style.background = color;

  document.getElementById("goalDetailName").textContent = goal.name;
  document.getElementById("goalDetailPct").textContent = `${pct}%`;
  document.getElementById("goalDetailSaved").textContent = formatCurrency(saved);
  document.getElementById("goalDetailTarget").textContent = formatCurrency(
    goal.target
  );

  const ringFill = document.getElementById("goalDetailRingFill");
  ringFill.setAttribute("stroke", color);
  ringFill.setAttribute("stroke-dasharray", `${dash} ${circumference}`);

  document.getElementById("goalDetailPersonHint").textContent = `lançado em ${
    PERSONS[goal.person] || PERSONS.eu
  }`;

  const monthlyRow = document.getElementById("goalMonthlyRow");
  if (goal.monthlyContribution > 0) {
    monthlyRow.style.display = "flex";
    document.getElementById("goalMonthlyAmount").textContent = formatCurrency(
      goal.monthlyContribution
    );
    const alreadyContributed = hasContributedThisMonth(goal);
    const btn = document.getElementById("btnContributeMonthly");
    btn.disabled = alreadyContributed;
    btn.innerHTML = alreadyContributed
      ? '<i class="bi bi-check-circle"></i> Já contribuído este mês'
      : "Contribuir agora";
  } else {
    monthlyRow.style.display = "none";
  }

  renderGoalHistory(goal);
}

function renderGoalHistory(goal) {
  const list = document.getElementById("goalHistoryList");
  const entries = [...(goal.history || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (entries.length === 0) {
    list.innerHTML =
      '<div class="goal-history-empty">Nenhuma movimentação ainda.</div>';
    return;
  }

  list.innerHTML = entries
    .map((h) => {
      const noteText =
        h.note ||
        (h.isMonthly
          ? "Contribuição mensal"
          : h.type === "withdraw"
          ? "Retirada"
          : "Depósito");
      return `
        <div class="goal-history-item">
          <div class="goal-history-info">
            <span class="goal-history-date">${formatDate(h.date)}</span>
            <span class="goal-history-note">${noteText}</span>
          </div>
          <span class="goal-history-amount ${h.type}">${
        h.type === "withdraw" ? "-" : "+"
      } ${formatCurrency(h.amount)}</span>
          <button class="btn-icon-sm delete" onclick="deleteGoalHistoryEntry('${
            goal.id
          }','${h.id}')" title="Remover"><i class="bi bi-x"></i></button>
        </div>`;
    })
    .join("");
}

// Cada movimentação da meta gera a transação correspondente:
// depósito vira despesa (o dinheiro saiu do mês) e retirada vira receita.
function addGoalEntry(goal, { amount, type, note, isMonthly }) {
  const entry = {
    id: generateId(),
    transactionId: generateId(),
    date: formatDateForInput(new Date()),
    amount,
    type,
    note,
    isMonthly,
  };

  if (!Array.isArray(goal.history)) goal.history = [];
  goal.history.push(entry);

  const isWithdraw = type === "withdraw";
  const transaction = {
    id: entry.transactionId,
    description: isWithdraw
      ? `Resgate: ${goal.name}`
      : `Meta: ${goal.name}${note ? ` - ${note}` : ""}`,
    amount,
    date: entry.date,
    category: GOAL_CATEGORY,
    person: goal.person || "eu",
    type: isWithdraw ? "income" : "expense",
    isRecurring: false,
    goalId: goal.id,
  };
  state.transactions.push(transaction);
  saveData(false);

  if (conn && conn.open) {
    sendData({ type: "transaction_update", data: transaction });
  }

  return entry;
}

function addGoalValue() {
  const goal = state.goals.find((g) => g.id === goalDetailId);
  if (!goal) return;

  const amountEl = document.getElementById("goalValueAmount");
  const amount = parseFloat(amountEl.value);
  if (!amount || amount <= 0) {
    amountEl.classList.add("error");
    showToast("Informe um valor válido", "error");
    return;
  }
  amountEl.classList.remove("error");

  const wasCompletedBefore = goal.target > 0 && getGoalSaved(goal) >= goal.target;

  addGoalEntry(goal, {
    amount,
    type: goalValueType,
    note: document.getElementById("goalValueNote").value.trim(),
    isMonthly: false,
  });

  saveGoals();
  render();
  renderGoalDetail();

  amountEl.value = "";
  document.getElementById("goalValueNote").value = "";

  const nowCompleted = goal.target > 0 && getGoalSaved(goal) >= goal.target;
  if (nowCompleted && !wasCompletedBefore && goalValueType === "deposit") {
    showToast(`Meta "${goal.name}" alcançada! Parabéns!`, "success");
  } else {
    showToast(
      goalValueType === "withdraw"
        ? "Retirada registrada como receita"
        : "Depósito registrado como despesa",
      "success"
    );
  }
}

function contributeMonthly() {
  const goal = state.goals.find((g) => g.id === goalDetailId);
  if (!goal || !goal.monthlyContribution) return;
  if (hasContributedThisMonth(goal)) {
    showToast("Você já contribuiu este mês", "warning");
    return;
  }

  const wasCompletedBefore = goal.target > 0 && getGoalSaved(goal) >= goal.target;

  addGoalEntry(goal, {
    amount: goal.monthlyContribution,
    type: "deposit",
    note: "Contribuição mensal",
    isMonthly: true,
  });

  saveGoals();
  render();
  renderGoalDetail();

  const nowCompleted = goal.target > 0 && getGoalSaved(goal) >= goal.target;
  if (nowCompleted && !wasCompletedBefore) {
    showToast(`Meta "${goal.name}" alcançada! Parabéns!`, "success");
  } else {
    showToast("Contribuição mensal registrada!", "success");
  }
}

function deleteGoalHistoryEntry(goalId, entryId) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;

  const entry = (goal.history || []).find((h) => h.id === entryId);
  goal.history = (goal.history || []).filter((h) => h.id !== entryId);

  if (entry?.transactionId) {
    state.transactions = state.transactions.filter(
      (t) => t.id !== entry.transactionId
    );
    saveData(false);
    if (conn && conn.open) {
      sendData({ type: "transaction_delete", data: { id: entry.transactionId } });
    }
  }

  saveGoals();
  render();
  renderGoalDetail();
}

// ── CONQUISTAS (ACHIEVEMENTS) ──
const ACHIEVEMENTS_PREVIEW_COUNT = 6;
let achievementsExpanded = false;

function computeAchievementContext() {
  const totalTransactions = state.transactions.length;
  const recurringCount = state.transactions.filter((t) => t.isRecurring).length;
  const customCategoryCount = Object.keys(customCategories).length;
  const hasEuTransactions = state.transactions.some((t) => t.person === "eu");
  const hasParceiroTransactions = state.transactions.some(
    (t) => t.person === "parceiro"
  );
  const totalGoals = state.goals.length;
  const completedGoals = state.goals.filter(
    (g) => g.target > 0 && getGoalSaved(g) >= g.target
  ).length;
  const hasSynced = localStorage.getItem(HAS_SYNCED_KEY) === "1";
  const hasMonthlyContributionSet = state.goals.some(
    (g) => g.monthlyContribution > 0
  );
  const hasTwoMonthlyContributions = state.goals.some(
    (g) => (g.history || []).filter((h) => h.isMonthly).length >= 2
  );
  const goalsSavedTotal = state.goals.reduce(
    (sum, g) => sum + Math.max(getGoalSaved(g), 0),
    0
  );

  const monthKeys = new Set(state.transactions.map((t) => t.date.slice(0, 7)));
  const distinctMonthsActive = monthKeys.size;
  const distinctCategoriesUsed = new Set(
    state.transactions.map((t) => t.category)
  ).size;

  let bestSavingsRate = 0;
  monthKeys.forEach((key) => {
    const [y, m] = key.split("-").map(Number);
    const list = state.transactions.filter((t) => {
      const d = new Date(t.date + "T00:00:00");
      return d.getFullYear() === y && d.getMonth() === m - 1;
    });
    const inc = list
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = list
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const rate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
    if (rate > bestSavingsRate) bestSavingsRate = rate;
  });

  const totalIncomeAllTime = state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenseAllTime = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const totalNetBalance = totalIncomeAllTime - totalExpenseAllTime;

  const now = new Date();
  let streak = 0;
  let maxStreak = 0;
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const list = state.transactions.filter((t) => {
      const td = new Date(t.date + "T00:00:00");
      return (
        td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth()
      );
    });
    if (list.length === 0) {
      streak = 0;
      continue;
    }
    const inc = list
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = list
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    if (inc - exp >= 0) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  }

  return {
    totalTransactions,
    recurringCount,
    customCategoryCount,
    hasEuTransactions,
    hasParceiroTransactions,
    totalGoals,
    completedGoals,
    hasSynced,
    hasMonthlyContributionSet,
    hasTwoMonthlyContributions,
    goalsSavedTotal,
    distinctMonthsActive,
    distinctCategoriesUsed,
    bestSavingsRate,
    positiveStreak: maxStreak,
    totalNetBalance,
  };
}

function renderAchievements() {
  const container = document.getElementById("achievementsList");
  const toggleBtn = document.getElementById("btnToggleAchievements");
  if (!container) return;

  const ctx = computeAchievementContext();
  const withStatus = ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(ctx) }));
  const sorted = [...withStatus].sort(
    (a, b) => Number(b.unlocked) - Number(a.unlocked)
  );
  const visible = achievementsExpanded
    ? sorted
    : sorted.slice(0, ACHIEVEMENTS_PREVIEW_COUNT);

  container.innerHTML = visible
    .map((a) => {
      const progressText = !a.unlocked && a.progress ? a.progress(ctx) : null;
      return `
      <div class="achievement-card ${a.unlocked ? "unlocked" : "locked"}">
        <div class="achievement-icon">
          <i class="bi ${a.unlocked ? a.icon : "bi-lock-fill"}"></i>
        </div>
        <div class="achievement-info">
          <h4>${a.label}</h4>
          <p>${a.description}</p>
          ${
            progressText
              ? `<span class="achievement-progress">${progressText}</span>`
              : ""
          }
        </div>
        ${
          a.unlocked
            ? '<i class="bi bi-check-circle-fill achievement-check"></i>'
            : ""
        }
      </div>`;
    })
    .join("");

  const unlockedCount = withStatus.filter((a) => a.unlocked).length;
  const summaryEl = document.getElementById("achievementsSummary");
  if (summaryEl) {
    summaryEl.textContent = `${unlockedCount} de ${ACHIEVEMENTS.length} conquistas desbloqueadas`;
  }

  if (toggleBtn) {
    if (ACHIEVEMENTS.length > ACHIEVEMENTS_PREVIEW_COUNT) {
      toggleBtn.style.display = "inline-flex";
      toggleBtn.innerHTML = achievementsExpanded
        ? '<i class="bi bi-chevron-up"></i> Ver menos'
        : `<i class="bi bi-chevron-down"></i> Ver todas (${ACHIEVEMENTS.length})`;
    } else {
      toggleBtn.style.display = "none";
    }
  }
}

function toggleAchievementsExpanded() {
  achievementsExpanded = !achievementsExpanded;
  renderAchievements();
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
    document.getElementById("btnFindPartners").disabled = false;
  });

  peer.on("connection", (connection) => {
    const partnerName = connection.metadata?.name || "Alguém";
    pendingConnections[connection.peer] = connection;
    setupConnectionListeners(connection);
    showConnectionRequest(
      connection.peer,
      `${partnerName} quer sincronizar as finanças com você.`
    );
  });

  peer.on("disconnected", () => {
    updateConnectionStatus("offline");
    document.getElementById("peerStatusMsg").textContent =
      "Desconectado do servidor";
    document.getElementById("btnFindPartners").disabled = true;
  });

  peer.on("error", (err) => {
    console.error(err);
    showToast("Erro de conexão: " + err.type, "error");
  });
}

function connectToPeer(remoteIdArg = null) {
  const input = document.getElementById("remotePeerIdInput");
  const remoteId = remoteIdArg || input.value.trim();
  if (!remoteId) return showToast("Insira o ID do parceiro", "error");
  if (!peer) return showToast("Conexão ainda não iniciada", "error");

  if (remoteId === myPeerId) {
    return showToast("Você não pode conectar com você mesmo", "warning");
  }
  if (pendingConnections[remoteId] || (conn && conn.peer === remoteId)) {
    return showToast("Convite já enviado para esse parceiro", "warning");
  }

  const connection = peer.connect(remoteId, {
    reliable: true,
    metadata: { name: state.userProfile.name || "Parceiro" },
  });

  pendingConnections[remoteId] = connection;
  setupConnectionListeners(connection);
  showToast("Convite enviado. Aguardando resposta...", "success");
  if (!remoteIdArg) input.value = "";
}

function setupConnectionListeners(connection) {
  connection.on("data", (payload) => {
    handleReceivedData(payload, connection);
  });

  connection.on("close", () => {
    delete pendingConnections[connection.peer];
    if (conn && conn.peer === connection.peer) {
      conn = null;
      document.getElementById("connectedPeerSection").style.display = "none";
      updateConnectionStatus("online");
      showToast("Parceiro desconectado", "warning");
    }
  });

  connection.on("error", (err) => {
    console.error("Erro na conexão:", err);
  });
}

function sendWhenOpen(connection, payload) {
  if (connection.open) {
    connection.send(payload);
  } else {
    connection.on("open", () => connection.send(payload));
  }
}

function markConnected(connection) {
  conn = connection;
  delete pendingConnections[connection.peer];

  document.getElementById("connectedPeerSection").style.display = "flex";
  updateConnectionStatus("connected");
  document.getElementById("syncModal").classList.remove("active");
  showToast("Parceiro conectado!", "success");

  localStorage.setItem(HAS_SYNCED_KEY, "1");
  renderAchievements();
  removeFromLobby();

  sendWhenOpen(connection, {
    type: "profile_sync",
    data: state.userProfile,
  });
  sendWhenOpen(connection, {
    type: "categories_sync",
    data: customCategories,
  });
  sendWhenOpen(connection, { type: "goals_sync", data: state.goals });
  sendWhenOpen(connection, { type: "full_sync", data: state.transactions });
}

function showConnectionRequest(peerId, message) {
  incomingRequestPeerId = peerId;
  document.getElementById("connectionRequestText").textContent = message;
  document.getElementById("connectionRequestModal").classList.add("active");
}

function hideConnectionRequest() {
  document.getElementById("connectionRequestModal").classList.remove("active");
  incomingRequestPeerId = null;
}

function acceptConnectionRequest() {
  const connection = pendingConnections[incomingRequestPeerId];
  hideConnectionRequest();
  if (!connection) return;

  sendWhenOpen(connection, {
    type: "connection_accepted",
    data: { name: state.userProfile.name || "Parceiro" },
  });
  markConnected(connection);
}

function rejectConnectionRequest() {
  const connection = pendingConnections[incomingRequestPeerId];
  const peerId = incomingRequestPeerId;
  hideConnectionRequest();
  if (!connection) return;

  sendWhenOpen(connection, { type: "connection_rejected" });
  setTimeout(() => connection.close(), 250);
  delete pendingConnections[peerId];
}

function sendData(payload) {
  if (conn && conn.open) {
    conn.send(payload);
  }
}

// ── LOBBY (descoberta de parceiros via API) ──
async function registerInLobby() {
  if (!myPeerId || !state.userProfile.name) return;
  try {
    await fetch(
      `${LOBBY_API_URL}/cadastro?nickname=${encodeURIComponent(
        state.userProfile.name
      )}&id=${encodeURIComponent(myPeerId)}`
    );
  } catch (error) {
    console.error("Erro ao registrar no lobby:", error);
  }
}

async function fetchLobbyUsers() {
  if (!myPeerId) return [];
  try {
    const response = await fetch(`${LOBBY_API_URL}/buscar`);
    if (!response.ok) return [];
    const users = await response.json();
    if (!Array.isArray(users)) return [];
    return users.filter((user) => user.id && user.id !== myPeerId);
  } catch (error) {
    console.error("Erro ao buscar parceiros:", error);
    return [];
  }
}

async function removeFromLobby() {
  if (!myPeerId) return;
  try {
    await fetch(`${LOBBY_API_URL}/delete?id=${encodeURIComponent(myPeerId)}`);
  } catch (error) {
    console.error("Erro ao sair do lobby:", error);
  }
}

async function showUserListModal() {
  document.getElementById("userListModal").classList.add("active");
  document.getElementById("userList").innerHTML = "";
  document.getElementById("userListLoading").style.display = "flex";

  await registerInLobby();
  await updateLobbyList();

  document.getElementById("userListLoading").style.display = "none";
}

function hideUserListModal() {
  document.getElementById("userListModal").classList.remove("active");
  removeFromLobby();
}

async function updateLobbyList() {
  const users = await fetchLobbyUsers();
  const listEl = document.getElementById("userList");

  if (users.length === 0) {
    listEl.innerHTML = `<div class="user-list-empty">
      <i class="bi bi-people" style="font-size:1.75rem;display:block;margin-bottom:0.5rem;"></i>
      Ninguém online agora. Atualize a lista ou compartilhe seu ID direto com o parceiro.
    </div>`;
    return;
  }

  listEl.innerHTML = users
    .map((user) => {
      const name = user.nickname || "Parceiro";
      const initial = name.trim().charAt(0) || "?";
      return `
      <div class="user-list-item">
        <div class="user-list-info">
          <span class="user-list-avatar">${initial}</span>
          <span class="user-list-name">${name}</span>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="connectFromLobby('${user.id}')">
          Conectar
        </button>
      </div>`;
    })
    .join("");
}

function connectFromLobby(peerId) {
  connectToPeer(peerId);
  hideUserListModal();
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

function handleReceivedData(payload, connection = null) {
  switch (payload.type) {
    case "connection_accepted":
      if (connection) {
        showToast(
          `${payload.data?.name || "Parceiro"} aceitou seu convite!`,
          "success"
        );
        markConnected(connection);
      }
      break;

    case "connection_rejected":
      showToast("Seu convite foi recusado", "warning");
      if (connection) {
        delete pendingConnections[connection.peer];
        setTimeout(() => connection.close(), 250);
      }
      break;

    case "profile_sync":
      break;

    case "categories_sync":
      Object.assign(customCategories, payload.data);
      saveCustomCategories(false);
      setupFilters();
      renderCategoryManageList();
      render();
      break;

    case "goals_sync":
      mergeGoals(payload.data);
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
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    transactions: state.transactions,
    categories: customCategories,
    goals: state.goals,
  };
  const dataStr = JSON.stringify(payload, null, 2);
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
      let transactions = null;
      let categories = {};
      let goals = [];

      if (Array.isArray(data)) {
        transactions = data;
      } else if (data && Array.isArray(data.transactions)) {
        transactions = data.transactions;
        categories = data.categories || {};
        goals = Array.isArray(data.goals) ? data.goals : [];
      }

      if (transactions) {
        pendingImportData = transactions;
        pendingImportCategories = categories;
        pendingImportGoals = goals;
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

  if (pendingImportCategories && Object.keys(pendingImportCategories).length) {
    let addedCategories = 0;
    Object.entries(pendingImportCategories).forEach(([key, cat]) => {
      if (!customCategories[key] && !DEFAULT_CATEGORIES[key]) {
        customCategories[key] = cat;
        addedCategories++;
      }
    });
    if (addedCategories > 0) {
      saveCustomCategories(false);
      setupFilters();
    }
  }

  if (pendingImportGoals && pendingImportGoals.length) {
    const existingGoalIds = new Set(state.goals.map((g) => g.id));
    const newGoals = pendingImportGoals.filter((g) => !existingGoalIds.has(g.id));
    if (newGoals.length > 0) {
      state.goals = [...state.goals, ...newGoals];
      saveGoals(false);
    }
  }

  saveData();
  render();

  if (conn && conn.open) {
    sendData({ type: "full_sync", data: state.transactions });
    sendData({ type: "categories_sync", data: customCategories });
    sendData({ type: "goals_sync", data: state.goals });
  }

  document.getElementById("importOptionsModal").classList.remove("active");
  pendingImportData = null;
  pendingImportCategories = null;
  pendingImportGoals = null;
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

// Cobre a troca de tema: os gráficos em canvas precisam ser redesenhados com
// as novas cores, e o loader evita a transição "suja" entre as paletas.
function toggleThemeWithLoader() {
  const loader = document.getElementById("themeLoader");
  const nextTheme = state.theme === "dark" ? "light" : "dark";
  document.getElementById("themeLoaderText").textContent =
    nextTheme === "dark" ? "Ativando modo escuro..." : "Ativando modo claro...";

  loader.classList.add("active");

  setTimeout(() => {
    state.theme = nextTheme;
    applyTheme();
    saveTheme();
    if (state.userProfile.name) render();

    setTimeout(() => loader.classList.remove("active"), 260);
  }, 260);
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
    rate: income > 0 ? ((income - expense) / income) * 100 : 0,
  };
}

function render() {
  const filtered = getFilteredTransactions();
  const summary = calculateSummary(filtered);

  const balEl = document.getElementById("totalBalance");
  balEl.textContent = formatCurrency(summary.balance);
  balEl.className = `summary-value ${
    summary.balance >= 0 ? "income" : "expense"
  }`;
  document.getElementById("averageExpense").textContent = formatCurrency(
    summary.average
  );

  const rateEl = document.getElementById("savingsRate");
  rateEl.textContent = `${summary.rate.toFixed(0)}%`;
  rateEl.style.color =
    summary.rate >= 20
      ? "var(--success)"
      : summary.rate > 0
      ? "var(--warning)"
      : "var(--danger)";

  renderTransactions(filtered);
  renderCharts(filtered, summary);
  renderInsights(filtered, summary);
  renderHealthBars(summary);
  renderTimeline();
  renderGoals();
  renderAchievements();
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
              <span class="cat-dot" style="background:${
                catData.color || "#6b7280"
              }"></span>
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

  // Lógica de Previsão CORRIGIDA:
  // Filtra recorrentes, mas remove duplicatas (histórico) mantendo apenas o registro mais recente de cada despesa/receita.
  const uniqueRecurringMap = new Map();

  // Ordena por data (mais recente primeiro) para garantir o valor atualizado
  const sortedTransactions = [...state.transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedTransactions.forEach((t) => {
    if (t.isRecurring) {
      // Chave única: Pessoa + Tipo + Descrição (normalizada)
      // Isso evita somar "Salário" de Nov e "Salário" de Dez juntos
      const key = `${t.person}-${t.type}-${t.description.trim().toLowerCase()}`;

      if (!uniqueRecurringMap.has(key)) {
        uniqueRecurringMap.set(key, t);
      }
    }
  });

  const uniqueRecurringList = Array.from(uniqueRecurringMap.values());

  const calcRecurring = (personKey) => {
    const pList = uniqueRecurringList.filter(
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
        const color =
          (!isSimpleMap && mapping[key]?.color) || palette[i % palette.length];
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

        const color =
          (!isSimpleMap && mapping[key]?.color) || palette[i % palette.length];
        return `<div class="legend-item"><span class="legend-color" style="background:${color}"></span>${label} (${Math.round(
          (val / total) * 100
        )}%)</div>`;
      })
      .join("");
  }
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ── INSIGHTS ──
function renderInsights(list, summary) {
  const el = document.getElementById("insightsList");
  if (!el) return;

  const insights = [];

  const weekend = list
    .filter(
      (t) =>
        t.type === "expense" &&
        [0, 6].includes(new Date(t.date + "T00:00:00").getDay())
    )
    .reduce((s, t) => s + t.amount, 0);
  const weekday = list
    .filter(
      (t) =>
        t.type === "expense" &&
        ![0, 6].includes(new Date(t.date + "T00:00:00").getDay())
    )
    .reduce((s, t) => s + t.amount, 0);
  if (weekend > 0 && weekday > 0) {
    const ratio = weekend / ((weekday / 5) * 2);
    if (ratio > 1.3) {
      insights.push({
        icon: "warning",
        text: `Você gasta <strong>${Math.round(
          (ratio - 1) * 100
        )}% mais</strong> nos fins de semana em comparação aos dias úteis.`,
      });
    }
  }

  const cats = {};
  list
    .filter((t) => t.type === "expense")
    .forEach((t) => (cats[t.category] = (cats[t.category] || 0) + t.amount));
  const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
  if (topCat && summary.expense > 0) {
    const catLabel = CATEGORIES[topCat[0]]?.label || topCat[0];
    insights.push({
      icon: "info",
      text: `Sua maior categoria de gasto é <strong>${catLabel}</strong>, com ${formatCurrency(
        topCat[1]
      )} (${Math.round((topCat[1] / summary.expense) * 100)}% do total).`,
    });
  }

  if (summary.rate >= 20) {
    insights.push({
      icon: "good",
      text: `Excelente! Você está poupando <strong>${summary.rate.toFixed(
        0
      )}%</strong> da sua renda neste período.`,
    });
  } else if (summary.rate < 5 && summary.income > 0) {
    insights.push({
      icon: "warning",
      text: `Atenção: apenas <strong>${summary.rate.toFixed(
        0
      )}%</strong> da renda está sendo poupada. Tente chegar a 20%.`,
    });
  }

  const recurringCount = state.transactions.filter((t) => t.isRecurring).length;
  if (recurringCount > 0) {
    insights.push({
      icon: "info",
      text: `Você tem <strong>${recurringCount} transações fixas</strong> cadastradas, repetidas todo mês.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: "info",
      text: "Adicione mais transações para receber insights personalizados.",
    });
  }

  const iconMap = {
    warning: "exclamation-triangle-fill",
    good: "check-circle-fill",
    info: "info-circle-fill",
  };

  el.innerHTML = insights
    .slice(0, 4)
    .map(
      (i) => `
      <div class="insight-item">
        <div class="insight-icon ${i.icon}"><i class="bi bi-${
        iconMap[i.icon]
      }"></i></div>
        <div class="insight-text">${i.text}</div>
      </div>`
    )
    .join("");
}

// ── SAÚDE FINANCEIRA ──
function renderHealthBars(summary) {
  const el = document.getElementById("healthBars");
  if (!el) return;

  const expRatio =
    summary.income > 0
      ? (summary.expense / summary.income) * 100
      : summary.expense > 0
      ? 100
      : 0;
  const balScore = Math.min(
    Math.max((summary.balance / (summary.income || 1)) * 50 + 50, 0),
    100
  );

  const items = [
    {
      label: "Taxa de Poupança",
      pct: Math.min(Math.max(summary.rate, 0), 100),
      color:
        summary.rate > 30
          ? "var(--success)"
          : summary.rate > 10
          ? "var(--warning)"
          : "var(--danger)",
      val: `${summary.rate.toFixed(0)}%`,
    },
    {
      label: "Despesa/Receita",
      pct: Math.min(expRatio, 100),
      color:
        expRatio < 70
          ? "var(--success)"
          : expRatio < 90
          ? "var(--warning)"
          : "var(--danger)",
      val: `${Math.round(expRatio)}%`,
    },
    {
      label: "Saldo",
      pct: balScore,
      color: summary.balance >= 0 ? "var(--success)" : "var(--danger)",
      val: formatCurrency(summary.balance),
    },
  ];

  el.innerHTML = items
    .map(
      (it) => `
      <div class="hb-row">
        <div class="hb-label">${it.label}</div>
        <div class="hb-track"><div class="hb-fill" style="width:${it.pct}%;background:${it.color}"></div></div>
        <div class="hb-val">${it.val}</div>
      </div>`
    )
    .join("");
}

// ── TIMELINE FINANCEIRA ──
let timelineMonths = 6;

function renderTimeline() {
  const canvas = document.getElementById("timelineChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const now = new Date();
  const pts = [];
  for (let i = timelineMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth(),
      y = d.getFullYear();
    const mList = state.transactions.filter((t) => {
      const td = new Date(t.date + "T00:00:00");
      return td.getMonth() === m && td.getFullYear() === y;
    });
    const inc = mList
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = mList
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    pts.push({ label: MONTHS[m].slice(0, 3), inc, exp });
  }

  canvas.style.minWidth = `${Math.max(timelineMonths * 60, 300)}px`;
  const W = canvas.offsetWidth || 500;
  canvas.width = W;
  const H = canvas.height || 160;
  ctx.clearRect(0, 0, W, H);

  const pad = { l: 45, r: 20, t: 15, b: 30 };
  const cW = W - pad.l - pad.r,
    cH = H - pad.t - pad.b;
  const maxVal = Math.max(...pts.map((p) => Math.max(p.inc, p.exp)), 1);
  const xStep = cW / (pts.length - 1 || 1);
  const toX = (i) => pad.l + i * xStep;
  const toY = (v) => pad.t + cH - (v / maxVal) * cH;

  ctx.strokeStyle = cssVar("--border");
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (cH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(W - pad.r, y);
    ctx.stroke();
  }

  function drawLine(data, colorHex) {
    ctx.beginPath();
    data.forEach((v, i) =>
      i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v))
    );
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
    data.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(toX(i), toY(v), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = colorHex;
      ctx.fill();
    });
  }

  drawLine(
    pts.map((p) => p.inc),
    cssVar("--success")
  );
  drawLine(
    pts.map((p) => p.exp),
    cssVar("--danger")
  );

  ctx.fillStyle = cssVar("--text-secondary");
  ctx.font = "11px Inter";
  ctx.textAlign = "center";
  pts.forEach((p, i) => ctx.fillText(p.label, toX(i), H - 8));

  ctx.textAlign = "right";
  ctx.fillText(
    formatCurrency(maxVal).replace("R$ ", "").replace("R$ ", ""),
    pad.l - 8,
    pad.t + 4
  );
  ctx.fillText("0", pad.l - 8, pad.t + cH);
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
  const categoryKey = transaction?.category || "outros";
  document.getElementById("txCategory").value = categoryKey;
  selectCategoryTx(categoryKey);
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

function confirmDelete(id) {
  confirmDeleteAction = () => {
    deleteLocalTransaction(id);
    showToast("Item excluído");
  };
  document.getElementById("confirmModal").classList.add("active");
}

function deleteLocalTransaction(id, broadcast = true) {
  const transaction = state.transactions.find((t) => t.id === id);
  state.transactions = state.transactions.filter((t) => t.id !== id);

  // Mantém a meta em sincronia quando a transação vinculada é apagada.
  if (transaction?.goalId) {
    const goal = state.goals.find((g) => g.id === transaction.goalId);
    if (goal && Array.isArray(goal.history)) {
      goal.history = goal.history.filter((h) => h.transactionId !== id);
      saveGoals(broadcast);
    }
  }

  saveData(false);
  render();
  if (goalDetailId) renderGoalDetail();
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

function renderCategoryPickerTx() {
  const panel = document.getElementById("categoryPickerPanel");
  if (!panel) return;
  panel.innerHTML = Object.entries(CATEGORIES)
    .map(
      ([key, cat]) => `
      <button type="button" class="category-picker-item" data-key="${key}">
        <span class="category-picker-dot" style="background:${
          cat.color || "#6b7280"
        }"></span>
        <i class="bi ${cat.icon}"></i>
        <span>${cat.label}</span>
      </button>`
    )
    .join("");
  panel.querySelectorAll(".category-picker-item").forEach((btn) => {
    btn.onclick = () => {
      selectCategoryTx(btn.getAttribute("data-key"));
      document.getElementById("categoryPickerTx").classList.remove("open");
    };
  });
}

function selectCategoryTx(key) {
  const select = document.getElementById("txCategory");
  select.value = key;
  const cat = CATEGORIES[key];
  document.getElementById("categoryPickerDot").style.background =
    cat?.color || "#6b7280";
  document.getElementById(
    "categoryPickerIcon"
  ).className = `bi ${cat?.icon || "bi-tag"}`;
  document.getElementById("categoryPickerLabel").textContent =
    cat?.label || key;
  document
    .querySelectorAll("#categoryPickerPanel .category-picker-item")
    .forEach((btn) =>
      btn.classList.toggle("active", btn.getAttribute("data-key") === key)
    );
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

  renderCategoryPickerTx();

  const perSel = document.getElementById("txPerson");
  const filterPer = document.getElementById("filterPerson");
  const goalPer = document.getElementById("goalPerson");
  perSel.innerHTML = "";
  filterPer.innerHTML = "";
  goalPer.innerHTML = "";

  Object.entries(PERSONS).forEach(([k, v]) => {
    perSel.innerHTML += `<option value="${k}">${v}</option>`;
    filterPer.innerHTML += `<option value="${k}">${v}</option>`;
    goalPer.innerHTML += `<option value="${k}">${v}</option>`;
  });
  filterPer.insertAdjacentHTML(
    "afterbegin",
    '<option value="all">Todas Pessoas</option>'
  );

  filterCat.value = state.filters.category;
  filterPer.value = state.filters.person;
}

function init() {
  loadTheme();
  loadCustomCategories();
  loadData();
  loadGoals();
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
  document.getElementById("btnConnectPeer").onclick = () => connectToPeer();
  document.getElementById("btnForceSync").onclick = () => {
    sendData({ type: "full_sync", data: state.transactions });
    showToast("Sincronização forçada enviada");
  };

  document.getElementById("btnFindPartners").onclick = showUserListModal;
  document.getElementById("btnCloseUserList").onclick = hideUserListModal;
  document.getElementById("btnRefreshUserList").onclick = async () => {
    const icon = document.getElementById("refreshUserListIcon");
    const loading = document.getElementById("userListLoading");
    icon.classList.add("loading");
    loading.style.display = "flex";
    document.getElementById("userList").innerHTML = "";

    await registerInLobby();
    await updateLobbyList();

    loading.style.display = "none";
    icon.classList.remove("loading");
  };

  document.getElementById("btnAcceptConnection").onclick =
    acceptConnectionRequest;
  document.getElementById("btnRejectConnection").onclick =
    rejectConnectionRequest;

  document.getElementById("btnTheme").onclick = toggleThemeWithLoader;

  document.getElementById("btnToggleFilters").onclick = () => {
    document.getElementById("filterContainer").classList.toggle("open");
  };

  const tabViewMap = {
    dashboard: "viewDashboard",
    goals: "viewGoals",
    management: "viewManagement",
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
      document.getElementById(tabViewMap[target]).classList.add("active");
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
  document.getElementById("btnFabAdd").onclick = () => openModal();
  document.getElementById("btnCloseModalX").onclick = closeModal;
  document.getElementById("btnCancelTransaction").onclick = closeModal;
  document.getElementById("btnSaveTransaction").onclick = saveTransaction;
  document.getElementById("typeExpense").onclick = () => setType("expense");
  document.getElementById("typeIncome").onclick = () => setType("income");

  document.getElementById("btnCloseGoalEditModal").onclick = closeGoalEditModal;
  document.getElementById("btnCancelGoalEdit").onclick = closeGoalEditModal;
  document.getElementById("btnSaveGoalEdit").onclick = saveGoalEdit;
  document.getElementById("btnDeleteGoal").onclick = confirmDeleteGoalFromEdit;

  document.getElementById("btnCloseGoalDetail").onclick = closeGoalDetailModal;
  document.getElementById("btnEditGoal").onclick = () =>
    openGoalEditModal(goalDetailId);
  document.getElementById("btnContributeMonthly").onclick = contributeMonthly;
  document.getElementById("btnAddGoalValue").onclick = addGoalValue;
  document.getElementById("goalTypeDeposit").onclick = () =>
    setGoalValueType("deposit");
  document.getElementById("goalTypeWithdraw").onclick = () =>
    setGoalValueType("withdraw");

  document.getElementById("btnToggleAchievements").onclick =
    toggleAchievementsExpanded;

  document.getElementById("btnConfirmDelete").onclick = () => {
    if (confirmDeleteAction) confirmDeleteAction();
    confirmDeleteAction = null;
    document.getElementById("confirmModal").classList.remove("active");
  };
  document.getElementById("btnCancelDelete").onclick = () => {
    confirmDeleteAction = null;
    document.getElementById("confirmModal").classList.remove("active");
  };

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
    pendingImportCategories = null;
    pendingImportGoals = null;
    tempImportAsPartner = false;
  };

  document.getElementById("btnCategoriesMenu").onclick = openCategoryModal;
  document.getElementById("btnCloseCategoryModal").onclick = () =>
    document.getElementById("categoryModal").classList.remove("active");
  document.getElementById("btnAddCategory").onclick = addCustomCategory;

  document.getElementById("categoryPickerTrigger").onclick = (e) => {
    e.stopPropagation();
    document.getElementById("categoryPickerTx").classList.toggle("open");
  };
  document.addEventListener("click", (e) => {
    const picker = document.getElementById("categoryPickerTx");
    if (picker && !picker.contains(e.target)) picker.classList.remove("open");
  });

  window.addEventListener("resize", () => {
    renderTimeline();
  });

  document.getElementById("timelinePeriodSelect").onchange = (e) => {
    timelineMonths = parseInt(e.target.value);
    renderTimeline();
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
  localStorage.removeItem(CUSTOM_CATEGORIES_KEY);
  localStorage.removeItem(GOALS_KEY);
  localStorage.removeItem(HAS_SYNCED_KEY);
  if (peer) peer.destroy();
  location.reload();
};

window.addEventListener("DOMContentLoaded", init);
