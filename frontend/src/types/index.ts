export type DatabaseType = "postgresql" | "mysql";

export interface DatabaseConnection {
  id: string;
  user_id: string;
  connection_name: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  encrypted_password: string;
  database_type: DatabaseType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedQuery {
  id: string;
  user_id: string;
  connection_id: string;
  query_name: string;
  query_config: QueryBuilderConfig;
  generated_sql: string;
  last_executed: string | null;
  created_at: string;
  connection?: Pick<DatabaseConnection, "id" | "connection_name">;
}

export interface QueryExecution {
  id: string;
  user_id: string;
  query_id: string | null;
  executed_sql: string;
  rows_returned: number;
  execution_time_ms: number;
  created_at: string;
}

export interface ColumnReference {
  table: string;
  column: string;
}

export interface ColumnSchema {
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  references?: {
    table: string;
    column: string;
  } | null;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

export interface DatabaseSchema {
  tables: TableSchema[];
}

export type LogicalConnector = "AND" | "OR";

export type ConditionOperator =
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "LIKE"
  | "IN"
  | "IS NULL"
  | "IS NOT NULL";

export interface QueryCondition {
  id: string;
  column: string;
  operator: ConditionOperator;
  value?: string;
  connector: LogicalConnector;
  group: number;
}

export type JoinType = "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN";

export interface QueryJoin {
  id: string;
  joinType: JoinType;
  table: string;
  leftColumn: string;
  rightColumn: string;
}

export interface QueryOrderBy {
  id: string;
  column: string;
  direction: "ASC" | "DESC";
}

export interface ColumnSelection {
  table: string;
  column: string;
}

export interface QueryBuilderConfig {
  selectedTables: string[];
  selectedColumns: ColumnSelection[];
  whereConditions: QueryCondition[];
  joins: QueryJoin[];
  orderBy: QueryOrderBy[];
  groupBy: string[];
  havingConditions: QueryCondition[];
  limit: number | null;
  offset: number | null;
}

export interface QueryExecutionResult {
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
  columns: string[];
}

export interface QueryValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedSQL: string;
}

export interface ConnectionFormInput {
  connection_name: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
  database_type: DatabaseType;
  is_active: boolean;
}

export interface AppSettings {
  defaultConnectionId: string | null;
  queryTimeoutSeconds: number;
  maxRowsLimit: number;
}
