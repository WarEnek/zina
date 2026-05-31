import { motion } from 'framer-motion'
import { useState } from 'react'
import { NetworkGuard } from '../features/network/NetworkGuard'
import { WalletStatus } from '../features/wallet/WalletStatus'
import { ConnectWalletButton } from '../features/wallet/ConnectWalletButton'
import { GamePanel } from '../features/game/GamePanel'
import { LeaderboardCard } from '../features/leaderboard/LeaderboardCard'
import { ProfileCard } from '../features/profile/ProfileCard'
import { ProofPanel } from '../features/proof/ProofPanel'
import { VerificationExplainer } from '../features/proof/VerificationExplainer'
import { RollEvent } from '../shared/types/game'
import { isProofRollArenaAddressConfigured } from '../shared/contracts/addresses'
import { ConfigErrorBanner } from '../features/network/ConfigErrorBanner'

export function App() {
  const [latestRoll, setLatestRoll] = useState<RollEvent | null>(null)

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h1 className="text-3xl font-bold">ProofRoll Arena</h1>
        <p className="text-white/80">Testnet-only on-chain game demo. No real money. No real value. No wagering.</p>
        <div className="mt-3"><ConnectWalletButton /></div>
      </motion.section>
      <WalletStatus />
      {isProofRollArenaAddressConfigured ? (
        <NetworkGuard>
          <GamePanel onLatestRoll={setLatestRoll} />
          <ProofPanel latestRoll={latestRoll} />
        </NetworkGuard>
      ) : (
        <ConfigErrorBanner />
      )}
      <LeaderboardCard />
      <ProfileCard />
      <VerificationExplainer />
      <footer className="text-center text-xs text-white/60">Demo randomness not production-secure. Supabase is cache only.</footer>
    </main>
  )
}
