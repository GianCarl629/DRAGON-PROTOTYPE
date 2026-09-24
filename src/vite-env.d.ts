/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAPBOX_TOKEN?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
