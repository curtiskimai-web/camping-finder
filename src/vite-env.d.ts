/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAMPING_API_KEY: string
  readonly VITE_KAKAO_MAP_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 