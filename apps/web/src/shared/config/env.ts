export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Cookie Forge',
  chainId: Number(import.meta.env.VITE_CHAIN_ID ?? 11155111),
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
  etherscanBaseUrl: import.meta.env.VITE_ETHERSCAN_BASE_URL ?? 'https://sepolia.etherscan.io',
  supabaseSyncRollEventUrl: import.meta.env.VITE_SUPABASE_SYNC_ROLL_EVENT_URL ?? '',
} as const
