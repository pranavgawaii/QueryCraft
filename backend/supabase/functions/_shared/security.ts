export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DANGEROUS_KEYWORDS = [
  "DROP",
  "DELETE",
  "UPDATE",
  "INSERT",
  "ALTER",
  "TRUNCATE",
  "CREATE",
];

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const hasBalancedParentheses = (value: string): boolean => {
  let depth = 0;

  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth < 0) return false;
  }

  return depth === 0;
};

const enforceLimit = (sql: string, maxRows: number): string => {
  const limitRegex = /\bLIMIT\s+(\d+)/i;
  const match = sql.match(limitRegex);

  if (!match) {
    return `${sql} LIMIT ${maxRows}`;
  }

  const limit = Number(match[1]);
  if (Number.isNaN(limit) || limit > maxRows) {
    return sql.replace(limitRegex, `LIMIT ${maxRows}`);
  }

  return sql;
};

export const validateSelectSql = (rawSql: string, maxRows = 1000): string => {
  const sql = rawSql.trim().replace(/;+$/, "");
  const upperSql = sql.toUpperCase();

  if (!sql || !upperSql.startsWith("SELECT")) {
    throw new Error("Only SELECT queries are allowed.");
  }

  for (const keyword of DANGEROUS_KEYWORDS) {
    if (new RegExp(`\\b${keyword}\\b`, "i").test(upperSql)) {
      throw new Error(`Dangerous keyword blocked: ${keyword}`);
    }
  }

  if (/;/.test(sql)) {
    throw new Error("Multiple SQL statements are not allowed.");
  }

  if (!hasBalancedParentheses(sql)) {
    throw new Error("Unbalanced parentheses in SQL statement.");
  }

  return enforceLimit(sql.replace(/\s+/g, " "), Math.max(1, Math.min(maxRows, 1000)));
};

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const getAesKey = async (secret: string) => {
  const hash = await crypto.subtle.digest("SHA-256", textEncoder.encode(secret));
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
};

export const decryptPassword = async (encryptedPayload: string, secret: string): Promise<string> => {
  const [ivPart, dataPart] = encryptedPayload.split(":");
  if (!ivPart || !dataPart) {
    throw new Error("Invalid encrypted password format.");
  }

  const key = await getAesKey(secret);
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: fromBase64(ivPart),
    },
    key,
    fromBase64(dataPart),
  );

  return textDecoder.decode(decryptedBuffer);
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const mapExecutionError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : "Unknown error";

  if (/password authentication failed|invalid password/i.test(message)) {
    return "Invalid credentials. Could not connect to database.";
  }

  if (/timeout|statement timeout/i.test(message)) {
    return "Query took too long (>30s). Try adding more filters.";
  }

  if (/syntax error/i.test(message)) {
    return `Invalid query: ${message}`;
  }

  if (/permission denied/i.test(message)) {
    return "User doesn't have permission to access this table.";
  }

  if (/ECONNREFUSED|ENOTFOUND|connect/i.test(message)) {
    return "Could not connect. Check your credentials.";
  }

  return message;
};
