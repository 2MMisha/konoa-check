// הצפנה/פענוח סימטריים בצד הלקוח (Web Crypto API) — משמש כדי לשמור את
// טוקן הניהול בריפו כטקסט מוצפן בלבד, שנפתח רק עם הסיסמה של המנהל.
const CRYPTO_PBKDF2_ITERATIONS = 250000;

function bufToB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function b64ToBuf(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

async function deriveKey(password, saltBuf) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBuf, iterations: CRYPTO_PBKDF2_ITERATIONS, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptSecret(password, plaintext) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return {
    salt: bufToB64(salt),
    iv: bufToB64(iv),
    ciphertext: bufToB64(ciphertext)
  };
}

// זורק שגיאה אם הסיסמה שגויה (ה-GCM tag לא יתאים).
async function decryptSecret(password, blob) {
  const salt = b64ToBuf(blob.salt);
  const iv = b64ToBuf(blob.iv);
  const key = await deriveKey(password, salt);
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, b64ToBuf(blob.ciphertext));
  return new TextDecoder().decode(plainBuf);
}
