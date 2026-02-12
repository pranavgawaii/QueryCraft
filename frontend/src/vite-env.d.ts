/// <reference types="vite/client" />

declare module 'sql.js' {
  interface Database {
    exec(sql: string): unknown[];
    close(): void;
  }
  
  interface SqlJsStatic {
    Database: new (data?: ArrayBuffer) => Database;
  }
  
  interface InitSqlJsOptions {
    locateFile?: (file: string) => string;
  }
  
  function initSqlJs(options?: InitSqlJsOptions): Promise<SqlJsStatic>;
  export default initSqlJs;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_ENCRYPTION_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
