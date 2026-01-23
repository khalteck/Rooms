/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_PROD: string;
  readonly VITE_API_URL_DEV: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
