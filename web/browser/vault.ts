export type Workspace = {
  config: any;
  runs: any[];
  attempts: any[];
  ledgerRuns: any[];
};
export const emptyWorkspace = (): Workspace => ({
  config: { ai: { defaultProfile: "research", profiles: {} } },
  runs: [],
  attempts: [],
  ledgerRuns: [],
});
type Envelope = {
  version: 1;
  salt: Uint8Array;
  iv: Uint8Array;
  ciphertext: ArrayBuffer;
};
const iterations = 600_000;
async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("birdeye-browser-vault", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("vault");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("Browser storage is unavailable."));
  });
}
async function record(value?: Envelope | null): Promise<Envelope | undefined> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(
        "vault",
        value === undefined ? "readonly" : "readwrite",
      );
      const store = tx.objectStore("vault");
      const request =
        value === undefined
          ? store.get("workspace")
          : value === null
            ? store.delete("workspace")
            : store.put(value, "workspace");
      tx.oncomplete = () =>
        resolve(value === undefined ? request.result : undefined);
      tx.onabort = tx.onerror = () =>
        reject(
          new Error("Could not save browser data. Check available storage."),
        );
    });
  } finally {
    db.close();
  }
}
async function derive(password: string, salt: Uint8Array<ArrayBuffer>) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
export class BrowserVault {
  private key: CryptoKey | null = null;
  private salt = new Uint8Array(16);
  private queue: Promise<void> = Promise.resolve();
  private closed = false;
  static async exists() {
    return !!(await record());
  }
  static async erase() {
    await record(null);
  }
  async open(password: string, create = false) {
    if (!globalThis.isSecureContext || !crypto.subtle)
      throw new Error("Use HTTPS or localhost for encrypted browser storage.");
    const saved = await record();
    if (create && saved)
      throw new Error("A saved workspace already exists. Unlock it instead.");
    if (!create && !saved) throw new Error("No saved workspace exists.");
    if (create && password.length < 12)
      throw new Error("Use a password of at least 12 characters.");
    if (
      saved &&
      (saved.version !== 1 ||
        saved.salt.length !== 16 ||
        saved.iv.length !== 12)
    )
      throw new Error("Unsupported or damaged browser vault.");
    this.salt = saved
      ? new Uint8Array(saved.salt)
      : crypto.getRandomValues(new Uint8Array(16));
    const key = await derive(password, this.salt);
    let data = emptyWorkspace();
    if (saved) {
      try {
        const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: new Uint8Array(saved.iv) },
          key,
          saved.ciphertext,
        );
        data = JSON.parse(new TextDecoder().decode(decrypted));
        if (
          !data.config ||
          !Array.isArray(data.runs) ||
          !Array.isArray(data.attempts) ||
          !Array.isArray(data.ledgerRuns)
        )
          throw new Error();
      } catch {
        throw new Error("Wrong password or damaged browser data.");
      }
    }
    this.key = key;
    this.closed = false;
    if (create) await this.save(data);
    return data;
  }
  save(data: Workspace) {
    if (this.closed || !this.key)
      return Promise.reject(new Error("Workspace is locked."));
    const plaintext = new TextEncoder().encode(JSON.stringify(data)),
      key = this.key,
      salt = this.salt;
    const task = this.queue.then(async () => {
      if (this.closed) throw new Error("Workspace is locked.");
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        plaintext,
      );
      plaintext.fill(0);
      if (this.closed) throw new Error("Workspace is locked.");
      await record({ version: 1, salt, iv, ciphertext });
    });
    this.queue = task.catch(() => {});
    return task;
  }
  async flush() {
    await this.queue;
  }
  close() {
    this.closed = true;
    this.key = null;
  }
}
