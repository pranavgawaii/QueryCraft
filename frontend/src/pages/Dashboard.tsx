import { useQuery } from "@tanstack/react-query";
import { Clock, Database, FileCode2, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/utils/supabaseClient";

interface RecentExecution {
  id: string;
  executed_sql: string;
  rows_returned: number;
  execution_time_ms: number;
  created_at: string;
}

const fetchDashboardData = async () => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [connectionsResult, savedQueriesResult, monthlyExecutionsResult, recentExecutionsResult] = await Promise.all([
    supabase.from("database_connections").select("id", { count: "exact", head: true }),
    supabase.from("saved_queries").select("id", { count: "exact", head: true }),
    supabase
      .from("query_executions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("query_executions")
      .select("id, executed_sql, rows_returned, execution_time_ms, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (
    connectionsResult.error ||
    savedQueriesResult.error ||
    monthlyExecutionsResult.error ||
    recentExecutionsResult.error
  ) {
    throw new Error("Failed to load dashboard data");
  }

  return {
    totalConnections: connectionsResult.count ?? 0,
    totalSavedQueries: savedQueriesResult.count ?? 0,
    monthlyExecutions: monthlyExecutionsResult.count ?? 0,
    recentExecutions: (recentExecutionsResult.data ?? []) as RecentExecution[],
  };
};

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: typeof Database }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Welcome back to QueryCraft
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/query-builder">
          <Button>
            <PlayCircle className="mr-2 h-4 w-4" />
            New Query
          </Button>
        </Link>
        <Link to="/connections/new">
          <Button variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Add Connection
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="skeleton h-32 rounded-lg" />
            <div className="skeleton h-32 rounded-lg" />
            <div className="skeleton h-32 rounded-lg" />
          </>
        ) : (
          <>
            <StatCard title="Connections" value={data?.totalConnections ?? 0} icon={Database} />
            <StatCard title="Saved Queries" value={data?.totalSavedQueries ?? 0} icon={FileCode2} />
            <StatCard title="Queries This Month" value={data?.monthlyExecutions ?? 0} icon={Clock} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Queries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="skeleton h-16 rounded-lg" />
              ))}
            </div>
          ) : data?.recentExecutions.length ? (
            <div className="space-y-3">
              {data.recentExecutions.map((execution) => (
                <div
                  key={execution.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-sm">{execution.executed_sql}</p>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {execution.rows_returned} rows • {execution.execution_time_ms}ms
                    </p>
                  </div>
                  <p className="ml-4 text-xs text-neutral-500">
                    {new Date(execution.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <FileCode2 className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
              <p className="mb-2 font-semibold">No queries yet</p>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                Start building your first query
              </p>
              <Link to="/query-builder">
                <Button>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Build Query
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
