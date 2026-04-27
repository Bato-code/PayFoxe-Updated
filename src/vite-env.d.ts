/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY?: string
  // Add any other VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}