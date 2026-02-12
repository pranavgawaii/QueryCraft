import { create } from "zustand";

import type {
  ColumnSelection,
  QueryBuilderConfig,
  QueryCondition,
  QueryExecutionResult,
  QueryJoin,
  QueryOrderBy,
  TableSchema,
} from "@/types";
import { useSettingsStore } from "@/stores/settingsStore";
import { generateSQL, formatSQL } from "@/utils/sqlGenerator";
import { validateSQL, validateSQLSyntaxWithSqlJs } from "@/utils/sqlValidator";
import { supabase } from "@/utils/supabaseClient";

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const emptyCondition = (): QueryCondition => ({
  id: makeId(),
  column: "",
  operator: "=",
  value: "",
  connector: "AND",
  group: 0,
});

const emptyJoin = (): QueryJoin => ({
  id: makeId(),
  joinType: "INNER JOIN",
  table: "",
  leftColumn: "",
  rightColumn: "",
});

const emptyOrderBy = (): QueryOrderBy => ({
  id: makeId(),
  column: "",
  direction: "ASC",
});

const configFromState = (state: QueryBuilderState): QueryBuilderConfig => ({
  selectedTables: state.selectedTables,
  selectedColumns: state.selectedColumns,
  whereConditions: state.whereConditions,
  joins: state.joins,
  orderBy: state.orderBy,
  groupBy: state.groupBy,
  havingConditions: state.havingConditions,
  limit: state.limit,
  offset: state.offset,
});

interface QueryBuilderState {
  selectedConnectionId: string | null;
  schema: TableSchema[];
  selectedTables: string[];
  selectedColumns: ColumnSelection[];
  whereConditions: QueryCondition[];
  joins: QueryJoin[];
  orderBy: QueryOrderBy[];
  groupBy: string[];
  havingConditions: QueryCondition[];
  limit: number | null;
  offset: number | null;
  generatedSQL: string;
  manualSQL: string;
  queryResults: QueryExecutionResult | null;
  isExecuting: boolean;
  isFetchingSchema: boolean;

  setConnectionId: (id: string | null) => void;
  fetchSchema: (connectionId: string) => Promise<{ error?: string }>;

  addTable: (table: string) => void;
  removeTable: (table: string) => void;
  toggleColumn: (column: ColumnSelection) => void;

  addWhereCondition: () => void;
  updateWhereCondition: (id: string, patch: Partial<QueryCondition>) => void;
  removeWhereCondition: (id: string) => void;

  addJoin: () => void;
  updateJoin: (id: string, patch: Partial<QueryJoin>) => void;
  removeJoin: (id: string) => void;

  addOrderBy: () => void;
  updateOrderBy: (id: string, patch: Partial<QueryOrderBy>) => void;
  removeOrderBy: (id: string) => void;
  reorderOrderBy: (id: string, direction: "up" | "down") => void;

  toggleGroupBy: (column: string) => void;

  addHavingCondition: () => void;
  updateHavingCondition: (id: string, patch: Partial<QueryCondition>) => void;
  removeHavingCondition: (id: string) => void;

  setLimit: (value: number | null) => void;
  setOffset: (value: number | null) => void;

  generateSQL: () => string;
  setManualSQL: (sql: string) => void;
  formatCurrentSQL: () => void;

  executeQuery: (queryId?: string | null) => Promise<{ error?: string }>;
  clearQuery: () => void;
  loadSavedQuery: (config: QueryBuilderConfig, generatedSql?: string) => void;
}

export const useQueryBuilderStore = create<QueryBuilderState>((set, get) => ({
  selectedConnectionId: null,
  schema: [],
  selectedTables: [],
  selectedColumns: [],
  whereConditions: [],
  joins: [],
  orderBy: [],
  groupBy: [],
  havingConditions: [],
  limit: 50,
  offset: 0,
  generatedSQL: "",
  manualSQL: "",
  queryResults: null,
  isExecuting: false,
  isFetchingSchema: false,

  setConnectionId: (id) => set({ selectedConnectionId: id }),

  fetchSchema: async (connectionId) => {
    set({ isFetchingSchema: true });
    const { data, error } = await supabase.functions.invoke("fetch-schema", {
      body: { connectionId },
    });

    if (error || !data?.success) {
      set({ isFetchingSchema: false });
      return { error: error?.message ?? data?.error ?? "Failed to fetch schema" };
    }

    set({
      schema: data.tables ?? [],
      selectedConnectionId: connectionId,
      isFetchingSchema: false,
    });

    return {};
  },

  addTable: (table) => {
    set((state) => {
      if (state.selectedTables.includes(table)) return state;
      const next = [...state.selectedTables, table];
      return { selectedTables: next };
    });
    get().generateSQL();
  },

  removeTable: (table) => {
    set((state) => ({
      selectedTables: state.selectedTables.filter((item) => item !== table),
      selectedColumns: state.selectedColumns.filter((column) => column.table !== table),
      joins: state.joins.filter((join) => join.table !== table),
    }));
    get().generateSQL();
  },

  toggleColumn: (column) => {
    set((state) => {
      const exists = state.selectedColumns.some(
        (item) => item.table === column.table && item.column === column.column,
      );

      if (exists) {
        return {
          selectedColumns: state.selectedColumns.filter(
            (item) => !(item.table === column.table && item.column === column.column),
          ),
        };
      }

      return {
        selectedColumns: [...state.selectedColumns, column],
      };
    });
    get().generateSQL();
  },

  addWhereCondition: () => {
    set((state) => ({
      whereConditions: [...state.whereConditions, emptyCondition()],
    }));
  },

  updateWhereCondition: (id, patch) => {
    set((state) => ({
      whereConditions: state.whereConditions.map((condition) =>
        condition.id === id ? { ...condition, ...patch } : condition,
      ),
    }));
    get().generateSQL();
  },

  removeWhereCondition: (id) => {
    set((state) => ({
      whereConditions: state.whereConditions.filter((condition) => condition.id !== id),
    }));
    get().generateSQL();
  },

  addJoin: () => {
    set((state) => ({
      joins: [...state.joins, emptyJoin()],
    }));
  },

  updateJoin: (id, patch) => {
    set((state) => ({
      joins: state.joins.map((join) => (join.id === id ? { ...join, ...patch } : join)),
    }));
    get().generateSQL();
  },

  removeJoin: (id) => {
    set((state) => ({
      joins: state.joins.filter((join) => join.id !== id),
    }));
    get().generateSQL();
  },

  addOrderBy: () => {
    set((state) => ({
      orderBy: [...state.orderBy, emptyOrderBy()],
    }));
  },

  updateOrderBy: (id, patch) => {
    set((state) => ({
      orderBy: state.orderBy.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
    get().generateSQL();
  },

  removeOrderBy: (id) => {
    set((state) => ({
      orderBy: state.orderBy.filter((item) => item.id !== id),
    }));
    get().generateSQL();
  },

  reorderOrderBy: (id, direction) => {
    set((state) => {
      const idx = state.orderBy.findIndex((item) => item.id === id);
      if (idx < 0) return state;

      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= state.orderBy.length) return state;

      const orderBy = [...state.orderBy];
      const [current] = orderBy.splice(idx, 1);
      orderBy.splice(target, 0, current);
      return { orderBy };
    });
    get().generateSQL();
  },

  toggleGroupBy: (column) => {
    set((state) => {
      if (state.groupBy.includes(column)) {
        return { groupBy: state.groupBy.filter((item) => item !== column) };
      }

      return { groupBy: [...state.groupBy, column] };
    });
    get().generateSQL();
  },

  addHavingCondition: () => {
    set((state) => ({
      havingConditions: [...state.havingConditions, emptyCondition()],
    }));
  },

  updateHavingCondition: (id, patch) => {
    set((state) => ({
      havingConditions: state.havingConditions.map((condition) =>
        condition.id === id ? { ...condition, ...patch } : condition,
      ),
    }));
    get().generateSQL();
  },

  removeHavingCondition: (id) => {
    set((state) => ({
      havingConditions: state.havingConditions.filter((condition) => condition.id !== id),
    }));
    get().generateSQL();
  },

  setLimit: (value) => {
    set({ limit: value });
    get().generateSQL();
  },

  setOffset: (value) => {
    set({ offset: value });
    get().generateSQL();
  },

  generateSQL: () => {
    const sql = generateSQL(configFromState(get()));
    set({ generatedSQL: sql });
    return sql;
  },

  setManualSQL: (sql) => set({ manualSQL: sql }),

  formatCurrentSQL: () => {
    const raw = get().manualSQL || get().generatedSQL;
    const formatted = formatSQL(raw);
    set({ manualSQL: formatted });
  },

  executeQuery: async (queryId = null) => {
    const { settings } = useSettingsStore.getState();
    const sqlCandidate = get().manualSQL || get().generatedSQL || get().generateSQL();

    const validation = validateSQL(sqlCandidate, settings.maxRowsLimit);
    if (!validation.valid) {
      return { error: validation.errors.join(" ") };
    }

    const syntaxValidation = await validateSQLSyntaxWithSqlJs(validation.sanitizedSQL);
    if (!syntaxValidation.valid) {
      return { error: `Invalid query: ${syntaxValidation.error}` };
    }

    if (!get().selectedConnectionId) {
      return { error: "Select a database connection first." };
    }

    set({ isExecuting: true });

    const timeoutMs = Math.max(1, settings.queryTimeoutSeconds) * 1000;

    const request = supabase.functions.invoke("execute-query", {
      body: {
        connectionId: get().selectedConnectionId,
        queryId,
        sql: validation.sanitizedSQL,
        timeoutMs,
        maxRows: settings.maxRowsLimit,
      },
    });

    const timeoutPromise = new Promise<never>((_resolve, reject) => {
      window.setTimeout(() => reject(new Error("Query timeout")), timeoutMs + 1000);
    });

    try {
      const response = (await Promise.race([request, timeoutPromise])) as Awaited<typeof request>;
      const { data, error } = response;

      if (error || !data?.success) {
        set({ isExecuting: false });
        return { error: error?.message ?? data?.error ?? "Query execution failed" };
      }

      set({
        queryResults: {
          rows: data.rows,
          rowCount: data.rowCount,
          executionTime: data.executionTime,
          columns: data.columns,
        },
        generatedSQL: validation.sanitizedSQL,
        isExecuting: false,
      });

      return {};
    } catch (error) {
      set({ isExecuting: false });
      return {
        error:
          error instanceof Error
            ? error.message === "Query timeout"
              ? "Query took too long (>30s). Try adding more filters."
              : error.message
            : "Query execution failed",
      };
    }
  },

  clearQuery: () => {
    set({
      schema: [],
      selectedTables: [],
      selectedColumns: [],
      whereConditions: [],
      joins: [],
      orderBy: [],
      groupBy: [],
      havingConditions: [],
      limit: 50,
      offset: 0,
      generatedSQL: "",
      manualSQL: "",
      queryResults: null,
    });
  },

  loadSavedQuery: (config, generatedSql) => {
    set({
      selectedTables: config.selectedTables,
      selectedColumns: config.selectedColumns,
      whereConditions: config.whereConditions,
      joins: config.joins,
      orderBy: config.orderBy,
      groupBy: config.groupBy,
      havingConditions: config.havingConditions,
      limit: config.limit,
      offset: config.offset,
      generatedSQL: generatedSql ?? generateSQL(config),
      manualSQL: generatedSql ?? "",
    });
  },
}));
