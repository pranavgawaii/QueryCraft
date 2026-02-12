import type { QueryValidationResult } from "@/types";

const DANGEROUS_KEYWORDS = [
  "DROP",
  "DELETE",
  "UPDATE",
  "INSERT",
  "ALTER",
  "TRUNCATE",
  "CREATE",
];

const hasBalancedParentheses = (value: string): boolean => {
  let depth = 0;
  for (const char of value) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
};

const normalizeWhitespace = (sql: string) => sql.replace(/\s+/g, " ").trim();

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

export const validateSQL = (sqlString: string, maxRows = 1000): QueryValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!sqlString.trim()) {
    return {
      valid: false,
      errors: ["Query cannot be empty."],
      warnings,
      sanitizedSQL: sqlString,
    };
  }

  const sanitizedInput = sqlString.trim().replace(/;+$/, "");
  const upperSql = sanitizedInput.toUpperCase();

  if (!upperSql.startsWith("SELECT")) {
    errors.push("Only SELECT queries are allowed.");
  }

  for (const keyword of DANGEROUS_KEYWORDS) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, "i");
    if (keywordRegex.test(upperSql)) {
      errors.push(`Dangerous SQL keyword blocked: ${keyword}`);
    }
  }

  if (!hasBalancedParentheses(sanitizedInput)) {
    errors.push("Unbalanced parentheses in SQL query.");
  }

  if (/;/.test(sanitizedInput)) {
    errors.push("Multiple statements are not allowed.");
  }

  const sanitizedSQL = enforceLimit(normalizeWhitespace(sanitizedInput), maxRows);

  if (!/\bLIMIT\b/i.test(normalizeWhitespace(sanitizedInput))) {
    warnings.push(`No LIMIT provided. Applied LIMIT ${maxRows} automatically.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitizedSQL,
  };
};

let sqlJsLoader: Promise<unknown> | null = null;

const getSqlJs = async () => {
  if (!sqlJsLoader) {
    sqlJsLoader = import("sql.js").then((module) => {
      const initSqlJs = module.default;
      return initSqlJs({
        // Uses CDN fallback for the wasm binary in browser runtime.
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
      });
    });
  }

  return sqlJsLoader;
};

export const validateSQLSyntaxWithSqlJs = async (
  sqlString: string,
): Promise<{ valid: boolean; error?: string }> => {
  try {
    const SQL = (await getSqlJs()) as {
      Database: new () => {
        prepare: (sql: string) => unknown;
        close: () => void;
      };
    };

    const db = new SQL.Database();
    db.prepare(sqlString);
    db.close();
    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SQL syntax error";
    if (/fetch|network|wasm|locateFile|failed|no such table|no such column/i.test(message)) {
      return { valid: true };
    }

    return {
      valid: false,
      error: message,
    };
  }
};
