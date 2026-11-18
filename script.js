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

// Integrantes da família. As chaves são estáveis (os lançamentos guardam a
// chave, não o nome). "eu" é sempre o dono do dispositivo e "parceiro" é a
// chave histórica do 2º integrante, mantida para compatibilidade com dados
// antigos e com a sincronização entre dispositivos.
const MAX_MEMBERS = 5;
const MEMBER_SLOTS = ["eu", "parceiro", "membro3", "membro4", "membro5"];
const SHARED_PERSON_KEY = "ambos";
const SHARED_PERSON_LABEL = "Compartilhado";

let PERSONS = {
  eu: "Eu",
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
const PALETTE_PERSONS = [
  "#f59e0b",
  "#ef4444",
  "#84cc16",
  "#d946ef",
  "#f97316",
  "#0ea5e9",
];
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

  // Uso em família
  {
    id: "equilibrio_a_dois",
    label: "Gestão em Família",
    description: "Registre transações para você e para outro integrante.",
    icon: "bi-people-fill",
    check: (ctx) => ctx.hasEuTransactions && ctx.hasOtherMemberTransactions,
  },
  {
    id: "sincronizado",
    label: "Sincronizado",
    description: "Sincronize os dados com outro integrante da família.",
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
    members: [],
  },
};

let peer = null;
let conn = null;
let myPeerId = null;
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

// Dados vindos de outros dispositivos, de backups ou do lobby são renderizados
// via innerHTML; escapar evita injeção de HTML/scripts que poderiam ler os
// dados já descriptografados em memória.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Para valores usados dentro de onclick="fn('...')": entidades HTML são
// decodificadas antes do JS ser interpretado, então só caracteres seguros.
function safeJsArg(value) {
  return String(value ?? "").replace(/[^\w-]/g, "");
}

// ── INTEGRANTES ──
function getMembers() {
  const members = state.userProfile.members;
  return Array.isArray(members) && members.length
    ? members
    : [{ key: "eu", name: state.userProfile.name || "Eu" }];
}

function normalizeProfile(raw) {
  const profile = raw && typeof raw === "object" ? raw : {};
  const seen = new Set();
  let members = (Array.isArray(profile.members) ? profile.members : [])
    .filter(
      (m) =>
        m &&
        MEMBER_SLOTS.includes(m.key) &&
        typeof m.name === "string" &&
        !seen.has(m.key) &&
        seen.add(m.key)
    )
    .map((m) => ({ key: m.key, name: m.name.trim() || "Integrante" }));

  // Perfis antigos tinham apenas { name, partnerName }.
  if (!members.length) {
    members = [{ key: "eu", name: profile.name || "Eu" }];
    if (profile.partnerName) {
      members.push({ key: "parceiro", name: profile.partnerName });
    }
  }
  if (!members.some((m) => m.key === "eu")) {
    members.unshift({ key: "eu", name: profile.name || "Eu" });
  }
  members = members.slice(0, MAX_MEMBERS);

  return { name: members.find((m) => m.key === "eu").name, members };
}

// Todo lançamento pertence a UM integrante (não existe mais "Compartilhado"
// no cadastro). A visão "Geral"/"Todos os integrantes" mostra a soma, e a
// divisão de quem paga quanto fica a critério da família.
function rebuildPersons() {
  const map = {};
  getMembers().forEach((m) => (map[m.key] = m.name));
  PERSONS = map;
}

function getPersonLabel(key) {
  if (PERSONS[key]) return PERSONS[key];
  // Lançamentos antigos ainda podem estar como "Compartilhado".
  if (key === SHARED_PERSON_KEY) return `${SHARED_PERSON_LABEL} (antigo)`;
  if (key === "parceiro") return "Outro integrante";
  return "Integrante removido";
}

function getMemberColor(key) {
  const idx = MEMBER_SLOTS.indexOf(key);
  return PALETTE_PERSONS[(idx === -1 ? 5 : idx) % PALETTE_PERSONS.length];
}

function saveProfile() {
  secureStorage.setItem(PROFILE_KEY, JSON.stringify(state.userProfile));
}

function countPersonUsage(key) {
  return {
    transactions: state.transactions.filter((t) => t.person === key).length,
    goals: state.goals.filter((g) => g.person === key).length,
  };
}

function refreshAfterMembersChange() {
  saveProfile();
  updatePersonLabels();
  if (state.filters.person !== "all" && !PERSONS[state.filters.person]) {
    state.filters.person = "all";
  }
  setupFilters();
  renderMembersList();
  render();
}

function renderMembersList() {
  const list = document.getElementById("membersList");
  if (!list) return;
  const members = getMembers();

  list.innerHTML = members
    .map((m) => {
      const isOwner = m.key === "eu";
      const initial = escapeHtml(m.name.trim().charAt(0) || "?");
      return `
      <div class="member-item">
        <span class="member-avatar" style="background:${getMemberColor(
          m.key
        )}">${initial}</span>
        <input type="text" class="form-control form-control-sm" maxlength="30"
          aria-label="Nome do integrante" value="${escapeHtml(m.name)}"
          onchange="renameMember('${safeJsArg(m.key)}', this.value)" />
        ${
          isOwner
            ? '<span class="badge-default">Você</span>'
            : `<button class="btn-icon-sm delete" title="Remover integrante" onclick="removeMember('${safeJsArg(
                m.key
              )}')"><i class="bi bi-person-dash"></i></button>`
        }
      </div>`;
    })
    .join("");

  document.getElementById(
    "membersCount"
  ).textContent = `${members.length} de ${MAX_MEMBERS}`;
  const full = members.length >= MAX_MEMBERS;
  document.getElementById("btnAddMember").disabled = full;
  document.getElementById("newMemberName").disabled = full;
}

function addMember() {
  const input = document.getElementById("newMemberName");
  const name = input.value.trim();
  const members = getMembers();

  if (members.length >= MAX_MEMBERS) {
    showToast(`Limite de ${MAX_MEMBERS} integrantes atingido`, "warning");
    return;
  }
  if (!name) {
    input.classList.add("error");
    showToast("Digite o nome do integrante", "error");
    return;
  }
  input.classList.remove("error");

  const usedKeys = new Set(members.map((m) => m.key));
  const key = MEMBER_SLOTS.find((k) => !usedKeys.has(k));
  state.userProfile.members = [...members, { key, name }];
  input.value = "";
  refreshAfterMembersChange();
  showToast("Integrante adicionado!", "success");
}

function renameMember(key, value) {
  const name = String(value || "").trim();
  const member = getMembers().find((m) => m.key === key);
  if (!member) return;
  if (!name) {
    showToast("O nome não pode ficar vazio", "error");
    renderMembersList();
    return;
  }
  state.userProfile.members = getMembers().map((m) =>
    m.key === key ? { ...m, name } : m
  );
  if (key === "eu") state.userProfile.name = name;
  refreshAfterMembersChange();
  showToast("Nome atualizado", "success");
}

function removeMember(key) {
  if (key === "eu") return;
  const member = getMembers().find((m) => m.key === key);
  if (!member) return;

  const usage = countPersonUsage(key);
  if (usage.transactions > 0 || usage.goals > 0) {
    const parts = [];
    if (usage.transactions) parts.push(`${usage.transactions} lançamento(s)`);
    if (usage.goals) parts.push(`${usage.goals} meta(s)`);
    showToast(
      `${member.name} possui ${parts.join(
        " e "
      )}. Exclua ou reatribua antes de remover.`,
      "error"
    );
    return;
  }

  confirmDeleteAction = () => {
    state.userProfile.members = getMembers().filter((m) => m.key !== key);
    refreshAfterMembersChange();
    showToast("Integrante removido");
  };
  document.getElementById("confirmModal").classList.add("active");
}

function rebuildCategories() {
  CATEGORIES = { ...DEFAULT_CATEGORIES, ...customCategories };
}

function loadCustomCategories() {
  const stored = secureStorage.getItem(CUSTOM_CATEGORIES_KEY);
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
  secureStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
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
  const countEl = document.getElementById("categoriesCount");
  if (countEl) countEl.textContent = `${entries.length} categorias`;
  container.innerHTML = entries
    .map(([key, cat]) => {
      const isCustom = !DEFAULT_CATEGORIES[key];
      return `
      <div class="category-manage-item">
        <div class="category-manage-info">
          <span class="category-dot" style="background:${escapeHtml(
            cat.color || "#6b7280"
          )}"></span>
          <i class="bi ${escapeHtml(cat.icon)}"></i>
          <span>${escapeHtml(cat.label)}</span>
        </div>
        ${
          isCustom
            ? `<button class="btn-icon-sm delete" onclick="deleteCustomCategory('${safeJsArg(
                key
              )}')" title="Remover"><i class="bi bi-trash"></i></button>`
            : `<span class="badge-default">Padrão</span>`
        }
      </div>`;
    })
    .join("");
}

// Seções recolhíveis da Gerência. Integrantes e Categorias começam
// fechadas; Transações aberta. A escolha fica salva só neste navegador.
const COLLAPSE_KEY = "financas-pro-collapsed";

function readCollapsePrefs() {
  try {
    return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || "{}") || {};
  } catch (e) {
    return {}; // preferência inválida: usa o padrão de cada seção
  }
}

function setSectionCollapsed(section, collapsed) {
  section.classList.toggle("is-collapsed", collapsed);
  const btn = section.querySelector(".collapse-toggle");
  if (btn) btn.setAttribute("aria-expanded", String(!collapsed));
}

function setupCollapsibleSections() {
  const prefs = readCollapsePrefs();
  document.querySelectorAll("[data-collapsible]").forEach((section) => {
    const id = section.dataset.collapsible;
    const collapsed =
      id in prefs ? !!prefs[id] : section.dataset.default === "collapsed";
    setSectionCollapsed(section, collapsed);
    section.querySelector(".collapse-toggle").onclick = () => {
      const next = !section.classList.contains("is-collapsed");
      setSectionCollapsed(section, next);
      const p = readCollapsePrefs();
      p[id] = next;
      try {
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(p));
      } catch (e) {
        /* armazenamento indisponível: a seção só não lembra o estado */
      }
    };
  });
}

// Seção "Categorias" fica na aba Gerência (antes era um modal no menu).
function renderCategoriesSection() {
  renderIconGrid();
  renderCategoryManageList();
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
  saveCustomCategories(false);
  sendData({ type: "category_delete", data: { key } });
  setupFilters();
  renderCategoryManageList();
  render();
  showToast("Categoria removida");
}

// ── METAS (GOALS) ──
function loadGoals() {
  const stored = secureStorage.getItem(GOALS_KEY);
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
  secureStorage.setItem(GOALS_KEY, JSON.stringify(state.goals));
  if (broadcast && conn && conn.open) {
    sendData({ type: "goals_sync", data: state.goals });
  }
}

function mergeGoals(incomingList, { silent = false } = {}) {
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
    if (!silent) showToast("Metas sincronizadas", "success");
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
      const color = escapeHtml(
        completed ? cssVar("--success") : g.color || "#6366f1"
      );
      const iconHtml = g.icon
        ? `<i class="bi ${escapeHtml(g.icon)}"></i>`
        : `<span class="goal-emoji-text">${escapeHtml(g.emoji || "🎯")}</span>`;

      return `
        <div class="goal-card ${completed ? "completed" : ""}" onclick="openGoalDetail('${safeJsArg(g.id)}')">
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
          <h4>${escapeHtml(g.name)}</h4>
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
  document.getElementById("goalPerson").value =
    goal && PERSONS[goal.person] ? goal.person : "eu";

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
  saveGoals(false);
  sendData({ type: "goal_delete", data: { id } });
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
    ? `<i class="bi ${escapeHtml(goal.icon)}"></i>`
    : escapeHtml(goal.emoji || "🎯");
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

  document.getElementById("goalDetailPersonHint").textContent = `lançado em ${getPersonLabel(
    goal.person || "eu"
  )}`;

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
            <span class="goal-history-note">${escapeHtml(noteText)}</span>
          </div>
          <span class="goal-history-amount ${h.type}">${
        h.type === "withdraw" ? "-" : "+"
      } ${formatCurrency(h.amount)}</span>
          <button class="btn-icon-sm delete" onclick="deleteGoalHistoryEntry('${safeJsArg(
            goal.id
          )}','${safeJsArg(h.id)}')" title="Remover"><i class="bi bi-x"></i></button>
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
    person:
      goal.person && goal.person !== SHARED_PERSON_KEY ? goal.person : "eu",
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
  const hasOtherMemberTransactions = state.transactions.some(
    (t) => t.person !== "eu" && t.person !== SHARED_PERSON_KEY
  );
  const totalGoals = state.goals.length;
  const completedGoals = state.goals.filter(
    (g) => g.target > 0 && getGoalSaved(g) >= g.target
  ).length;
  const hasSynced = secureStorage.getItem(HAS_SYNCED_KEY) === "1";
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

  const buckets = getMonthBuckets();
  const distinctMonthsActive = buckets.size;
  const distinctCategoriesUsed = new Set(
    state.transactions.map((t) => t.category)
  ).size;

  let bestSavingsRate = 0;
  let totalIncomeAllTime = 0;
  let totalExpenseAllTime = 0;
  buckets.forEach(({ income: inc, expense: exp }) => {
    totalIncomeAllTime += inc;
    totalExpenseAllTime += exp;
    const rate = inc > 0 ? ((inc - exp) / inc) * 100 : 0;
    if (rate > bestSavingsRate) bestSavingsRate = rate;
  });
  const totalNetBalance = totalIncomeAllTime - totalExpenseAllTime;

  const now = new Date();
  let streak = 0;
  let maxStreak = 0;
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const { list, income: inc, expense: exp } = getMonthBucket(
      d.getFullYear(),
      d.getMonth()
    );
    if (list.length === 0) {
      streak = 0;
      continue;
    }
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
    hasOtherMemberTransactions,
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
  const stored = secureStorage.getItem(PROFILE_KEY);
  let profile = null;
  if (stored) {
    try {
      profile = JSON.parse(stored);
    } catch (e) {
      profile = null;
    }
  }

  if (profile) {
    const normalized = normalizeProfile(profile);
    const migrated = !Array.isArray(profile.members);
    state.userProfile = normalized;
    if (migrated) saveProfile();
    updatePersonLabels();
    document.getElementById("appContent").style.display = "block";
    // Usuários existentes também precisam aceitar a versão atual dos termos.
    if (!getTermsAcceptance()) openTermsModal("require");
  } else {
    renderOnboardingMemberFields();
    // Se o cofre já existe (ex.: migração sem perfil), o PIN já foi definido.
    document.getElementById("setupPinSection").style.display =
      secureStorage.isUnlocked() ? "none" : "block";
    document.getElementById("onboardingScreen").style.display = "flex";
    document.getElementById("appContent").style.display = "none";
  }
}

function renderOnboardingMemberFields() {
  const container = document.getElementById("setupMembersFields");
  if (!container) return;
  const count = parseInt(document.getElementById("setupMemberCount").value) || 1;

  const previous = {};
  container.querySelectorAll("input[data-index]").forEach((input) => {
    previous[input.dataset.index] = input.value;
  });

  let html = "";
  for (let i = 2; i <= count; i++) {
    html += `
      <div class="mb-3">
        <label class="form-label" for="setupMember${i}">Nome do ${i}º integrante</label>
        <input type="text" id="setupMember${i}" class="form-control" data-index="${i}"
          maxlength="30" placeholder="Ex: ${
            ["", "", "Maria", "Pedro", "Ana", "Lucas"][i]
          }" value="${escapeHtml(previous[i] || "")}" />
      </div>`;
  }
  container.innerHTML = html;
}

async function finishOnboarding() {
  const btn = document.getElementById("btnFinishOnboarding");
  const errorEl = document.getElementById("setupError");
  const pinEl = document.getElementById("setupPin");
  const pinConfirmEl = document.getElementById("setupPinConfirm");
  errorEl.textContent = "";
  const needsPin = !secureStorage.isUnlocked();

  const termsEl = document.getElementById("setupAcceptTerms");
  if (!termsEl.checked) {
    errorEl.textContent = "Para continuar, aceite os Termos de uso e a Política de privacidade.";
    termsEl.focus();
    return;
  }

  if (needsPin) {
    const pinError = validateNewPin(pinEl.value, pinConfirmEl.value);
    if (pinError) {
      errorEl.textContent = pinError;
      pinEl.classList.add("error");
      pinEl.focus();
      return;
    }
    pinEl.classList.remove("error");
  }

  const myName = document.getElementById("setupMyName").value.trim() || "Eu";
  const count = parseInt(document.getElementById("setupMemberCount").value) || 1;
  const members = [{ key: "eu", name: myName }];
  for (let i = 2; i <= Math.min(count, MAX_MEMBERS); i++) {
    const input = document.getElementById(`setupMember${i}`);
    members.push({
      key: MEMBER_SLOTS[i - 1],
      name: (input && input.value.trim()) || `Integrante ${i}`,
    });
  }

  if (needsPin) {
    btn.disabled = true;
    btn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Protegendo seus dados...';
    try {
      await secureStorage.create(pinEl.value);
    } catch (e) {
      console.error(e);
      errorEl.textContent =
        "Não foi possível criar a criptografia. Tente novamente.";
      btn.disabled = false;
      btn.textContent = "Começar";
      return;
    }
    pinEl.value = "";
    pinConfirmEl.value = "";
    resetPasswordVisibility(document.getElementById("onboardingScreen"));
  }

  saveTermsAcceptance();
  state.userProfile = normalizeProfile({ members });
  saveProfile();
  saveCustomCategories(false);
  saveGoals(false);

  updatePersonLabels();

  document.getElementById("onboardingScreen").style.display = "none";
  document.getElementById("appContent").style.display = "block";

  if (!secureStorage.getItem(STORAGE_KEY)) {
    state.transactions = getSampleTransactions();
    saveData();
  }

  setupFilters();
  renderMembersList();
  render();
}

function updatePersonLabels() {
  rebuildPersons();
  renderFlowTabs();

  if (conn && conn.open) {
    sendData({ type: "profile_sync", data: state.userProfile });
  }
}

// ── Abas do card "Fluxo Financeiro" (uma por integrante) ──
let activeFlowTab = "fluxo-barras";

function renderFlowTabs() {
  const tabs = document.getElementById("flowTabs");
  const panels = document.getElementById("flowPersonPanels");
  if (!tabs || !panels) return;

  const members = getMembers();
  const tabList = [
    { id: "fluxo-barras", label: "Geral" },
    ...members.map((m) => ({ id: `fluxo-${m.key}`, label: m.name })),
    { id: "fluxo-info", label: "Indicadores" },
  ];
  if (!tabList.some((t) => t.id === activeFlowTab)) {
    activeFlowTab = "fluxo-barras";
  }

  tabs.innerHTML = tabList
    .map(
      (t) =>
        `<button type="button" class="card-tab-btn" data-target="${t.id}">${escapeHtml(
          t.label
        )}</button>`
    )
    .join("");

  panels.innerHTML = members
    .map(
      (m) => `
      <div id="fluxo-${m.key}" class="tab-content-inner" style="display: none">
        <div class="person-detail-container" id="detail-${m.key}"></div>
      </div>`
    )
    .join("");

  showFlowTab(activeFlowTab);
}

function showFlowTab(id) {
  activeFlowTab = id;
  document
    .querySelectorAll("#flowTabs .card-tab-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.target === id));
  document
    .querySelectorAll(".tab-content-inner")
    .forEach((c) => (c.style.display = c.id === id ? "block" : "none"));
}

// ── TELA DE BLOQUEIO / PIN ──
let appInitialized = false;
let lockMode = "unlock"; // "unlock" | "migrate" | "unsupported"

function showLockScreen(mode) {
  lockMode = mode;
  const title = document.getElementById("lockTitle");
  const text = document.getElementById("lockText");
  const confirmRow = document.getElementById("lockPinConfirmRow");
  const warning = document.getElementById("lockWarning");
  const btn = document.getElementById("btnUnlock");
  const form = document.getElementById("lockForm");
  const forgot = document.getElementById("btnForgotPin");

  document.getElementById("lockError").textContent = "";
  document.getElementById("forgotPinPanel").style.display = "none";
  form.style.display = "block";
  const lockMeter = document
    .getElementById("lockPin")
    .closest(".pin-input-wrap")
    ?.nextElementSibling;
  if (lockMeter?.classList.contains("pin-strength")) {
    lockMeter.style.display = mode === "migrate" ? "" : "none";
  }

  if (mode === "migrate") {
    title.textContent = "Proteja seus dados";
    text.textContent =
      "Agora o Finanças Pro criptografa seus dados financeiros. Crie um PIN para continuar — seus dados atuais serão mantidos.";
    document.getElementById("lockPinLabel").textContent = "Crie um PIN";
    document.getElementById("lockPin").autocomplete = "new-password";
    confirmRow.style.display = "block";
    warning.style.display = "flex";
    btn.textContent = "Criptografar e continuar";
    forgot.style.display = "none";
  } else if (mode === "unsupported") {
    title.textContent = "Navegador não suportado";
    text.textContent =
      "A criptografia exige um navegador atualizado e o app aberto em um contexto seguro (HTTPS, localhost ou arquivo local).";
    form.style.display = "none";
    forgot.style.display = "none";
  } else {
    title.textContent = "Dados protegidos";
    text.textContent = "Digite seu PIN para desbloquear.";
    document.getElementById("lockPinLabel").textContent = "PIN";
    confirmRow.style.display = "none";
    warning.style.display = "none";
    btn.textContent = "Desbloquear";
    forgot.style.display = "inline-block";
  }

  document.getElementById("appContent").style.display = "none";
  document.getElementById("lockScreen").style.display = "flex";
  setTimeout(() => document.getElementById("lockPin").focus(), 50);
}

function hideLockScreen() {
  document.getElementById("lockScreen").style.display = "none";
  document.getElementById("lockPin").value = "";
  document.getElementById("lockPinConfirm").value = "";
  resetPasswordVisibility(document.getElementById("lockScreen"));
  refreshStrengthMeters();
}

async function submitLockForm(event) {
  event.preventDefault();
  const pinEl = document.getElementById("lockPin");
  const confirmEl = document.getElementById("lockPinConfirm");
  const errorEl = document.getElementById("lockError");
  const btn = document.getElementById("btnUnlock");
  const label = btn.textContent;
  errorEl.textContent = "";

  if (lockMode === "migrate") {
    const pinError = validateNewPin(pinEl.value, confirmEl.value);
    if (pinError) {
      errorEl.textContent = pinError;
      return;
    }
  } else if (!pinEl.value) {
    errorEl.textContent = "Digite o PIN.";
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Aguarde...';
  try {
    if (lockMode === "migrate") {
      await secureStorage.migrateLegacy(pinEl.value);
    } else {
      await secureStorage.unlock(pinEl.value);
    }
  } catch (e) {
    // PIN errado é esperado (falha de autenticação do AES-GCM); só registra
    // erros inesperados.
    if (lockMode === "migrate" || e.name !== "OperationError") console.error(e);
    errorEl.textContent =
      lockMode === "migrate"
        ? "Não foi possível criptografar os dados. Tente novamente."
        : "PIN incorreto.";
    btn.disabled = false;
    btn.textContent = label;
    pinEl.select();
    return;
  }

  btn.disabled = false;
  btn.textContent = label;
  hideLockScreen();
  if (lockMode === "migrate") {
    showToast("Seus dados agora estão criptografados", "success");
  }
  init();
}

function wipeAllDataAndRestart() {
  secureStorage.wipe();
  localStorage.removeItem(THEME_KEY);
  localStorage.removeItem(TERMS_KEY);
  removeFromLobby();
  if (peer) peer.destroy();
  location.reload();
}

// Pede o PIN em um modal. `validate` roda com o modal aberto e retorna uma
// mensagem de erro (ou null) — assim o usuário pode corrigir sem recomeçar.
function askPin({ title, message, confirmLabel = "Confirmar", validate }) {
  return new Promise((resolve) => {
    const modal = document.getElementById("pinPromptModal");
    const form = document.getElementById("pinPromptForm");
    const input = document.getElementById("pinPromptInput");
    const errorEl = document.getElementById("pinPromptError");
    const btnOk = document.getElementById("btnConfirmPinPrompt");
    const btnCancel = document.getElementById("btnCancelPinPrompt");

    document.getElementById("pinPromptTitle").textContent = title;
    document.getElementById("pinPromptText").textContent = message;
    btnOk.textContent = confirmLabel;
    errorEl.textContent = "";
    input.value = "";

    const close = (result) => {
      modal.classList.remove("active");
      form.onsubmit = null;
      btnCancel.onclick = null;
      input.value = "";
      resetPasswordVisibility(modal);
      btnOk.disabled = false;
      resolve(result);
    };

    form.onsubmit = async (e) => {
      e.preventDefault();
      const pin = input.value;
      if (!pin) {
        errorEl.textContent = "Digite o PIN.";
        return;
      }
      btnOk.disabled = true;
      btnOk.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
      const error = validate ? await validate(pin) : null;
      btnOk.disabled = false;
      btnOk.textContent = confirmLabel;
      if (error) {
        errorEl.textContent = error;
        input.select();
        return;
      }
      close(pin);
    };
    btnCancel.onclick = () => close(null);

    modal.classList.add("active");
    setTimeout(() => input.focus(), 50);
  });
}

function openChangePinModal() {
  ["currentPin", "newPin", "newPinConfirm"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  document.getElementById("changePinError").textContent = "";
  refreshStrengthMeters();
  document.getElementById("changePinModal").classList.add("active");
  setTimeout(() => document.getElementById("currentPin").focus(), 50);
}

function closeChangePinModal() {
  ["currentPin", "newPin", "newPinConfirm"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  const modal = document.getElementById("changePinModal");
  resetPasswordVisibility(modal);
  refreshStrengthMeters();
  modal.classList.remove("active");
}

async function submitChangePin(event) {
  event.preventDefault();
  const current = document.getElementById("currentPin").value;
  const next = document.getElementById("newPin").value;
  const confirmation = document.getElementById("newPinConfirm").value;
  const errorEl = document.getElementById("changePinError");
  const btn = document.getElementById("btnSaveChangePin");
  errorEl.textContent = "";

  if (!current) {
    errorEl.textContent = "Informe o PIN atual.";
    return;
  }
  const pinError = validateNewPin(next, confirmation);
  if (pinError) {
    errorEl.textContent = pinError;
    return;
  }
  if (next === current) {
    errorEl.textContent = "O novo PIN deve ser diferente do atual.";
    return;
  }

  btn.disabled = true;
  const original = btn.innerHTML;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Recriptografando...';
  try {
    await secureStorage.changePin(current, next);
    closeChangePinModal();
    showToast("PIN alterado com sucesso!", "success");
  } catch (e) {
    errorEl.textContent =
      e.message === "PIN atual incorreto"
        ? "PIN atual incorreto."
        : "Não foi possível alterar o PIN.";
  } finally {
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

// Botão "olho" em todos os campos de PIN, para conferir o que foi digitado.
function setupPasswordToggles() {
  document.querySelectorAll('input[type="password"]').forEach((input) => {
    if (input.parentElement.classList.contains("pin-input-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "pin-input-wrap";
    // Classes de margem ficam no wrapper para não desalinhar o botão.
    [...input.classList]
      .filter((c) => /^m[tbyxse]?-\d$/.test(c))
      .forEach((c) => {
        input.classList.remove(c);
        wrap.classList.add(c);
      });
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin-toggle";
    btn.setAttribute("aria-label", "Mostrar PIN");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = '<i class="bi bi-eye"></i>';
    btn.onclick = () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Ocultar PIN" : "Mostrar PIN");
      btn.innerHTML = `<i class="bi ${show ? "bi-eye-slash" : "bi-eye"}"></i>`;
      input.focus();
    };
    wrap.appendChild(btn);
  });
}

// Volta todos os campos de PIN para o modo oculto (ao abrir/fechar telas).
function resetPasswordVisibility(root = document) {
  root.querySelectorAll(".pin-input-wrap").forEach((wrap) => {
    const input = wrap.querySelector("input");
    const btn = wrap.querySelector(".pin-toggle");
    if (input.type !== "password") btn.click();
  });
}

// Medidor de força: apenas informa, não bloqueia PINs simples.
function setupStrengthMeters() {
  document.querySelectorAll("input[data-strength]").forEach((input) => {
    const meter = document.createElement("div");
    meter.className = "pin-strength";
    meter.dataset.level = "0";
    meter.setAttribute("aria-live", "polite");
    meter.innerHTML = `
      <div class="pin-strength-bars"><span></span><span></span><span></span></div>
      <span class="pin-strength-text">Segurança do PIN: —</span>`;
    const wrap = input.closest(".pin-input-wrap") || input;
    wrap.insertAdjacentElement("afterend", meter);
    const update = () => {
      const s = getPinStrength(input.value);
      meter.dataset.level = String(s.level);
      meter.querySelector(".pin-strength-text").textContent = s.level
        ? `Segurança do PIN: ${s.label} — ${s.hint}`
        : "Segurança do PIN: —";
    };
    input.addEventListener("input", update);
    input._updateStrength = update;
  });
}

function refreshStrengthMeters() {
  document
    .querySelectorAll("input[data-strength]")
    .forEach((input) => input._updateStrength && input._updateStrength());
}

// ── TERMOS DE USO E PRIVACIDADE (LGPD) ──
const TERMS_KEY = "financas-pro-terms";
const TERMS_VERSION = 2;

function getTermsAcceptance() {
  try {
    const data = JSON.parse(localStorage.getItem(TERMS_KEY) || "null");
    return data && data.version === TERMS_VERSION ? data : null;
  } catch (e) {
    return null; // registro inválido: pede o aceite novamente
  }
}

function saveTermsAcceptance() {
  localStorage.setItem(
    TERMS_KEY,
    JSON.stringify({ version: TERMS_VERSION, acceptedAt: new Date().toISOString() })
  );
}

// mode: "read" (só leitura, pode fechar) | "require" (precisa aceitar)
function openTermsModal(mode = "read") {
  const modal = document.getElementById("termsModal");
  const accepted = getTermsAcceptance();
  modal.dataset.mode = mode;
  document.getElementById("btnCloseTermsX").style.display =
    mode === "require" ? "none" : "";
  document.getElementById("termsRequireActions").style.display =
    mode === "require" ? "flex" : "none";
  document.getElementById("termsReadActions").style.display =
    mode === "require" ? "none" : "flex";
  document.getElementById("termsAcceptedInfo").textContent = accepted
    ? `Aceito em ${new Date(accepted.acceptedAt).toLocaleString("pt-BR")}.`
    : "";
  modal.querySelector(".modal-body").scrollTop = 0;
  modal.classList.add("active");
}

function closeTermsModal() {
  document.getElementById("termsModal").classList.remove("active");
}

function bindSecurityUi() {
  setupPasswordToggles();
  setupStrengthMeters();

  document.getElementById("btnCloseTermsX").onclick = closeTermsModal;
  // "Entendi" vale como aceite: marca o checkbox do primeiro acesso.
  document.getElementById("btnCloseTerms").onclick = () => {
    const check = document.getElementById("setupAcceptTerms");
    if (check) {
      check.checked = true;
      const err = document.getElementById("setupError");
      if (err.textContent.includes("Termos")) err.textContent = "";
    }
    closeTermsModal();
  };
  document.getElementById("btnAcceptTerms").onclick = () => {
    saveTermsAcceptance();
    closeTermsModal();
    showToast("Termos aceitos", "success");
  };
  document.getElementById("btnDeclineTerms").onclick = () => {
    closeTermsModal();
    document.getElementById("deleteAccountModal").classList.add("active");
  };
  document.querySelectorAll("[data-open-terms]").forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      openTermsModal("read");
    };
  });

  document.getElementById("lockForm").onsubmit = submitLockForm;
  document.getElementById("btnForgotPin").onclick = () => {
    document.getElementById("forgotPinPanel").style.display = "block";
  };
  document.getElementById("btnCancelForgotPin").onclick = () => {
    document.getElementById("forgotPinPanel").style.display = "none";
  };
  document.getElementById("btnConfirmWipe").onclick = wipeAllDataAndRestart;

  document.getElementById("changePinForm").onsubmit = submitChangePin;
  document.getElementById("btnCloseChangePin").onclick = closeChangePinModal;
  document.getElementById("btnCancelChangePin").onclick = closeChangePinModal;
  document.getElementById("btnChangePinMenu").onclick = (e) => {
    e.preventDefault();
    openChangePinModal();
  };
  document.getElementById("btnLockMenu").onclick = async (e) => {
    e.preventDefault();
    await secureStorage.flush();
    if (peer) peer.destroy();
    location.reload();
  };
}

async function bootstrap() {
  loadTheme();
  bindSecurityUi();

  if (!isCryptoAvailable()) {
    showLockScreen("unsupported");
    return;
  }
  if (secureStorage.hasVault()) {
    showLockScreen("unlock");
  } else if (secureStorage.hasLegacyPlainData()) {
    showLockScreen("migrate");
  } else {
    init();
  }
}

// PeerJS é carregado só quando o usuário abre "Sincronizar integrantes":
// a página abre mais rápido e nenhuma conexão externa é feita sem necessidade.
const PEERJS_URL = "https://unpkg.com/peerjs@1.5.0/dist/peerjs.min.js";
let peerLoading = null;

function ensurePeer() {
  if (peer) return Promise.resolve(peer);
  if (!peerLoading) {
    peerLoading = new Promise((resolve, reject) => {
      if (typeof Peer !== "undefined") return resolve();
      const script = document.createElement("script");
      script.src = PEERJS_URL;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Falha ao carregar PeerJS"));
      document.head.appendChild(script);
    })
      .then(() => {
        initPeer();
        return peer;
      })
      .catch((err) => {
        peerLoading = null;
        console.error(err);
        document.getElementById("peerStatusMsg").textContent =
          "Não foi possível carregar a conexão. Verifique a internet.";
        throw err;
      });
  }
  return peerLoading;
}

function initPeer() {
  peer = new Peer(null, {
    debug: 1,
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
    handleIncomingConnection(connection).catch((err) => {
      console.error("Falha ao preparar a conexão:", err);
      connection.close();
    });
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

// Quem inicia o convite envia sua chave pública no metadata; quem aceita
// responde com a dele. A partir daí, tudo trafega cifrado (PeerCrypto).
async function connectToPeer(remoteIdArg = null) {
  const input = document.getElementById("remotePeerIdInput");
  const remoteId = remoteIdArg || input.value.trim();
  if (!remoteId) return showToast("Insira o ID do integrante", "error");
  if (!peer) return showToast("Conexão ainda não iniciada", "error");

  if (remoteId === myPeerId) {
    return showToast("Você não pode conectar com você mesmo", "warning");
  }
  if (pendingConnections[remoteId] || (conn && conn.peer === remoteId)) {
    return showToast("Convite já enviado para esse integrante", "warning");
  }

  let me;
  try {
    me = await PeerCrypto.identity();
  } catch (e) {
    console.error(e);
    return showToast("Não foi possível preparar a criptografia", "error");
  }

  const connection = peer.connect(remoteId, {
    reliable: true,
    metadata: {
      name: state.userProfile.name || "Integrante",
      pub: me.publicKey,
      proto: P2P_PROTOCOL,
    },
  });
  connection._initiator = true;

  pendingConnections[remoteId] = connection;
  setupConnectionListeners(connection);
  showToast("Convite enviado. Aguardando resposta...", "success");
  if (!remoteIdArg) input.value = "";
}

function attachPeerIdentity(connection, publicKey, name) {
  connection._remotePub = publicKey;
  connection._remoteName = String(name || "Integrante").slice(0, 30);
}

async function handleIncomingConnection(connection) {
  const meta = connection.metadata || {};
  const partnerName = String(meta.name || "Alguém").slice(0, 30);
  setupConnectionListeners(connection);

  if (meta.proto !== P2P_PROTOCOL || !PeerCrypto.isValidPublicKey(meta.pub)) {
    sendWhenOpen(connection, {
      type: "connection_rejected",
      data: { reason: "protocol" },
    });
    setTimeout(() => connection.close(), 250);
    showToast(
      `${partnerName} usa uma versão sem criptografia. Peça para atualizar o app.`,
      "warning"
    );
    return;
  }

  attachPeerIdentity(connection, meta.pub, partnerName);
  pendingConnections[connection.peer] = connection;
  showConnectionRequest(connection);
}

function setupConnectionListeners(connection) {
  // Fila por conexão: decifrar é assíncrono e a ordem das mensagens importa.
  connection._rx = Promise.resolve();
  connection.on("data", (payload) => {
    connection._rx = connection._rx
      .then(() => processIncomingMessage(connection, payload))
      .catch((err) => console.error("Erro ao processar mensagem:", err));
  });

  connection.on("close", () => {
    delete pendingConnections[connection.peer];
    if (conn && conn.peer === connection.peer) {
      conn = null;
      renderConnectedPeer();
      updateConnectionStatus("online");
      showToast("Integrante desconectado", "warning");
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

// Envia cifrado com a chave da sessão; nunca envia dados em texto puro.
function secureSend(connection, payload) {
  if (!connection || !connection._sessionKey) return;
  connection._tx = (connection._tx || Promise.resolve())
    .then(() => PeerCrypto.encryptMessage(connection._sessionKey, payload))
    .then((message) => sendWhenOpen(connection, message))
    .catch((err) => console.error("Falha ao cifrar mensagem P2P:", err));
}

// Só "connection_accepted"/"connection_rejected" trafegam abertos (contêm
// apenas nome e chave pública). Todo o resto precisa vir cifrado.
async function processIncomingMessage(connection, payload) {
  if (!payload || typeof payload !== "object") return;

  if (payload.type === "enc") {
    if (!connection._sessionKey || connection !== conn) return;
    let message;
    try {
      message = await PeerCrypto.decryptMessage(connection._sessionKey, payload);
    } catch (e) {
      console.warn("Mensagem P2P inválida descartada");
      return;
    }
    handleReceivedData(message, connection);
    return;
  }

  if (!connection._initiator || connection._sessionKey) return;

  if (payload.type === "connection_rejected") {
    showToast(
      payload.data?.reason === "protocol"
        ? "O outro aparelho usa uma versão incompatível do app"
        : "Seu convite foi recusado",
      "warning"
    );
    delete pendingConnections[connection.peer];
    setTimeout(() => connection.close(), 250);
    return;
  }

  if (payload.type === "connection_accepted") {
    const data = payload.data || {};
    if (data.proto !== P2P_PROTOCOL || !PeerCrypto.isValidPublicKey(data.pub)) {
      showToast("O outro aparelho usa uma versão sem criptografia", "warning");
      connection.close();
      return;
    }
    try {
      attachPeerIdentity(connection, data.pub, data.name);
      connection._sessionKey = await PeerCrypto.deriveSessionKey(data.pub);
    } catch (e) {
      console.error(e);
      showToast("Falha na troca de chaves. Tente novamente.", "error");
      connection.close();
      return;
    }
    showToast(`${connection._remoteName} aceitou seu convite!`, "success");
    markConnected(connection);
  }
}

function markConnected(connection) {
  conn = connection;
  delete pendingConnections[connection.peer];

  updateConnectionStatus("connected");
  renderConnectedPeer();
  document.getElementById("syncModal").classList.remove("active");
  showToast("Conexão criptografada estabelecida", "success");

  secureStorage.setItem(HAS_SYNCED_KEY, "1");
  renderAchievements();
  removeFromLobby();

  if (document.getElementById("userListModal").classList.contains("active")) {
    hideUserListModal();
  }

  // Nenhum dado é enviado automaticamente: cada lado decide se envia.
  connection._live = false;
  connection._inMap = {};
  openSyncStartModal();
}

function renderConnectedPeer() {
  const section = document.getElementById("connectedPeerSection");
  if (!section) return;
  if (!conn || !conn._sessionKey) {
    section.style.display = "none";
    return;
  }
  document.getElementById("connectedPeerName").textContent = conn._remoteName;
  const live = document.getElementById("connectedLiveStatus");
  live.className = `live-status ${conn._live ? "on" : "off"}`;
  live.innerHTML = conn._live
    ? '<i class="bi bi-broadcast"></i> Tempo real ativo: alterações são enviadas na hora.'
    : '<i class="bi bi-pause-circle"></i> Nenhum dado trocado ainda. Envie seus dados para ativar o tempo real.';
  section.style.display = "block";
}

function showConnectionRequest(connection) {
  incomingRequestPeerId = connection.peer;
  document.getElementById(
    "connectionRequestText"
  ).textContent = `${connection._remoteName} quer sincronizar as finanças com você.`;
  document.getElementById("connectionRequestModal").classList.add("active");
}

function hideConnectionRequest() {
  document.getElementById("connectionRequestModal").classList.remove("active");
  incomingRequestPeerId = null;
}

async function acceptConnectionRequest() {
  const connection = pendingConnections[incomingRequestPeerId];
  hideConnectionRequest();
  if (!connection) return;

  let me;
  try {
    connection._sessionKey = await PeerCrypto.deriveSessionKey(
      connection._remotePub
    );
    me = await PeerCrypto.identity();
  } catch (e) {
    console.error(e);
    showToast("Falha na troca de chaves", "error");
    connection.close();
    return;
  }

  sendWhenOpen(connection, {
    type: "connection_accepted",
    data: {
      name: state.userProfile.name || "Integrante",
      pub: me.publicKey,
      proto: P2P_PROTOCOL,
    },
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

// Atualizações em tempo real: só depois que uma troca de dados foi aceita.
function sendData(payload) {
  if (isLive()) secureSend(conn, payload);
}

// ── LOBBY (descoberta de integrantes via API) ──
// Só existe registro no lobby enquanto a busca está em uso.
let lobbyRegistered = false;

async function registerInLobby() {
  if (!myPeerId || !state.userProfile.name) return;
  try {
    lobbyRegistered = true;
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
    console.error("Erro ao buscar integrantes:", error);
    return [];
  }
}

async function removeFromLobby() {
  if (!myPeerId || !lobbyRegistered) return;
  lobbyRegistered = false;
  try {
    // keepalive: a remoção também funciona ao fechar a aba (minimização de dados).
    await fetch(`${LOBBY_API_URL}/delete?id=${encodeURIComponent(myPeerId)}`, {
      keepalive: true,
    });
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
      Ninguém online agora. Atualize a lista ou compartilhe seu ID diretamente com o integrante.
    </div>`;
    return;
  }

  listEl.innerHTML = users
    .map((user) => {
      const name = String(user.nickname || "Integrante");
      const initial = escapeHtml(name.trim().charAt(0) || "?");
      return `
      <div class="user-list-item">
        <div class="user-list-info">
          <span class="user-list-avatar">${initial}</span>
          <span class="user-list-name">${escapeHtml(name)}</span>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="connectFromLobby('${safeJsArg(user.id)}')">
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

// ── SINCRONIZAÇÃO: OFERTA DE DADOS + TEMPO REAL ──
// 1. Conectar NÃO envia dados. Os dois lados veem a pergunta "Enviar seus dados?".
// 2. Quem envia manda uma oferta; o outro lado vê o resumo, ajusta a
//    correspondência de integrantes e aceita ou cancela.
// 3. Ao aceitar, um backup automático é salvo antes de mesclar os dados.
// 4. A partir daí a conexão fica "em tempo real" para os dois lados:
//    lançamentos, metas, categorias e novos integrantes são enviados na hora.
//
// Cada aparelho guarda os dados no SEU espaço de integrantes ("eu" = dono
// do aparelho). Quem recebe traduz os integrantes do outro com o mapa
// conn._inMap (chave remota -> chave local), definido na tela de aceite.
const AUTO_BACKUP_KEY = "financas-pro-auto-backup";
const NEW_MEMBER = "__novo__";
let pendingOffer = null;

function normalizeName(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

function isLive() {
  return !!(conn && conn.open && conn._sessionKey && conn._live);
}

function sanitizeRemoteMembers(list) {
  return (Array.isArray(list) ? list : [])
    .filter((m) => m && MEMBER_SLOTS.includes(m.key))
    .map((m) => ({ key: m.key, name: String(m.name || "Integrante").slice(0, 30) }));
}

// Sugestão inicial: 1) mesmo nome; 2) regra antiga "eu" <-> "parceiro";
// 3) novo integrante (se houver vaga); 4) o primeiro integrante livre.
function suggestMemberMapping(remoteMembers) {
  const local = getMembers();
  const used = new Set();
  const map = {};
  remoteMembers.forEach((rm) => {
    const match = local.find(
      (l) => !used.has(l.key) && normalizeName(l.name) === normalizeName(rm.name)
    );
    if (match) {
      map[rm.key] = match.key;
      used.add(match.key);
    }
  });
  remoteMembers.forEach((rm) => {
    if (map[rm.key]) return;
    const cand = rm.key === "eu" ? "parceiro" : rm.key === "parceiro" ? "eu" : null;
    if (cand && local.some((l) => l.key === cand) && !used.has(cand)) {
      map[rm.key] = cand;
      used.add(cand);
    }
  });
  let freeSlots = MAX_MEMBERS - local.length;
  remoteMembers.forEach((rm) => {
    if (map[rm.key]) return;
    if (freeSlots > 0) {
      map[rm.key] = NEW_MEMBER;
      freeSlots--;
      return;
    }
    const free = local.find((l) => !used.has(l.key)) || local[0];
    map[rm.key] = free.key;
    used.add(free.key);
  });
  return map;
}

// Cria os integrantes marcados como "novo" e devolve o mapa final.
function applyMemberMapping(remoteMembers, map) {
  const finalMap = {};
  let members = getMembers();
  remoteMembers.forEach((rm) => {
    let target = map[rm.key];
    if (target === NEW_MEMBER) {
      const existing = members.find((m) => normalizeName(m.name) === normalizeName(rm.name));
      if (existing) {
        target = existing.key;
      } else {
        const used = new Set(members.map((m) => m.key));
        const slot = MEMBER_SLOTS.find((k) => !used.has(k));
        if (!slot) {
          target = "eu";
        } else {
          members = [...members, { key: slot, name: rm.name }];
          target = slot;
        }
      }
    }
    finalMap[rm.key] = target;
  });
  if (members.length !== getMembers().length) {
    state.userProfile.members = members;
    saveProfile();
    rebuildPersons();
    renderFlowTabs();
    setupFilters();
    renderMembersList();
  }
  return finalMap;
}

// Traduz o integrante de um item vindo do outro aparelho.
function resolveRemotePerson(key) {
  if (!conn) return key;
  conn._inMap = conn._inMap || {};
  if (conn._inMap[key]) return conn._inMap[key];
  if (key === SHARED_PERSON_KEY) return key;
  // Integrante que o outro lado criou depois: cria/associa pelo nome.
  const rm = (conn._remoteMembers || []).find((m) => m.key === key);
  if (rm) {
    const map = applyMemberMapping([rm], { [key]: NEW_MEMBER });
    conn._inMap[key] = map[key];
    return map[key];
  }
  return "eu";
}

function translateIncomingTransaction(t) {
  return { ...t, person: resolveRemotePerson(t.person) };
}

function translateIncomingGoal(g) {
  return { ...g, person: resolveRemotePerson(g.person || "eu") };
}

// ── Backup automático (guardado dentro do cofre cifrado) ──
function createAutoBackup(reason) {
  const backup = {
    at: new Date().toISOString(),
    reason,
    data: {
      transactions: state.transactions,
      goals: state.goals,
      categories: customCategories,
      members: getMembers(),
    },
  };
  secureStorage.setItem(AUTO_BACKUP_KEY, JSON.stringify(backup));
  return backup;
}

function getAutoBackup() {
  try {
    return JSON.parse(secureStorage.getItem(AUTO_BACKUP_KEY) || "null");
  } catch (e) {
    return null; // backup corrompido: tratado como inexistente
  }
}

function openAutoBackupModal() {
  const backup = getAutoBackup();
  const info = document.getElementById("autoBackupInfo");
  const btn = document.getElementById("btnRestoreAutoBackup");
  if (!backup) {
    info.innerHTML =
      '<p class="text-secondary">Nenhum backup automático ainda. Ele é criado sempre que você aceita dados de outro integrante.</p>';
    btn.disabled = true;
  } else {
    const d = backup.data || {};
    info.innerHTML = `
      <div class="backup-card">
        <div><span>Criado em</span><strong>${escapeHtml(new Date(backup.at).toLocaleString("pt-BR"))}</strong></div>
        <div><span>Motivo</span><strong>${escapeHtml(backup.reason || "-")}</strong></div>
        <div><span>Conteúdo</span><strong>${(d.transactions || []).length} lançamentos · ${(d.goals || []).length} metas · ${(d.members || []).length} integrantes</strong></div>
      </div>
      <p class="field-hint">Restaurar substitui os dados atuais deste aparelho pelos dados do backup. O outro aparelho não é alterado.</p>`;
    btn.disabled = false;
  }
  document.getElementById("autoBackupModal").classList.add("active");
}

function restoreAutoBackup() {
  const backup = getAutoBackup();
  if (!backup || !backup.data) return;
  const d = backup.data;
  confirmDeleteAction = () => {
    state.transactions = Array.isArray(d.transactions) ? d.transactions : [];
    state.goals = Array.isArray(d.goals) ? d.goals : [];
    customCategories = d.categories && typeof d.categories === "object" ? d.categories : {};
    if (Array.isArray(d.members) && d.members.length) {
      state.userProfile = normalizeProfile({ members: d.members });
      saveProfile();
      rebuildPersons();
      renderFlowTabs();
    }
    // Restaurar é local: desliga o tempo real para não espalhar a mudança.
    if (conn) conn._live = false;
    saveCustomCategories(false);
    saveGoals(false);
    saveData(false);
    setupFilters();
    renderMembersList();
    renderCategoriesSection();
    render();
    renderConnectedPeer();
    document.getElementById("autoBackupModal").classList.remove("active");
    showToast("Backup restaurado", "success");
  };
  document.getElementById("confirmModal").classList.add("active");
}

// ── Oferta de dados ──
function openSyncStartModal() {
  if (!conn) return;
  document.getElementById("syncStartName").textContent = conn._remoteName;
  document.getElementById("syncStartModal").classList.add("active");
}

function closeSyncStartModal() {
  document.getElementById("syncStartModal").classList.remove("active");
}

function sendDataOffer() {
  if (!conn || !conn._sessionKey) return showToast("Nenhum integrante conectado", "warning");
  secureSend(conn, {
    type: "data_offer",
    data: {
      members: getMembers(),
      transactions: state.transactions,
      goals: state.goals,
      categories: customCategories,
      sentAt: new Date().toISOString(),
    },
  });
  closeSyncStartModal();
  showToast(`Dados enviados. Aguardando ${conn._remoteName} aceitar...`, "success");
}

// ── Tela "Quem é quem?" (usada ao receber dados de um integrante E ao importar arquivo) ──
const SKIP_MEMBER = "__ignorar__";
const FALLBACK_MEMBER_NAMES = {
  eu: "Dono do arquivo",
  parceiro: "2º integrante",
  membro3: "3º integrante",
  membro4: "4º integrante",
  membro5: "5º integrante",
};

// Pessoas presentes nos dados recebidos. Arquivos antigos não trazem os
// nomes; nesse caso usamos rótulos pela posição do integrante.
function describeOfferMembers(members, transactions, goals) {
  const list = sanitizeRemoteMembers(members);
  const hasNames = list.length > 0;
  const used = new Set([
    ...transactions.map((t) => t && t.person),
    ...goals.map((g) => (g && g.person) || "eu"),
  ]);
  used.forEach((key) => {
    if (!key || list.some((m) => m.key === key)) return;
    if (key === SHARED_PERSON_KEY) {
      list.push({ key, name: "Compartilhado (formato antigo)", legacy: true });
    } else if (MEMBER_SLOTS.includes(key)) {
      list.push({ key, name: FALLBACK_MEMBER_NAMES[key], unnamed: true });
    }
  });
  if (!list.length) list.push({ key: "eu", name: FALLBACK_MEMBER_NAMES.eu, unnamed: true });
  return { list, hasNames };
}

function suggestOfferMapping(members, source, hasNames) {
  const local = getMembers();
  const named = members.filter((m) => !m.legacy);
  let map;
  if (source === "file" && !hasNames) {
    // Backup antigo sem nomes: normalmente é do próprio usuário (mesmas posições).
    map = {};
    let free = MAX_MEMBERS - local.length;
    named.forEach((m) => {
      if (local.some((l) => l.key === m.key)) map[m.key] = m.key;
      else if (free-- > 0) map[m.key] = NEW_MEMBER;
      else map[m.key] = "eu";
    });
  } else {
    map = suggestMemberMapping(named);
  }
  members.filter((m) => m.legacy).forEach((m) => (map[m.key] = "eu"));
  return map;
}

function readOfferMapping() {
  const map = {};
  document.querySelectorAll("#dataOfferMapping select[data-remote]").forEach((sel) => {
    map[sel.dataset.remote] = sel.value;
  });
  return map;
}

// Resumo "o que será importado", atualizado conforme o usuário marca
// "Não importar" em alguém.
function updateOfferSummary() {
  if (!pendingOffer) return;
  const map = readOfferMapping();
  const keep = (person) => map[person || "eu"] !== SKIP_MEMBER;
  const tx = pendingOffer.transactions.filter((t) => keep(t.person)).length;
  const goals = pendingOffer.goals.filter((g) => keep(g.person)).length;
  const people = pendingOffer.members.filter((m) => !m.legacy && map[m.key] !== SKIP_MEMBER).length;
  document.getElementById("dataOfferSummary").innerHTML = `
    <div><strong>${people}</strong><span>integrante(s)</span></div>
    <div><strong>${tx}</strong><span>lançamentos</span></div>
    <div><strong>${goals}</strong><span>metas</span></div>
    <div><strong>${Object.keys(pendingOffer.categories).length}</strong><span>categorias</span></div>`;
}

// source: "peer" (outro aparelho) | "file" (backup importado)
function showDataOffer(data, { source = "peer", fromName = "", exportedAt = null } = {}) {
  const transactions = (Array.isArray(data) ? data : Array.isArray(data.transactions) ? data.transactions : [])
    .filter((t) => t && t.id && typeof t.date === "string");
  const goals = Array.isArray(data.goals) ? data.goals.filter((g) => g && g.id) : [];
  const categories =
    data.categories && typeof data.categories === "object" && !Array.isArray(data.categories)
      ? data.categories
      : {};
  const { list: members, hasNames } = describeOfferMembers(data.members, transactions, goals);

  pendingOffer = { source, fromName, members, transactions, goals, categories };
  if (source === "peer") conn._remoteMembers = members.filter((m) => !m.legacy && !m.unnamed);
  closeSyncStartModal();

  const isFile = source === "file";
  document.getElementById("dataOfferTitle").textContent = isFile
    ? "Importar backup"
    : `${fromName} enviou os dados`;
  const when = exportedAt && !Number.isNaN(Date.parse(exportedAt))
    ? new Date(exportedAt).toLocaleString("pt-BR")
    : null;
  document.getElementById("dataOfferSubtitle").textContent = isFile
    ? when
      ? `Arquivo exportado em ${when}.`
      : "Arquivo de backup."
    : "";
  document.getElementById("dataOfferModeRow").style.display = isFile ? "" : "none";
  document.getElementById("offerModeMerge").checked = true;
  document.getElementById("btnAcceptDataOffer").innerHTML = isFile
    ? '<i class="bi bi-upload"></i> Importar'
    : '<i class="bi bi-check-lg"></i> Aceitar dados';

  const suggestion = suggestOfferMapping(members, source, hasNames);
  const local = getMembers();
  const canAdd = local.length < MAX_MEMBERS;
  const counts = (key) => transactions.filter((t) => t.person === key).length;
  const ownerLabel = isFile ? "dono do arquivo" : "quem enviou";

  document.getElementById("dataOfferMapping").innerHTML = members
    .map((rm) => {
      const opts = local
        .map((l) => `<option value="${escapeHtml(l.key)}" ${suggestion[rm.key] === l.key ? "selected" : ""}>${escapeHtml(l.name)}${l.key === "eu" ? " (você)" : ""}</option>`)
        .join("");
      const newOpt =
        canAdd && !rm.legacy
          ? `<option value="${NEW_MEMBER}" ${suggestion[rm.key] === NEW_MEMBER ? "selected" : ""}>+ Novo integrante "${escapeHtml(rm.name)}"</option>`
          : "";
      const skipOpt = `<option value="${SKIP_MEMBER}">Não importar</option>`;
      const tag = rm.key === "eu" && !rm.unnamed ? `${ownerLabel} · ` : "";
      return `
      <div class="mapping-row">
        <div class="mapping-remote">
          <strong>${escapeHtml(rm.name)}</strong>
          <span>${tag}${counts(rm.key)} lançamento(s)</span>
        </div>
        <i class="bi bi-arrow-right mapping-arrow"></i>
        <select class="form-select" data-remote="${escapeHtml(rm.key)}" aria-label="Corresponde a">${opts}${newOpt}${skipOpt}</select>
      </div>`;
    })
    .join("");
  document.querySelectorAll("#dataOfferMapping select").forEach((sel) => {
    sel.onchange = () => {
      sel.closest(".mapping-row").classList.toggle("is-skipped", sel.value === SKIP_MEMBER);
      updateOfferSummary();
    };
  });
  updateOfferSummary();
  document.getElementById("dataOfferError").textContent = "";
  document.querySelector("#dataOfferModal .modal-window").scrollTop = 0;
  document.getElementById("dataOfferModal").classList.add("active");
}

function acceptDataOffer() {
  if (!pendingOffer) return;
  const offer = pendingOffer;
  const isFile = offer.source === "file";
  if (!isFile && !conn) return;

  const map = readOfferMapping();
  const newCount = Object.values(map).filter((v) => v === NEW_MEMBER).length;
  if (getMembers().length + newCount > MAX_MEMBERS) {
    document.getElementById("dataOfferError").textContent = `Limite de ${MAX_MEMBERS} integrantes. Associe alguém a um integrante existente ou marque "Não importar".`;
    return;
  }
  const kept = offer.members.filter((m) => map[m.key] !== SKIP_MEMBER);
  if (!kept.length) {
    document.getElementById("dataOfferError").textContent = "Selecione pelo menos um integrante para importar.";
    return;
  }

  createAutoBackup(isFile ? "Antes de importar um backup" : `Antes de receber dados de ${offer.fromName}`);
  const finalMap = applyMemberMapping(kept, map);
  offer.members.forEach((m) => {
    if (map[m.key] === SKIP_MEMBER) finalMap[m.key] = SKIP_MEMBER;
  });

  const target = (person) => finalMap[person || "eu"] || "eu";
  const transactions = offer.transactions
    .filter((t) => target(t.person) !== SKIP_MEMBER)
    .map((t) => ({ ...t, person: target(t.person) }));
  const goals = offer.goals
    .filter((g) => target(g.person) !== SKIP_MEMBER)
    .map((g) => ({ ...g, person: target(g.person) }));

  let categoriesAdded = 0;
  Object.entries(offer.categories).forEach(([key, cat]) => {
    if (DEFAULT_CATEGORIES[key] || !cat || typeof cat !== "object") return;
    if (!customCategories[key]) categoriesAdded++;
    customCategories[key] = cat;
  });
  saveCustomCategories(false);

  const replace = isFile && document.getElementById("offerModeReplace").checked;
  let added;
  if (replace) {
    state.transactions = transactions;
    state.goals = goals;
    saveGoals(false);
    saveData(false);
    added = transactions.length;
  } else {
    mergeGoals(goals, { silent: true });
    added = mergeTransactions(transactions, { silent: true });
  }

  if (isFile) {
    // Conectado em tempo real: o outro aparelho também recebe o que entrou.
    if (isLive()) {
      sendData({ type: "profile_sync", data: state.userProfile });
      sendData({ type: "categories_sync", data: customCategories });
      sendData({ type: "goals_sync", data: goals });
      sendData({ type: "full_sync", data: transactions });
    }
  } else {
    conn._inMap = { ...(conn._inMap || {}), ...finalMap };
    // O outro lado recebe o mapa inverso para traduzir o que EU enviar.
    const inverse = {};
    Object.entries(finalMap).forEach(([remoteKey, localKey]) => {
      if (localKey !== SKIP_MEMBER && !inverse[localKey]) inverse[localKey] = remoteKey;
    });
    secureSend(conn, { type: "data_response", data: { accepted: true, map: inverse, members: getMembers() } });
    conn._live = true;
  }

  pendingOffer = null;
  document.getElementById("dataOfferModal").classList.remove("active");
  setupFilters();
  renderCategoriesSection();
  render();
  renderConnectedPeer();
  const what = replace
    ? `${added} lançamento(s) importados (dados substituídos)`
    : `${added} lançamento(s) novos`;
  showToast(
    isFile
      ? `${what}. Backup automático salvo.`
      : `${what} recebidos. Backup automático salvo. Tempo real ativado.`,
    "success"
  );
}

function declineDataOffer() {
  const offer = pendingOffer;
  pendingOffer = null;
  document.getElementById("dataOfferModal").classList.remove("active");
  if (offer && offer.source === "peer" && conn) {
    secureSend(conn, { type: "data_response", data: { accepted: false } });
  }
}

// Recebe apenas mensagens já decifradas e autenticadas (processIncomingMessage).
function handleReceivedData(payload, connection = null) {
  if (!payload || typeof payload !== "object") return;
  const data = payload.data;

  if (payload.type === "data_offer") {
    if (data && typeof data === "object") {
      showDataOffer(data, { source: "peer", fromName: conn._remoteName });
    }
    return;
  }
  if (payload.type === "data_response") {
    if (data?.accepted) {
      if (data.map && typeof data.map === "object") {
        conn._inMap = { ...(conn._inMap || {}) };
        Object.entries(data.map).forEach(([remoteKey, localKey]) => {
          if (MEMBER_SLOTS.includes(remoteKey) && getMembers().some((m) => m.key === localKey)) {
            conn._inMap[remoteKey] = localKey;
          }
        });
      }
      conn._remoteMembers = sanitizeRemoteMembers(data.members);
      conn._live = true;
      renderConnectedPeer();
      showToast(`${conn._remoteName} aceitou seus dados. Tempo real ativado.`, "success");
    } else {
      showToast(`${conn._remoteName} não aceitou os dados agora`, "warning");
    }
    return;
  }

  // Atualizações em tempo real só depois de uma troca aceita.
  if (!connection || !connection._live) return;

  switch (payload.type) {
    case "profile_sync": {
      const before = getMembers().length;
      conn._remoteMembers = sanitizeRemoteMembers(data?.members);
      conn._remoteMembers.forEach((m) => resolveRemotePerson(m.key));
      if (getMembers().length > before) {
        render();
        showToast("Novo integrante sincronizado", "success");
      }
      break;
    }
    case "categories_sync":
      if (data && typeof data === "object") {
        Object.assign(customCategories, data);
        saveCustomCategories(false);
        setupFilters();
        renderCategoryManageList();
        requestRender();
      }
      break;
    case "category_delete":
      if (data?.key && customCategories[data.key]) {
        delete customCategories[data.key];
        saveCustomCategories(false);
        setupFilters();
        renderCategoryManageList();
        requestRender();
      }
      break;
    case "goals_sync":
      if (Array.isArray(data)) {
        mergeGoals(data.map(translateIncomingGoal).filter((g) => g.person !== SKIP_MEMBER));
      }
      break;
    case "goal_delete":
      if (data?.id && state.goals.some((g) => g.id === data.id)) {
        state.goals = state.goals.filter((g) => g.id !== data.id);
        saveGoals(false);
        if (goalDetailId === data.id) closeGoalDetailModal();
        requestRender();
      }
      break;
    case "full_sync":
      if (Array.isArray(data)) {
        mergeTransactions(
          data.map(translateIncomingTransaction).filter((t) => t.person !== SKIP_MEMBER)
        );
      }
      break;
    case "transaction_update":
      if (data && data.id) {
        const t = translateIncomingTransaction(data);
        if (t.person !== SKIP_MEMBER) mergeSingleTransaction(t);
      }
      break;
    case "transaction_delete":
      if (data?.id) deleteLocalTransaction(data.id, false);
      break;
  }
}

// Mescla por ID (o item recebido substitui o local de mesmo ID). Usa Map
// para não ficar O(n²) com muitos lançamentos.
function mergeTransactions(incomingList, { silent = false } = {}) {
  const index = new Map(state.transactions.map((t, i) => [t.id, i]));
  let added = 0;
  let changed = false;
  incomingList.forEach((t) => {
    if (!t || !t.id) return;
    const idx = index.get(t.id);
    if (idx === undefined) {
      index.set(t.id, state.transactions.length);
      state.transactions.push(t);
      added++;
      changed = true;
    } else if (JSON.stringify(state.transactions[idx]) !== JSON.stringify(t)) {
      state.transactions[idx] = t;
      changed = true;
    }
  });

  if (changed) {
    saveData(false);
    if (!silent) {
      requestRender();
      showToast("Dados sincronizados", "success");
    }
  }
  return added;
}

function mergeSingleTransaction(t) {
  const idx = state.transactions.findIndex((local) => local.id === t.id);
  if (idx !== -1) {
    state.transactions[idx] = t;
  } else {
    state.transactions.push(t);
  }
  saveData(false);
  requestRender();
  showToast("Lançamento sincronizado");
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
  invalidateDataCache();
  secureStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  if (broadcast && conn && conn.open) {
  }
}

function loadData() {
  const stored = secureStorage.getItem(STORAGE_KEY);
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

// O backup é sempre cifrado. O PIN é pedido novamente (e conferido contra o
// cofre) para evitar gerar um arquivo com um PIN digitado errado.
async function exportData() {
  let encrypted = null;
  const pin = await askPin({
    title: "Exportar backup cifrado",
    message:
      "Confirme seu PIN atual. Ele passa a ser o PIN DO ARQUIVO: mesmo que você troque o PIN do app depois, este backup continuará abrindo apenas com o PIN de hoje.",
    confirmLabel: "Exportar",
    validate: async (value) => {
      if (!(await secureStorage.verifyPin(value))) return "PIN incorreto.";
      const payload = {
        version: 3,
        exportedAt: new Date().toISOString(),
        members: getMembers(),
        transactions: state.transactions,
        categories: customCategories,
        goals: state.goals,
      };
      try {
        encrypted = await encryptBackup(value, JSON.stringify(payload));
      } catch (e) {
        console.error(e);
        return "Não foi possível criptografar o backup.";
      }
      return null;
    },
  });
  if (!pin || !encrypted) return;

  const blob = new Blob([JSON.stringify(encrypted)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup_financas_cifrado_${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Backup baixado. Para abri-lo, use o PIN de hoje.", "success");
}

function triggerImport() {
  document.getElementById("importFile").click();
}

function importData(event) {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    let data;
    try {
      data = JSON.parse(e.target.result);
    } catch (error) {
      showToast("Erro ao processar", "error");
      return;
    }

    // Backups cifrados: pede o PIN usado na exportação (pode ser o PIN de
    // outro integrante, quando o arquivo veio do dispositivo dele).
    const exportedAtOuter = data && data.exportedAt;
    if (isEncryptedBackup(data)) {
      let decrypted = null;
      const exportedAt = Date.parse(data.exportedAt);
      const when = Number.isNaN(exportedAt)
        ? ""
        : ` em ${new Date(exportedAt).toLocaleDateString("pt-BR")}`;
      const pin = await askPin({
        title: "PIN do arquivo",
        message: `Este backup foi exportado${when}. Informe o PIN que estava em uso naquele dia — se você trocou o PIN do app depois disso, use o PIN antigo. Se o arquivo veio de outro integrante, use o PIN dele.`,
        confirmLabel: "Abrir",
        validate: async (value) => {
          try {
            decrypted = await decryptBackup(value, data);
            return null;
          } catch (err) {
            return "PIN incorreto ou arquivo corrompido.";
          }
        },
      });
      if (!pin || decrypted === null) return;
      try {
        data = JSON.parse(decrypted);
      } catch (error) {
        showToast("Erro ao processar", "error");
        return;
      }
    }

    if (!data || (typeof data !== "object")) {
      showToast("Formato inválido", "error");
      return;
    }
    if (!Array.isArray(data) && !Array.isArray(data.transactions)) {
      showToast("Formato inválido", "error");
      return;
    }
    showDataOffer(data, { source: "file", exportedAt: data.exportedAt || exportedAtOuter });
  };
  reader.readAsText(file);
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

  // Dois quadros: o loader aparece, troca o tema e redesenha os gráficos.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      state.theme = nextTheme;
      applyTheme();
      saveTheme();
      if (state.userProfile.name) render();
      requestAnimationFrame(() => loader.classList.remove("active"));
    })
  );
}

function getFilteredTransactions() {
  const { month, year, category, person } = state.filters;
  return getMonthBucket(year, month).list.filter(
    (t) =>
      (category === "all" || t.category === category) &&
      (person === "all" || t.person === person)
  );
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

// ── DESEMPENHO ──
// Índice por mês ("AAAA-MM" -> lançamentos e totais), construído em UMA
// passada e reaproveitado por filtros, timeline, previsão e conquistas.
// É invalidado a cada render() e a cada saveData(): nunca fica desatualizado.
const dataCache = { months: null, series: null };

function invalidateDataCache() {
  dataCache.months = null;
  dataCache.series = null;
}

function getMonthBuckets() {
  if (dataCache.months) return dataCache.months;
  const months = new Map();
  for (const t of state.transactions) {
    if (!t || typeof t.date !== "string") continue;
    const key = t.date.slice(0, 7);
    let b = months.get(key);
    if (!b) {
      b = { list: [], income: 0, expense: 0 };
      months.set(key, b);
    }
    b.list.push(t);
    if (t.type === "income") b.income += t.amount;
    else if (t.type === "expense") b.expense += t.amount;
  }
  dataCache.months = months;
  return months;
}

const EMPTY_BUCKET = Object.freeze({ list: [], income: 0, expense: 0 });

function getMonthBucket(year, month) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  return getMonthBuckets().get(key) || EMPTY_BUCKET;
}

// Só a aba visível é desenhada; as outras ficam marcadas e são desenhadas
// ao serem abertas (a troca de aba continua instantânea).
let activeView = "dashboard";
const dirtyViews = new Set();

// Agrupa vários pedidos de render (ex.: rajada de mensagens da
// sincronização) em um único desenho no próximo quadro.
let renderScheduled = false;
function requestRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => {
    renderScheduled = false;
    render();
  });
}

function renderView(view, filtered, summary) {
  if (view === "dashboard") {
    renderCharts(filtered, summary);
    renderInsights(filtered, summary);
    renderHealthBars(summary);
    renderTimeline();
    renderForecast();
  } else if (view === "goals") {
    renderGoals();
    renderAchievements();
  } else if (view === "management") {
    renderTransactions(filtered);
  }
  dirtyViews.delete(view);
}

function showView(view) {
  activeView = view;
  if (dirtyViews.has(view)) {
    const filtered = getFilteredTransactions();
    renderView(view, filtered, calculateSummary(filtered));
  }
}

// ── Limpar filtros: volta ao padrão (mês/ano atuais, tudo selecionado) ──
function getDefaultFilters() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear(), category: "all", person: "all" };
}

function updateClearFiltersButton() {
  const btn = document.getElementById("btnClearFilters");
  if (!btn) return;
  const def = getDefaultFilters();
  btn.disabled = Object.keys(def).every((k) => state.filters[k] === def[k]);
}

function clearFilters() {
  state.filters = getDefaultFilters();
  populateYearFilter();
  document.getElementById("filterMonth").value = String(state.filters.month);
  document.getElementById("filterYear").value = String(state.filters.year);
  document.getElementById("filterCategory").value = "all";
  document.getElementById("filterPerson").value = "all";
  render();
  showToast("Filtros limpos");
}

function render() {
  invalidateDataCache();
  populateYearFilter();
  updateClearFiltersButton();
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

  ["dashboard", "goals", "management"].forEach((v) => dirtyViews.add(v));
  renderView(activeView, filtered, summary);
}

// ── TRANSAÇÕES FIXAS: PROJEÇÃO DOS PRÓXIMOS MESES ──
// Fixos NÃO são lançados sozinhos: a cada mês após o último lançamento de
// uma série, aparece um item "previsto" que o usuário confirma com um clique.
// Previstos não entram nos totais reais, apenas na visão "Próximos meses".
function recurringSeriesKey(t) {
  return `${t.person}-${t.type}-${String(t.description).trim().toLowerCase()}`;
}

function monthIndex(dateStr) {
  const [y, m] = dateStr.split("-").map(Number);
  return y * 12 + (m - 1);
}

// Último lançamento de cada série; a série só segue ativa se esse último
// ainda estiver marcado como fixo (desmarcar encerra a recorrência).
function getActiveRecurringSeries() {
  if (dataCache.series) return dataCache.series;
  const latest = new Map();
  state.transactions.forEach((t) => {
    if (!t.date || !t.description) return;
    const key = recurringSeriesKey(t);
    const current = latest.get(key);
    if (!current || t.date > current.date) latest.set(key, t);
  });
  dataCache.series = [...latest.values()].filter((t) => t.isRecurring);
  return dataCache.series;
}

function getProjectedForMonth(year, month) {
  const target = year * 12 + month;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const ym = `${year}${String(month + 1).padStart(2, "0")}`;
  return getActiveRecurringSeries()
    .filter((t) => target > monthIndex(t.date))
    .map((t) => {
      const day = Math.min(Number(t.date.slice(8, 10)) || 1, lastDay);
      const root = t.recurringRoot || t.id;
      return {
        ...t,
        // ID determinístico: se os dois aparelhos confirmarem o mesmo
        // previsto, a sincronização não duplica o lançamento.
        id: `rec_${root}_${ym}`,
        recurringRoot: root,
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        isProjected: true,
      };
    });
}

function getFilteredProjected() {
  return getProjectedForMonth(state.filters.year, state.filters.month).filter(
    (t) =>
      (state.filters.category === "all" || t.category === state.filters.category) &&
      (state.filters.person === "all" || t.person === state.filters.person)
  );
}

function confirmProjected(ids) {
  const wanted = new Set(Array.isArray(ids) ? ids : [ids]);
  const items = getFilteredProjected().filter((t) => wanted.has(t.id));
  if (!items.length) return;
  items.forEach((p) => {
    const { isProjected, ...transaction } = p;
    if (state.transactions.some((t) => t.id === transaction.id)) return;
    state.transactions.push(transaction);
    sendData({ type: "transaction_update", data: transaction });
  });
  saveData();
  render();
  showToast(
    items.length > 1 ? `${items.length} lançamentos confirmados` : "Lançamento confirmado"
  );
}

function confirmAllProjected() {
  confirmProjected(getFilteredProjected().map((t) => t.id));
}

// Visão estilo "fatura": mês atual + próximos meses com o saldo previsto.
let forecastMonths = 6;
let forecastSelected = 0;

function buildForecast() {
  const now = new Date();
  const personOk = (t) =>
    state.filters.person === "all" || t.person === state.filters.person;
  const months = [];
  for (let i = 0; i < forecastMonths; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const real = getMonthBucket(y, m).list.filter(personOk);
    const projected = getProjectedForMonth(y, m).filter(personOk);
    const items = [...real, ...projected].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    const sum = (type) =>
      items.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);
    const income = sum("income");
    const expense = sum("expense");
    months.push({
      year: y,
      month: m,
      label: `${MONTHS[m].slice(0, 3)}${y !== now.getFullYear() ? " " + String(y).slice(2) : ""}`,
      items,
      income,
      expense,
      balance: income - expense,
      projectedCount: projected.length,
    });
  }
  return months;
}

function renderForecast() {
  const chips = document.getElementById("forecastChips");
  const detail = document.getElementById("forecastDetail");
  if (!chips || !detail) return;
  const months = buildForecast();
  if (forecastSelected >= months.length) forecastSelected = 0;

  chips.innerHTML = months
    .map(
      (m, i) => `
      <button type="button" class="forecast-chip ${i === forecastSelected ? "active" : ""}"
        data-index="${i}" aria-pressed="${i === forecastSelected}">
        <span class="forecast-chip-month">${i === 0 ? "Este mês" : escapeHtml(m.label)}</span>
        <span class="forecast-chip-value ${m.balance >= 0 ? "income" : "expense"}">${formatCurrency(m.balance)}</span>
      </button>`
    )
    .join("");

  const sel = months[forecastSelected];
  const rows = sel.items.length
    ? sel.items
        .map((t) => {
          const cat = CATEGORIES[t.category] || { label: t.category, icon: "bi-tag" };
          const badge = t.isProjected
            ? '<span class="forecast-badge projected">Previsto</span>'
            : t.isRecurring
            ? '<span class="forecast-badge fixed">Fixo</span>'
            : '<span class="forecast-badge scheduled">Lançado</span>';
          return `
          <div class="forecast-row ${t.isProjected ? "is-projected" : ""}">
            <span class="forecast-row-day">${t.date.slice(8, 10)}</span>
            <i class="bi ${escapeHtml(cat.icon)} forecast-row-icon"></i>
            <span class="forecast-row-desc">${escapeHtml(t.description)}</span>
            ${badge}
            <span class="forecast-row-val ${t.type === "income" ? "income" : "expense"}">
              ${t.type === "income" ? "+" : "-"} ${formatCurrency(t.amount)}
            </span>
          </div>`;
        })
        .join("")
    : '<div class="forecast-empty">Nada previsto para este mês.</div>';

  detail.innerHTML = `
    <div class="forecast-totals">
      <div><span>Receitas</span><strong class="income">${formatCurrency(sel.income)}</strong></div>
      <div><span>Despesas</span><strong class="expense">${formatCurrency(sel.expense)}</strong></div>
      <div><span>Saldo previsto</span><strong class="${sel.balance >= 0 ? "income" : "expense"}">${formatCurrency(sel.balance)}</strong></div>
    </div>
    <div class="forecast-list">${rows}</div>`;
}

function renderTransactions(list) {
  const container = document.getElementById("transactionsList");
  const projected = getFilteredProjected();
  const projectedHtml = projected.length
    ? `
    <div class="projected-group">
      <div class="projected-group-header">
        <span><i class="bi bi-calendar-event"></i> Fixos previstos para este mês (${projected.length})</span>
        <button type="button" class="btn btn-sm btn-outline" onclick="confirmAllProjected()">
          Lançar todos
        </button>
      </div>
      ${projected
        .map((t) => {
          const cat = CATEGORIES[t.category] || { label: t.category, icon: "bi-tag" };
          const typeClass = t.type === "income" ? "income" : "expense";
          return `
          <div class="transaction-item is-projected">
            <div class="transaction-left">
              <div class="t-icon-box ${typeClass}"><i class="bi ${escapeHtml(cat.icon)}"></i></div>
              <div class="t-details">
                <h4>${escapeHtml(t.description)}</h4>
                <div class="t-meta">
                  <span>${escapeHtml(cat.label)}</span>
                  <span class="t-dot"></span>
                  <span>${escapeHtml(getPersonLabel(t.person))}</span>
                  <span class="t-dot"></span>
                  <span>${escapeHtml(formatDate(t.date))}</span>
                </div>
              </div>
            </div>
            <div class="transaction-right">
              <span class="t-amount ${typeClass}">
                ${t.type === "income" ? "+" : "-"} ${formatCurrency(t.amount)}
              </span>
              <button type="button" class="btn btn-sm btn-primary" onclick="confirmProjected('${safeJsArg(t.id)}')">
                Lançar
              </button>
            </div>
          </div>`;
        })
        .join("")}
    </div>`
    : "";

  if (list.length === 0) {
    if (projectedHtml) {
      container.innerHTML = projectedHtml;
      return;
    }
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

  container.innerHTML = projectedHtml + sorted
    .map((t) => {
      const catData = CATEGORIES[t.category] || {
        label: t.category,
        icon: "bi-tag",
      };
      const personLabel = getPersonLabel(t.person);
      const typeClass = t.type === "income" ? "income" : "expense";

      return `
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="t-icon-box ${typeClass}">
            <i class="bi ${escapeHtml(catData.icon)}"></i>
          </div>
          <div class="t-details">
            <h4>${escapeHtml(t.description)}</h4>
            <div class="t-meta">
              <span class="cat-dot" style="background:${escapeHtml(
                catData.color || "#6b7280"
              )}"></span>
              <span>${escapeHtml(catData.label)}</span>
              <span class="t-dot"></span>
              <span>${escapeHtml(personLabel)}</span>
              <span class="t-dot"></span>
              <span>${escapeHtml(formatDate(t.date))}</span>
              ${
                t.isRecurring
                  ? '<i class="bi bi-arrow-repeat" title="Recorrente"></i>'
                  : ""
              }
            </div>
          </div>
        </div>
        <div class="transaction-right">
          <span class="t-amount ${typeClass}">
            ${t.type === "income" ? "+" : "-"} ${formatCurrency(t.amount)}
          </span>
          <div class="t-actions">
            <button class="btn-icon-sm" onclick="editTransaction('${safeJsArg(
              t.id
            )}')"><i class="bi bi-pencil"></i></button>
            <button class="btn-icon-sm delete" onclick="confirmDelete('${safeJsArg(
              t.id
            )}')"><i class="bi bi-trash"></i></button>
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
            <span>${escapeHtml(
              CATEGORIES[cat] ? CATEGORIES[cat].label : cat
            )}</span>
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

  const container = document.getElementById(containerId);
  if (container) container.innerHTML = html;
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

  // Cada integrante tem cor fixa (a mesma do avatar na Gerência).
  const personMap = {};
  Object.keys(people).forEach((k) => {
    personMap[k] = { label: getPersonLabel(k), color: getMemberColor(k) };
  });
  renderPieChart(
    "personChart",
    "personLegend",
    people,
    personMap,
    PALETTE_PERSONS
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
  // Mesma regra da projeção: o último lançamento de cada série (pessoa +
  // tipo + descrição), apenas se ainda estiver marcado como fixo.
  const uniqueRecurringList = getActiveRecurringSeries();

  const calcRecurring = (personKey) => {
    const pList = uniqueRecurringList.filter(
      (t) => t.person === personKey
    );
    const inc = pList
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = pList
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { inc, exp, bal: inc - exp };
  };

  const members = getMembers();

  const memberForecastHtml = members
    .map((m) => {
      const next = calcRecurring(m.key);
      return `
        <div class="indicator-box highlight">
            <h6>${escapeHtml(m.name)}</h6>
            <div class="indicator-row">
                <span>Fixos (+):</span>
                <span class="indicator-mini-val text-inc">${formatCurrency(
                  next.inc
                )}</span>
            </div>
            <div class="indicator-row">
                <span>Fixos (-):</span>
                <span class="indicator-mini-val text-exp">${formatCurrency(
                  next.exp
                )}</span>
            </div>
            <hr style="margin: 5px 0; border-color: var(--border)">
            <div class="indicator-row">
                <span>Sobra:</span>
                <span class="indicator-mini-val" style="color: ${
                  next.bal >= 0 ? "var(--text-primary)" : "var(--danger)"
                }">
                    ${formatCurrency(next.bal)}
                </span>
            </div>
        </div>`;
    })
    .join("");

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
        ${memberForecastHtml}
    </div>
  `;

  members.forEach((m) =>
    renderPersonSpecificTab(`detail-${m.key}`, m.key, list)
  );
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

        let label = isSimpleMap ? mapping[key] : mapping[key]?.label;
        if (!label) label = key;

        return `<circle cx="50" cy="50" r="40" fill="none" stroke="${escapeHtml(
          color
        )}" stroke-width="20" 
              stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${offset}" class="donut-segment">
              <title>${escapeHtml(label)}: ${formatCurrency(val)}</title></circle>`;
      })
      .join("")}
  </svg>`;
  container.innerHTML = svg;

  if (legend) {
    legend.innerHTML = entries
      .map(([key, val], i) => {
        let label = isSimpleMap ? mapping[key] : mapping[key]?.label;
        if (!label) label = key;

        const color =
          (!isSimpleMap && mapping[key]?.color) || palette[i % palette.length];
        return `<div class="legend-item"><span class="legend-color" style="background:${escapeHtml(
          color
        )}"></span>${escapeHtml(label)} (${Math.round(
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
    const catLabel = escapeHtml(CATEGORIES[topCat[0]]?.label || topCat[0]);
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

  // Termina no mês selecionado no filtro (permite ver históricos antigos).
  const now = new Date(state.filters.year, state.filters.month, 1);
  const pts = [];
  for (let i = timelineMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth(),
      y = d.getFullYear();
    const { income: inc, expense: exp } = getMonthBucket(y, m);
    const label =
      y === state.filters.year
        ? MONTHS[m].slice(0, 3)
        : `${MONTHS[m].slice(0, 3)}/${String(y).slice(2)}`;
    pts.push({ label, inc, exp });
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
  // Lançamentos de um integrante que não existe neste dispositivo (ex.: vindo
  // da sincronização) mantêm o responsável original ao serem editados.
  const perSel = document.getElementById("txPerson");
  // "Compartilhado" (formato antigo) precisa ser reatribuído a um integrante.
  const isLegacyShared = transaction?.person === SHARED_PERSON_KEY;
  const personKey = isLegacyShared ? "eu" : transaction?.person || "eu";
  document.getElementById("txPersonHint").textContent = isLegacyShared
    ? 'Este lançamento era "Compartilhado". Escolha o responsável.'
    : "";
  perSel.querySelectorAll("option[data-temp]").forEach((o) => o.remove());
  if (![...perSel.options].some((o) => o.value === personKey)) {
    perSel.insertAdjacentHTML(
      "beforeend",
      `<option value="${escapeHtml(personKey)}" data-temp="1">${escapeHtml(
        getPersonLabel(personKey)
      )}</option>`
    );
  }
  perSel.value = personKey;
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
  }"></i> <span></span>`;
  toast.querySelector("span").textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function renderCategoryPickerTx() {
  const panel = document.getElementById("categoryPickerPanel");
  if (!panel) return;
  panel.innerHTML = Object.entries(CATEGORIES)
    .map(
      ([key, cat]) => `
      <button type="button" class="category-picker-item" data-key="${escapeHtml(
        key
      )}">
        <span class="category-picker-dot" style="background:${escapeHtml(
          cat.color || "#6b7280"
        )}"></span>
        <i class="bi ${escapeHtml(cat.icon)}"></i>
        <span>${escapeHtml(cat.label)}</span>
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

// Anos do filtro: do lançamento mais antigo ao mais futuro (com margem),
// para permitir consultar históricos antigos e lançamentos agendados.
function populateYearFilter() {
  const ySel = document.getElementById("filterYear");
  const now = new Date().getFullYear();
  const years = [...getMonthBuckets().keys()]
    .map((k) => Number(k.slice(0, 4)))
    .filter((y) => y >= 1990 && y <= 2100);
  const min = Math.min(now - 2, state.filters.year, ...years);
  const max = Math.max(now + 3, state.filters.year, ...years);
  const key = `${min}-${max}`;
  if (ySel.dataset.range === key) return;
  ySel.dataset.range = key;
  let html = "";
  for (let y = min; y <= max; y++) html += `<option value="${y}">${y}</option>`;
  ySel.innerHTML = html;
  ySel.value = String(state.filters.year);
}

function setupFilters() {
  const catSel = document.getElementById("txCategory");
  const filterCat = document.getElementById("filterCategory");
  catSel.innerHTML = "";
  filterCat.innerHTML = "";

  Object.entries(CATEGORIES).forEach(([k, v]) => {
    const option = `<option value="${escapeHtml(k)}">${escapeHtml(
      v.label
    )}</option>`;
    catSel.innerHTML += option;
    filterCat.innerHTML += option;
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
    const option = `<option value="${escapeHtml(k)}">${escapeHtml(v)}</option>`;
    perSel.innerHTML += option;
    filterPer.innerHTML += option;
    goalPer.innerHTML += option;
  });
  filterPer.insertAdjacentHTML(
    "afterbegin",
    '<option value="all">Geral (todos)</option>'
  );

  if (state.filters.person !== "all" && !PERSONS[state.filters.person]) {
    state.filters.person = "all";
  }
  filterCat.value = state.filters.category;
  filterPer.value = state.filters.person;
}

function init() {
  if (appInitialized) return;
  appInitialized = true;

  loadCustomCategories();
  loadData();
  loadGoals();
  loadProfile();

  setupFilters();

  const mSel = document.getElementById("filterMonth");
  MONTHS.forEach(
    (m, i) =>
      (mSel.innerHTML += `<option value="${i}" ${
        i === state.filters.month ? "selected" : ""
      }>${m}</option>`)
  );

  populateYearFilter();

  document.getElementById("btnFinishOnboarding").onclick = finishOnboarding;
  document.getElementById("setupMemberCount").onchange =
    renderOnboardingMemberFields;

  document.getElementById("btnAddMember").onclick = addMember;
  document.getElementById("newMemberName").onkeydown = (e) => {
    if (e.key === "Enter") addMember();
  };
  document.getElementById("btnImportMenu").onclick = triggerImport;
  document.getElementById("importFile").onchange = importData;
  document.getElementById("btnExportMenu").onclick = exportData;

  document.getElementById("btnSyncMenu").onclick = () => {
    ensurePeer().catch(() => {});
    renderConnectedPeer();
    document.getElementById("syncModal").classList.add("active");
  };
  document.getElementById("btnDisconnectPeer").onclick = () => {
    if (conn) conn.close();
  };
  document.getElementById("btnTermsMenu").onclick = (e) => {
    e.preventDefault();
    openTermsModal("read");
  };

  document.getElementById("forecastChips").onclick = (e) => {
    const chip = e.target.closest(".forecast-chip");
    if (!chip) return;
    forecastSelected = Number(chip.dataset.index) || 0;
    renderForecast();
  };
  document.getElementById("forecastPeriodSelect").onchange = (e) => {
    forecastMonths = parseInt(e.target.value) || 6;
    renderForecast();
  };

  // Sai do lobby ao fechar a aba: o nome não fica exposto sem necessidade.
  window.addEventListener("pagehide", () => removeFromLobby());

  // Esc fecha o modal aberto (exceto os que exigem uma decisão).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = [...document.querySelectorAll(".modal-overlay.active")].pop();
    if (!open || open.dataset.mode === "require") return;
    const closeBtn = open.querySelector(".btn-close, [data-dismiss]");
    if (closeBtn && closeBtn.offsetParent !== null) closeBtn.click();
  });
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
  document.getElementById("btnForceSync").onclick = sendDataOffer;
  document.getElementById("btnSyncStartSend").onclick = sendDataOffer;
  document.getElementById("btnSyncStartLater").onclick = closeSyncStartModal;
  document.getElementById("btnAcceptDataOffer").onclick = acceptDataOffer;
  document.getElementById("btnDeclineDataOffer").onclick = declineDataOffer;
  document.getElementById("btnAutoBackupMenu").onclick = (e) => {
    e.preventDefault();
    openAutoBackupModal();
  };
  document.getElementById("btnCloseAutoBackup").onclick = () =>
    document.getElementById("autoBackupModal").classList.remove("active");
  document.getElementById("btnRestoreAutoBackup").onclick = restoreAutoBackup;

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
      showView(target);
    };
  });

  // As abas são recriadas quando os integrantes mudam: delegação de evento.
  document.getElementById("flowTabs").onclick = (e) => {
    const tab = e.target.closest(".card-tab-btn");
    if (tab) showFlowTab(tab.dataset.target);
  };

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

  document.getElementById("btnAddCategory").onclick = addCustomCategory;
  document.getElementById("newCategoryName").onkeydown = (e) => {
    if (e.key === "Enter") addCustomCategory();
  };
  renderCategoriesSection();
  setupCollapsibleSections();

  document.getElementById("categoryPickerTrigger").onclick = (e) => {
    e.stopPropagation();
    document.getElementById("categoryPickerTx").classList.toggle("open");
  };
  document.addEventListener("click", (e) => {
    const picker = document.getElementById("categoryPickerTx");
    if (picker && !picker.contains(e.target)) picker.classList.remove("open");
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (activeView === "dashboard") renderTimeline();
    }, 150);
  });

  document.getElementById("timelinePeriodSelect").onchange = (e) => {
    timelineMonths = parseInt(e.target.value);
    renderTimeline();
  };

  document.getElementById("btnClearFilters").onclick = clearFilters;

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

  renderMembersList();

  if (state.userProfile.name) {
    render();
  }
}

document.getElementById("btnDeleteAccountMenu").onclick = () => {
  document.getElementById("deleteAccountModal").classList.add("active");
};

document.getElementById("btnCancelDeleteAccount").onclick = () => {
  document.getElementById("deleteAccountModal").classList.remove("active");
  // Quem recusou os termos e desistiu de excluir volta para o aceite.
  if (state.userProfile.name && !getTermsAcceptance()) openTermsModal("require");
};

document.getElementById("btnConfirmDeleteAccount").onclick =
  wipeAllDataAndRestart;

window.addEventListener("DOMContentLoaded", bootstrap);
