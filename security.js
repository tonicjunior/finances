// ── SEGURANÇA DA INFORMAÇÃO / LGPD ──
// Os dados financeiros ficam em um "cofre" cifrado com AES-GCM (256 bits)
// no localStorage. A chave é derivada do PIN do usuário via PBKDF2-SHA256.
//
// Regras:
// - O PIN nunca é salvo. A chave derivada fica apenas em memória e é
//   não-exportável (CryptoKey com extractable = false).
// - Os dados descriptografados existem apenas em memória enquanto o app
//   está aberto; tudo o que é persistido está cifrado.
// - Os backups exportados também são cifrados (com salt próprio).
// - Sem o PIN não há como recuperar os dados: não existe "porta dos fundos".

const VAULT_STORAGE_KEY = "financas-pro-vault";
const VAULT_FORMAT = "financas-pro-vault";
const EXPORT_FORMAT = "financas-pro-backup-cifrado";
const CRYPTO_VERSION = 1;
const PBKDF2_ITERATIONS = 600000; // recomendação OWASP para PBKDF2-HMAC-SHA256
const PBKDF2_MIN_ITERATIONS = 100000;
const PBKDF2_MAX_ITERATIONS = 5000000; // evita travar o navegador com arquivos adulterados
const PIN_MIN_LENGTH = 4;
const PIN_MAX_LENGTH = 64;

// Chaves guardadas DENTRO do cofre cifrado (nunca em texto puro).
const DEVICE_KEY_STORAGE = "financas-pro-device-key";
const P2P_PROTOCOL = "fp-e2e-1";

// Chaves que antes ficavam em texto puro no localStorage e agora vão para o cofre.
function getSensitiveStorageKeys() {
  return [
    "financas-pro-data",
    "financas-pro-profile",
    "financas-pro-goals",
    "financas-pro-custom-categories",
    "financas-pro-has-synced",
  ];
}

const SecureCrypto = (() => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  function fromBase64(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function randomBytes(length) {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  async function deriveKey(pin, salt, iterations) {
    const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(pin.normalize("NFKC")),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  // O "additionalData" amarra o texto cifrado ao formato: um backup não
  // pode ser usado como cofre e vice-versa.
  function aad(format) {
    return encoder.encode(`${format}:v${CRYPTO_VERSION}`);
  }

  async function encrypt(key, plaintext, format) {
    const iv = randomBytes(12);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: aad(format) },
      key,
      encoder.encode(plaintext)
    );
    return { iv: toBase64(iv), ct: toBase64(ciphertext) };
  }

  async function decrypt(key, ivB64, ctB64, format) {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(ivB64), additionalData: aad(format) },
      key,
      fromBase64(ctB64)
    );
    return decoder.decode(plaintext);
  }

  return { toBase64, fromBase64, randomBytes, deriveKey, encrypt, decrypt };
})();

function isCryptoAvailable() {
  return !!(window.crypto && window.crypto.subtle && window.isSecureContext);
}

function validateIterations(iterations) {
  const n = Number(iterations);
  if (
    !Number.isInteger(n) ||
    n < PBKDF2_MIN_ITERATIONS ||
    n > PBKDF2_MAX_ITERATIONS
  ) {
    throw new Error("Parâmetros de criptografia inválidos");
  }
  return n;
}

// Retorna uma mensagem de erro ou null se o PIN for aceitável.
// PINs simples (1234, 0000...) são permitidos: o nível é apenas informado
// pelo medidor de força (getPinStrength), sem bloquear o usuário.
function validateNewPin(pin, confirmation) {
  if (!pin || pin.length < PIN_MIN_LENGTH)
    return `O PIN deve ter pelo menos ${PIN_MIN_LENGTH} caracteres.`;
  if (pin.length > PIN_MAX_LENGTH)
    return `O PIN deve ter no máximo ${PIN_MAX_LENGTH} caracteres.`;
  if (pin !== confirmation) return "Os PINs informados não coincidem.";
  return null;
}

const COMMON_PINS = [
  "senha", "senha123", "password", "qwerty", "abc123", "123123", "112233",
  "121212", "102030", "147258", "159753", "251515", "696969", "teste",
];

// Nível de força do PIN: 0 (vazio), 1 baixa, 2 média, 3 alta.
function getPinStrength(pin) {
  if (!pin) return { level: 0, label: "" };
  const lower = pin.toLowerCase();
  const trivial =
    /^(.)\1+$/.test(pin) ||
    "01234567890".includes(pin) ||
    "09876543210".includes(pin) ||
    "abcdefghijklmnopqrstuvwxyz".includes(lower) ||
    "zyxwvutsrqponmlkjihgfedcba".includes(lower) ||
    COMMON_PINS.includes(lower);

  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(pin)
  ).length;

  let level = 1;
  if (!trivial && pin.length >= 6) {
    if ((pin.length >= 12 && classes >= 3) || pin.length >= 16) level = 3;
    else if ((pin.length >= 8 && classes >= 2) || pin.length >= 10) level = 2;
  }
  const labels = { 1: "Baixa", 2: "Média", 3: "Alta" };
  const hints = {
    1: "Fácil de adivinhar. Use mais caracteres misturando letras e números.",
    2: "Razoável. Adicione símbolos ou mais caracteres para ficar mais forte.",
    3: "Boa proteção.",
  };
  return { level, label: labels[level], hint: hints[level] };
}

// Substituto do localStorage para dados sensíveis: leitura e escrita são
// síncronas em memória, e cada alteração regrava o cofre cifrado em fila.
const secureStorage = {
  _data: {},
  _key: null,
  _salt: null,
  _iterations: PBKDF2_ITERATIONS,
  _queue: Promise.resolve(),

  getItem(name) {
    return Object.prototype.hasOwnProperty.call(this._data, name)
      ? this._data[name]
      : null;
  },

  setItem(name, value) {
    this._data[name] = String(value);
    this._persist();
  },

  removeItem(name) {
    delete this._data[name];
    this._persist();
  },

  isUnlocked() {
    return !!this._key;
  },

  hasVault() {
    return !!localStorage.getItem(VAULT_STORAGE_KEY);
  },

  hasLegacyPlainData() {
    return getSensitiveStorageKeys().some(
      (k) => localStorage.getItem(k) !== null
    );
  },

  // Aguarda todas as gravações pendentes.
  flush() {
    return this._queue;
  },

  // Várias alterações na mesma tarefa (ex.: salvar lançamento + metas +
  // perfil) viram UMA gravação cifrada: a cópia é tirada quando a gravação
  // roda, já com todas as alterações. Nada é adiado com timer.
  _persist() {
    if (!this._key) return this._queue;
    if (this._pendingWrite) return this._queue;
    this._pendingWrite = true;
    this._queue = this._queue
      .then(async () => {
        this._pendingWrite = false;
        if (!this._key) return;
        const snapshot = JSON.stringify(this._data);
        const key = this._key;
        const salt = this._salt;
        const iterations = this._iterations;
        const { iv, ct } = await SecureCrypto.encrypt(key, snapshot, VAULT_FORMAT);
        localStorage.setItem(
          VAULT_STORAGE_KEY,
          JSON.stringify({
            format: VAULT_FORMAT,
            v: CRYPTO_VERSION,
            kdf: {
              name: "PBKDF2-SHA256",
              iterations,
              salt: SecureCrypto.toBase64(salt),
            },
            iv,
            ct,
          })
        );
      })
      .catch((err) => {
        console.error("Falha ao gravar o cofre cifrado:", err);
        if (typeof showToast === "function") {
          showToast("Não foi possível salvar os dados cifrados", "error");
        }
      });
    return this._queue;
  },

  _readVault() {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) throw new Error("Cofre não encontrado");
    const vault = JSON.parse(raw);
    if (vault.format !== VAULT_FORMAT || vault.v !== CRYPTO_VERSION) {
      throw new Error("Formato de cofre desconhecido");
    }
    return vault;
  },

  // Lança erro se o PIN estiver incorreto.
  async unlock(pin) {
    const vault = this._readVault();
    const salt = SecureCrypto.fromBase64(vault.kdf.salt);
    const iterations = validateIterations(vault.kdf.iterations);
    const key = await SecureCrypto.deriveKey(pin, salt, iterations);
    const plaintext = await SecureCrypto.decrypt(key, vault.iv, vault.ct, VAULT_FORMAT);
    this._data = JSON.parse(plaintext) || {};
    this._key = key;
    this._salt = salt;
    this._iterations = iterations;
  },

  async verifyPin(pin) {
    try {
      const vault = this._readVault();
      const key = await SecureCrypto.deriveKey(
        pin,
        SecureCrypto.fromBase64(vault.kdf.salt),
        validateIterations(vault.kdf.iterations)
      );
      await SecureCrypto.decrypt(key, vault.iv, vault.ct, VAULT_FORMAT);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Cria um cofre novo (primeiro acesso) com os dados informados.
  async create(pin, initialData = this._data) {
    this._salt = SecureCrypto.randomBytes(16);
    this._iterations = PBKDF2_ITERATIONS;
    this._key = await SecureCrypto.deriveKey(pin, this._salt, this._iterations);
    this._data = { ...initialData };
    await this._persist();
  },

  // Move os dados antigos (texto puro) para o cofre e apaga as cópias abertas.
  async migrateLegacy(pin) {
    const legacy = {};
    getSensitiveStorageKeys().forEach((k) => {
      const value = localStorage.getItem(k);
      if (value !== null) legacy[k] = value;
    });
    await this.create(pin, legacy);
    if (!this.hasVault()) throw new Error("Falha ao criar o cofre");
    getSensitiveStorageKeys().forEach((k) => localStorage.removeItem(k));
  },

  // Recifra tudo com um novo salt e uma chave derivada do novo PIN.
  async changePin(currentPin, newPin) {
    if (!(await this.verifyPin(currentPin))) {
      throw new Error("PIN atual incorreto");
    }
    const salt = SecureCrypto.randomBytes(16);
    const key = await SecureCrypto.deriveKey(newPin, salt, PBKDF2_ITERATIONS);
    await this._queue;
    this._salt = salt;
    this._key = key;
    this._iterations = PBKDF2_ITERATIONS;
    await this._persist();
  },

  wipe() {
    localStorage.removeItem(VAULT_STORAGE_KEY);
    getSensitiveStorageKeys().forEach((k) => localStorage.removeItem(k));
    this._data = {};
    this._key = null;
    this._salt = null;
  },
};

// ── Backups cifrados ──
function isEncryptedBackup(obj) {
  return !!(obj && obj.format === EXPORT_FORMAT && obj.iv && obj.ct && obj.kdf);
}

async function encryptBackup(pin, plaintext) {
  const salt = SecureCrypto.randomBytes(16);
  const key = await SecureCrypto.deriveKey(pin, salt, PBKDF2_ITERATIONS);
  const { iv, ct } = await SecureCrypto.encrypt(key, plaintext, EXPORT_FORMAT);
  return {
    format: EXPORT_FORMAT,
    v: CRYPTO_VERSION,
    exportedAt: new Date().toISOString(),
    kdf: {
      name: "PBKDF2-SHA256",
      iterations: PBKDF2_ITERATIONS,
      salt: SecureCrypto.toBase64(salt),
    },
    cipher: "AES-GCM-256",
    iv,
    ct,
  };
}

// Lança erro se o PIN estiver incorreto ou o arquivo estiver corrompido.
async function decryptBackup(pin, backup) {
  if (backup.v !== CRYPTO_VERSION) throw new Error("Versão de backup não suportada");
  const key = await SecureCrypto.deriveKey(
    pin,
    SecureCrypto.fromBase64(backup.kdf.salt),
    validateIterations(backup.kdf.iterations)
  );
  return SecureCrypto.decrypt(key, backup.iv, backup.ct, EXPORT_FORMAT);
}

// ── Criptografia ponta a ponta entre integrantes (P2P) ──
// Cada dispositivo tem um par de chaves ECDH P-256. A chave privada fica
// apenas dentro do cofre cifrado; a pública é enviada ao outro dispositivo.
// Com a pública do outro lado, cada um deriva sozinho a MESMA chave de
// sessão AES-GCM (ECDH + HKDF): nenhuma senha precisa ser combinada por
// mensagem ou de boca a boca, e nem o servidor de sinalização nem o lobby
// conseguem ler os dados sincronizados.
//
// Recomendação: compartilhe o ID de conexão diretamente com o integrante
// (por um canal de confiança). O lobby é apenas uma facilidade.
const PeerCrypto = (() => {
  const ECDH = { name: "ECDH", namedCurve: "P-256" };
  const encoder = new TextEncoder();
  const MESSAGE_FORMAT = "financas-pro-p2p";
  let identityPromise = null;

  // Ordena as duas chaves para que ambos os lados calculem o mesmo valor.
  function orderedPair(pubA, pubB) {
    return pubA < pubB ? [pubA, pubB] : [pubB, pubA];
  }

  async function sha256(bytes) {
    return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  }

  async function createIdentity() {
    let stored = null;
    try {
      stored = JSON.parse(secureStorage.getItem(DEVICE_KEY_STORAGE) || "null");
    } catch (e) {
      stored = null; // registro corrompido: gera um novo par abaixo
    }

    if (!stored || !stored.privateJwk || !stored.publicKey) {
      const pair = await crypto.subtle.generateKey(ECDH, true, ["deriveBits"]);
      stored = {
        privateJwk: await crypto.subtle.exportKey("jwk", pair.privateKey),
        publicKey: SecureCrypto.toBase64(
          await crypto.subtle.exportKey("raw", pair.publicKey)
        ),
        createdAt: new Date().toISOString(),
      };
      secureStorage.setItem(DEVICE_KEY_STORAGE, JSON.stringify(stored));
    }

    // Em memória a chave privada é não-exportável.
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      stored.privateJwk,
      ECDH,
      false,
      ["deriveBits"]
    );
    return {
      privateKey,
      publicKey: stored.publicKey,
    };
  }

  function identity() {
    if (!identityPromise) {
      identityPromise = createIdentity().catch((err) => {
        identityPromise = null;
        throw err;
      });
    }
    return identityPromise;
  }

  function isValidPublicKey(value) {
    if (typeof value !== "string" || value.length > 200) return false;
    try {
      const raw = SecureCrypto.fromBase64(value);
      return raw.length === 65 && raw[0] === 4; // ponto P-256 não comprimido
    } catch (e) {
      return false;
    }
  }

  async function deriveSessionKey(remotePublicKeyB64) {
    if (!isValidPublicKey(remotePublicKeyB64)) {
      throw new Error("Chave pública inválida");
    }
    const me = await identity();
    if (remotePublicKeyB64 === me.publicKey) {
      throw new Error("Chave pública igual à local");
    }
    const remoteKey = await crypto.subtle.importKey(
      "raw",
      SecureCrypto.fromBase64(remotePublicKeyB64),
      ECDH,
      false,
      []
    );
    const shared = await crypto.subtle.deriveBits(
      { name: "ECDH", public: remoteKey },
      me.privateKey,
      256
    );
    const hkdfKey = await crypto.subtle.importKey("raw", shared, "HKDF", false, [
      "deriveKey",
    ]);
    const [first, second] = orderedPair(me.publicKey, remotePublicKeyB64);
    const salt = await sha256(encoder.encode(`${first}|${second}`));
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt,
        info: encoder.encode(`${MESSAGE_FORMAT}:${P2P_PROTOCOL}`),
      },
      hkdfKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptMessage(sessionKey, payload) {
    const { iv, ct } = await SecureCrypto.encrypt(
      sessionKey,
      JSON.stringify(payload),
      MESSAGE_FORMAT
    );
    return { type: "enc", iv, ct };
  }

  // Lança erro se a mensagem foi adulterada ou cifrada com outra chave.
  async function decryptMessage(sessionKey, message) {
    if (typeof message.iv !== "string" || typeof message.ct !== "string") {
      throw new Error("Mensagem cifrada inválida");
    }
    const plaintext = await SecureCrypto.decrypt(
      sessionKey,
      message.iv,
      message.ct,
      MESSAGE_FORMAT
    );
    return JSON.parse(plaintext);
  }

  return {
    identity,
    isValidPublicKey,
    deriveSessionKey,
    encryptMessage,
    decryptMessage,
  };
})();
