import { useEffect, useMemo, useState } from "react";
import { Save, Sparkles } from "lucide-react";

import { ColumnPicker } from "@/components/query-builder/ColumnPicker";
import { GroupByBuilder } from "@/components/query-builder/GroupByBuilder";
import { JoinBuilder } from "@/components/query-builder/JoinBuilder";
import { LimitSection } from "@/components/query-builder/LimitSection";
import { OrderByBuilder } from "@/components/query-builder/OrderByBuilder";
import { SQLPreview } from "@/components/query-builder/SQLPreview";
import { TableSelector } from "@/components/query-builder/TableSelector";
import { WhereBuilder } from "@/components/query-builder/WhereBuilder";
import { ExportButtons } from "@/components/results/ExportButtons";
import { ResultsTable } from "@/components/results/ResultsTable";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useConnectionStore } from "@/stores/connectionStore";
import { useQueryBuilderStore } from "@/stores/queryBuilderStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToastStore } from "@/stores/toastStore";
import { supabase } from "@/utils/supabaseClient";

const SaveQueryModal = ({
  open,
  isSaving,
  onClose,
  onSave,
}: {
  open: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
        <h3 className="text-base font-semibold text-slate-900">Save Query</h3>
        <p className="mt-1 text-sm text-slate-600">Give this query a name to reuse it later.</p>

        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium">Query Name</label>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="My analytics query" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isSaving}
            onClick={async () => {
              if (!name.trim()) return;
              await onSave(name.trim());
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export const QueryBuilder = () => {
  const { connections, fetchConnections, selectedConnectionId, setSelectedConnection } = useConnectionStore();
  const {
    settings: { defaultConnectionId },
  } = useSettingsStore();
  const queryTimeoutSeconds = useSettingsStore((state) => state.settings.queryTimeoutSeconds);

  const {
    schema,
    selectedTables,
    selectedColumns,
    whereConditions,
    joins,
    orderBy,
    groupBy,
    havingConditions,
    limit,
    offset,
    generatedSQL,
    manualSQL,
    queryResults,
    isExecuting,
    isFetchingSchema,
    addTable,
    removeTable,
    toggleColumn,
    addWhereCondition,
    updateWhereCondition,
    removeWhereCondition,
    addJoin,
    updateJoin,
    removeJoin,
    addOrderBy,
    updateOrderBy,
    removeOrderBy,
    reorderOrderBy,
    toggleGroupBy,
    addHavingCondition,
    updateHavingCondition,
    removeHavingCondition,
    setLimit,
    setOffset,
    setConnectionId,
    fetchSchema,
    generateSQL,
    setManualSQL,
    formatCurrentSQL,
    executeQuery,
    clearQuery,
  } = useQueryBuilderStore();

  const { pushToast } = useToastStore();

  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [isSavingQuery, setIsSavingQuery] = useState(false);

  useEffect(() => {
    void fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    const candidate = selectedConnectionId ?? defaultConnectionId;
    if (!candidate) return;

    setSelectedConnection(candidate);
    setConnectionId(candidate);
  }, [defaultConnectionId, selectedConnectionId, setConnectionId, setSelectedConnection]);

  useEffect(() => {
    if (selectedConnectionId && schema.length === 0) {
      void fetchSchema(selectedConnectionId);
    }
  }, [fetchSchema, schema.length, selectedConnectionId]);

  useEffect(() => {
    generateSQL();
  }, [
    selectedTables,
    selectedColumns,
    whereConditions,
    joins,
    orderBy,
    groupBy,
    havingConditions,
    limit,
    offset,
    generateSQL,
  ]);

  const availableColumns = useMemo(
    () =>
      schema
        .filter((table) => selectedTables.includes(table.name))
        .flatMap((table) => table.columns.map((column) => `${table.name}.${column.name}`)),
    [schema, selectedTables],
  );

  const onFetchSchema = async () => {
    if (!selectedConnectionId) {
      pushToast({
        type: "error",
        title: "Select a connection first",
      });
      return;
    }

    const { error } = await fetchSchema(selectedConnectionId);

    if (error) {
      pushToast({
        type: "error",
        title: "Schema fetch failed",
        description: error,
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Schema loaded",
    });
  };

  const onRunQuery = async () => {
    const { error } = await executeQuery();

    if (error) {
      pushToast({
        type: "error",
        title: "Query failed",
        description: error,
      });
      return;
    }

    const latestResult = useQueryBuilderStore.getState().queryResults;

    pushToast({
      type: "success",
      title: "Query executed",
      description: latestResult ? `Returned ${latestResult.rowCount} rows.` : undefined,
    });
  };

  const onSaveQuery = async (queryName: string) => {
    if (!selectedConnectionId) {
      pushToast({
        type: "error",
        title: "No connection selected",
      });
      return;
    }

    setIsSavingQuery(true);

    const queryConfig = {
      selectedTables,
      selectedColumns,
      whereConditions,
      joins,
      orderBy,
      groupBy,
      havingConditions,
      limit,
      offset,
    };

    const sql = manualSQL || generatedSQL || generateSQL();

    const { error } = await supabase.from("saved_queries").insert({
      connection_id: selectedConnectionId,
      query_name: queryName,
      query_config: queryConfig,
      generated_sql: sql,
      last_executed: null,
    });

    setIsSavingQuery(false);

    if (error) {
      pushToast({
        type: "error",
        title: "Could not save query",
        description: error.message,
      });
      return;
    }

    setOpenSaveModal(false);
    pushToast({
      type: "success",
      title: "Query saved",
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Query Builder</h1>
          <p className="text-sm text-slate-600">Build SQL queries visually and run them safely.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setOpenSaveModal(true)}>
            <Save className="mr-1 h-4 w-4" />
            Save Query
          </Button>
          <Button variant="ghost" onClick={clearQuery}>
            Clear
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-violet-600" onClick={onRunQuery} isLoading={isExecuting}>
            <Sparkles className="mr-1 h-4 w-4" />
            Run Query
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="grid gap-2 md:grid-cols-[2fr_auto_auto]">
            <Select
              value={selectedConnectionId ?? ""}
              onChange={(event) => {
                const value = event.target.value || null;
                setSelectedConnection(value);
                setConnectionId(value);
              }}
              options={[
                { label: "Select Connection", value: "" },
                ...connections.map((connection) => ({
                  label: `${connection.connection_name} (${connection.host})`,
                  value: connection.id,
                })),
              ]}
            />
            <Button variant="outline" onClick={onFetchSchema} isLoading={isFetchingSchema}>
              Fetch Schema
            </Button>
            <div className="text-xs text-slate-500">Query timeout: {queryTimeoutSeconds}s</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <TableSelector
          schema={schema}
          selectedTables={selectedTables}
          onAddTable={addTable}
          onRemoveTable={removeTable}
        />

        <div className="space-y-4">
          <ColumnPicker
            schema={schema}
            selectedTables={selectedTables}
            selectedColumns={selectedColumns}
            onToggleColumn={toggleColumn}
          />

          <WhereBuilder
            title="WHERE Conditions"
            conditions={whereConditions}
            availableColumns={availableColumns}
            onAdd={addWhereCondition}
            onUpdate={updateWhereCondition}
            onRemove={removeWhereCondition}
          />

          <JoinBuilder
            joins={joins}
            schema={schema}
            selectedTables={selectedTables}
            onAddJoin={addJoin}
            onUpdateJoin={updateJoin}
            onRemoveJoin={removeJoin}
          />

          <OrderByBuilder
            orderBy={orderBy}
            availableColumns={availableColumns}
            onAddSort={addOrderBy}
            onUpdateSort={updateOrderBy}
            onRemoveSort={removeOrderBy}
            onMoveSort={reorderOrderBy}
          />

          <LimitSection limit={limit} offset={offset} onChangeLimit={setLimit} onChangeOffset={setOffset} />

          <GroupByBuilder
            availableColumns={availableColumns}
            selectedGroupBy={groupBy}
            onToggleGroupBy={toggleGroupBy}
          />

          <WhereBuilder
            title="HAVING Conditions"
            conditions={havingConditions}
            availableColumns={availableColumns}
            onAdd={addHavingCondition}
            onUpdate={updateHavingCondition}
            onRemove={removeHavingCondition}
          />

          <SQLPreview
            generatedSQL={generatedSQL}
            manualSQL={manualSQL}
            onManualSQLChange={setManualSQL}
            onFormatSQL={formatCurrentSQL}
          />

          {queryResults ? <ExportButtons rows={queryResults.rows} /> : null}
          <ResultsTable result={queryResults} />
        </div>
      </div>

      <SaveQueryModal
        open={openSaveModal}
        isSaving={isSavingQuery}
        onClose={() => setOpenSaveModal(false)}
        onSave={onSaveQuery}
      />
    </div>
  );
};
