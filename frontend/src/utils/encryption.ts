const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const DEFAULT_KEY = "querycraft-dev-only-key-change-me";

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const getAesKey = async () => {
  const passphrase = import.meta.env.VITE_ENCRYPTION_KEY ?? DEFAULT_KEY;
  const hashBuffer = await crypto.subtle.digest("SHA-256", textEncoder.encode(passphrase));

  return crypto.subtle.importKey("raw", hashBuffer, { name: "AES-GCM", length: 256 }, false, [
    "encrypt",
    "decrypt",
  ]);
};

export const encryptPassword = async (plainPassword: string): Promise<string> => {
  const key = await getAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    textEncoder.encode(plainPassword),
  );

  return `${toBase64(iv)}:${toBase64(new Uint8Array(encryptedBuffer))}`;
};

export const decryptPassword = async (encryptedPassword: string): Promise<string> => {
  const [ivPart, payloadPart] = encryptedPassword.split(":");
  if (!ivPart || !payloadPart) {
    throw new Error("Invalid encrypted payload format");
  }

  const key = await getAesKey();
  const ivArray = fromBase64(ivPart);
  const payloadArray = fromBase64(payloadPart);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray.buffer as ArrayBuffer,
    },
    key,
    payloadArray.buffer as ArrayBuffer,
  );

  return textDecoder.decode(decryptedBuffer);
};
