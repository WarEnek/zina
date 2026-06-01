import { motion } from 'framer-motion'
import { useState } from 'react'
import { ShieldCheck, Cookie, Database, Trophy } from 'lucide-react'
import { NetworkGuard } from '../features/network/NetworkGuard'
import { WalletStatus } from '../features/wallet/WalletStatus'
import { ConnectWalletButton } from '../features/wallet/ConnectWalletButton'
import { GamePanel } from '../features/game/GamePanel'
import { LeaderboardCard } from '../features/leaderboard/LeaderboardCard'
import { ProfileCard } from '../features/profile/ProfileCard'
import { ProofPanel } from '../features/proof/ProofPanel'
import { VerificationExplainer } from '../features/proof/VerificationExplainer'
import { BakeEvent } from '../shared/types/game'
import { isCookieForgeAddressConfigured } from '../shared/contracts/addresses'
import { ConfigErrorBanner } from '../features/network/ConfigErrorBanner'
import { CookieCollectionCard } from '../features/collection/CookieCollectionCard'
import { OddsTransparencyCard } from '../features/odds/OddsTransparencyCard'

export function App() {
  const [latestBake, setLatestBake] = useState<BakeEvent | null>(null)

  return (
    <main className="page-shell">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-grid">
        <div className="card stack-compact">
          <div className="flex flex-wrap gap-2">
            <span className="flat-chip chip-blue"><ShieldCheck size={14} /> verifiable</span>
            <span className="flat-chip chip-orange"><Cookie size={14} /> bake-to-reveal</span>
            <span className="flat-chip chip-green"><Database size={14} /> cache-safe</span>
          </div>
          <h1 className="flat-title">Cookie Forge</h1>
          <p className="flat-subtitle">On-chain cookie collectible minting on Sepolia. No real money. No wagering.</p>
          <div><ConnectWalletButton /></div>
        </div>
        <div className="card stack-compact">
          <h2 className="text-xl font-bold">Live status</h2>
          <WalletStatus />
          <p className="text-sm flat-subtitle">Wallet signs bake tx. Contract mints cookie collectible. Supabase mirrors public events only.</p>
        </div>
      </motion.section>

      {isCookieForgeAddressConfigured ? (
        <NetworkGuard>
          <section className="section-grid">
            <div className="stack-compact">
              <GamePanel onLatestBake={setLatestBake} />
              <CookieCollectionCard />
              <LeaderboardCard />
            </div>
            <div className="stack-compact">
              <ProofPanel latestBake={latestBake} />
              <OddsTransparencyCard />
              <ProfileCard />
            </div>
          </section>
        </NetworkGuard>
      ) : (
        <div className="mt-4">
          <ConfigErrorBanner />
        </div>
      )}

      <section className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="card">
          <h2 className="mb-2 inline-flex items-center gap-2 text-xl font-bold"><Trophy size={18} /> Verification notes</h2>
          <VerificationExplainer />
        </div>
        <div className="card text-sm flat-subtitle">
          Demo randomness is deterministic and demo-only. Supabase is convenience cache only. Source of truth is on-chain contract state and events.
        </div>
      </section>
    </main>
  )
}
