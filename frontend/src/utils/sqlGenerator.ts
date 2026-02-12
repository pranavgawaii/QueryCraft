import type {
  QueryBuilderConfig,
  QueryCondition,
  QueryExecutionResult,
  QueryOrderBy,
} from "@/types";

const SAFE_IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_$]*$/;

const quoteIdentifier = (identifier: string): string => {
  const parts = identifier.split(".");

  const safeParts = parts.map((part) => {
    if (!SAFE_IDENTIFIER_REGEX.test(part)) {
      throw new Error(`Unsafe SQL identifier: ${identifier}`);
    }
    return `\"${part}\"`;
  });

  return safeParts.join(".");
};

const isNumeric = (value: string) => value !== "" && !Number.isNaN(Number(value));

const escapeSqlString = (value: string) => value.replace(/'/g, "''");

const formatConditionValue = (condition: QueryCondition): string => {
  const operator = condition.operator.toUpperCase();
  const rawValue = condition.value ?? "";

  if (operator === "IS NULL" || operator === "IS NOT NULL") {
    return "";
  }

  if (operator === "IN") {
    const parts = rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => (isNumeric(item) ? item : `'${escapeSqlString(item)}'`));

    return `(${parts.join(", ")})`;
  }

  if (isNumeric(rawValue)) {
    return rawValue;
  }

  return `'${escapeSqlString(rawValue)}'`;
};

const buildConditionSql = (condition: QueryCondition): string => {
  if (!condition.column) {
    return "";
  }

  const column = quoteIdentifier(condition.column);
  const operator = condition.operator;

  if (operator === "IS NULL" || operator === "IS NOT NULL") {
    return `${column} ${operator}`;
  }

  const formattedValue = formatConditionValue(condition);
  if (!formattedValue) {
    return "";
  }

  return `${column} ${operator} ${formattedValue}`;
};

const buildGroupedConditions = (conditions: QueryCondition[]): string => {
  const validConditions = conditions
    .map((condition) => ({
      ...condition,
      sql: buildConditionSql(condition),
    }))
    .filter((condition) => Boolean(condition.sql));

  if (!validConditions.length) {
    return "";
  }

  const groups = new Map<number, typeof validConditions>();

  for (const condition of validConditions) {
    const groupId = condition.group ?? 0;
    const existing = groups.get(groupId) ?? [];
    existing.push(condition);
    groups.set(groupId, existing);
  }

  const groupSql = [...groups.entries()]
    .sort(([groupA], [groupB]) => groupA - groupB)
    .map(([, grouped]) => {
      const expression = grouped
        .map((condition, index) => {
          if (index === 0) {
            return condition.sql;
          }
          return `${condition.connector} ${condition.sql}`;
        })
        .join(" ");

      return `(${expression})`;
    });

  if (groupSql.length === 1) {
    return groupSql[0].slice(1, -1);
  }

  return groupSql.join(" AND ");
};

const buildOrderBy = (orderBy: QueryOrderBy[]): string => {
  if (!orderBy.length) {
    return "";
  }

  const parts = orderBy
    .filter((item) => item.column)
    .map((item) => `${quoteIdentifier(item.column)} ${item.direction}`);

  if (!parts.length) {
    return "";
  }

  return `ORDER BY ${parts.join(", ")}`;
};

export const generateSQL = (config: QueryBuilderConfig): string => {
  if (!config.selectedTables.length) {
    return "SELECT *";
  }

  const selectClause = config.selectedColumns.length
    ? config.selectedColumns
        .map((column) => `${quoteIdentifier(column.table)}.${quoteIdentifier(column.column)}`)
        .join(", ")
    : "*";

  const [baseTable] = config.selectedTables;
  let sql = `SELECT ${selectClause} FROM ${quoteIdentifier(baseTable)}`;

  if (config.joins.length) {
    const joins = config.joins
      .filter((join) => join.table && join.leftColumn && join.rightColumn)
      .map(
        (join) =>
          `${join.joinType} ${quoteIdentifier(join.table)} ON ${quoteIdentifier(join.leftColumn)} = ${quoteIdentifier(join.rightColumn)}`,
      );

    if (joins.length) {
      sql += ` ${joins.join(" ")}`;
    }
  }

  const whereClause = buildGroupedConditions(config.whereConditions);
  if (whereClause) {
    sql += ` WHERE ${whereClause}`;
  }

  if (config.groupBy.length) {
    sql += ` GROUP BY ${config.groupBy.map((column) => quoteIdentifier(column)).join(", ")}`;

    const havingClause = buildGroupedConditions(config.havingConditions);
    if (havingClause) {
      sql += ` HAVING ${havingClause}`;
    }
  }

  const orderByClause = buildOrderBy(config.orderBy);
  if (orderByClause) {
    sql += ` ${orderByClause}`;
  }

  if (typeof config.limit === "number" && config.limit >= 0) {
    sql += ` LIMIT ${config.limit}`;
  }

  if (typeof config.offset === "number" && config.offset > 0) {
    sql += ` OFFSET ${config.offset}`;
  }

  return sql.trim();
};

export const formatSQL = (sql: string): string => {
  return sql
    .replace(/\s+/g, " ")
    .replace(/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|INNER JOIN|LEFT JOIN|RIGHT JOIN|ON)\b/gi, "\n$1")
    .replace(/\n+/g, "\n")
    .trim();
};

export const getRowPreview = (result: QueryExecutionResult | null): string => {
  if (!result) {
    return "";
  }

  return `${result.rowCount} rows in ${result.executionTime}ms`;
};
