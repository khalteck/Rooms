/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Explicitly typed for better autocomplete
  readonly VITE_API_URL_PROD: string;
  readonly VITE_API_URL_DEV: string;
  // Automatically support any other VITE_ prefixed variables
  readonly [key: `VITE_${string}`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
