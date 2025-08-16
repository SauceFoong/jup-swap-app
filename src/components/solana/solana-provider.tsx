'use client'

import { WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import dynamic from 'next/dynamic'
import { ReactNode, useCallback } from 'react'
import '@solana/wallet-adapter-react-ui/styles.css'

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
  ssr: false,
})

export function SolanaProvider({ children }: { children: ReactNode }) {
  // Use a dummy endpoint since we're moving all RPC calls to backend
  // Only wallet connection/signing happens on frontend
  const endpoint = 'http://localhost'
  
  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error)
    
    // More user-friendly error messages
    if (error.message?.includes('rejected')) {
      console.log('User rejected wallet connection')
    } else if (error.message?.includes('timeout')) {
      console.error('Wallet connection timeout')
    } else {
      console.error('Wallet error details:', error)
    }
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
