import { Connection, VersionedTransaction } from '@solana/web3.js'

export interface JupiterQuote {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null | { amount: string; feeBps: number }
  priceImpactPct: string
  routePlan: RouteStep[]
  contextSlot: number
  timeTaken: number
}

export interface RouteStep {
  swapInfo: {
    ammKey: string
    label: string
    inputMint: string
    outputMint: string
    inAmount: string
    outAmount: string
    feeAmount: string
    feeMint: string
  }
  percent: number
}

export interface SwapTransaction {
  swapTransaction: string
  lastValidBlockHeight: number
  prioritizationFeeLamports: number
}

export class JupiterAPI {
  private baseURL = '/api/jupiter'

  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ): Promise<JupiterQuote> {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippageBps.toString()
    })

    const response = await fetch(`${this.baseURL}/quote?${params}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Jupiter API error: ${errorData.error || response.statusText}`)
    }

    return response.json()
  }

  async getSwapTransaction(
    quote: JupiterQuote,
    userPublicKey: string,
    wrapAndUnwrapSol: boolean = true,
    dynamicComputeUnitLimit: boolean = true,
    prioritizationFeeLamports: number | 'auto' = 'auto'
  ): Promise<SwapTransaction> {
    const response = await fetch(`${this.baseURL}/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey,
        wrapAndUnwrapSol,
        dynamicComputeUnitLimit,
        prioritizationFeeLamports
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Jupiter Swap API error: ${errorData.error || response.statusText}`)
    }

    return response.json()
  }

  async executeSwap(
    connection: Connection,
    swapTransaction: SwapTransaction,
    wallet: { signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction> }
  ): Promise<string> {
    try {
      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction.swapTransaction, 'base64')
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction)

      // Submit signed transaction to backend
      const response = await fetch('/api/jupiter/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signedTransaction: Buffer.from(signedTransaction.serialize()).toString('base64'),
          lastValidBlockHeight: swapTransaction.lastValidBlockHeight
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to submit transaction')
      }

      const { signature } = await response.json()
      return signature
    } catch (error) {
      console.error('Swap execution error:', error)
      
      // Handle different types of wallet errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()
        
        // User rejected/cancelled the transaction
        if (errorMessage.includes('user rejected') || 
            errorMessage.includes('user declined') ||
            errorMessage.includes('cancelled') ||
            errorMessage.includes('denied')) {
          throw new Error('Transaction cancelled by user')
        }
        
        // Insufficient funds
        if (errorMessage.includes('insufficient funds') || 
            errorMessage.includes('insufficient balance')) {
          throw new Error('Insufficient funds for this transaction')
        }
        
        // Network/connection errors
        if (errorMessage.includes('network') || 
            errorMessage.includes('timeout') ||
            errorMessage.includes('connection')) {
          throw new Error('Network error. Please try again.')
        }
        
        // Slippage errors
        if (errorMessage.includes('slippage') || 
            errorMessage.includes('price impact')) {
          throw new Error('Price changed too much. Please try with higher slippage.')
        }
        
        // Address Lookup Table errors
        if (errorMessage.includes('address table') || 
            errorMessage.includes('lookup table') ||
            errorMessage.includes('alt')) {
          throw new Error('Transaction data is outdated. Please try again.')
        }
        
        // Transaction simulation errors
        if (errorMessage.includes('simulation failed') ||
            errorMessage.includes('transaction') ||
            errorMessage.includes('blockhash')) {
          throw new Error('Transaction failed to simulate. Please refresh and try again.')
        }
        
        // Generic wallet error
        if (errorMessage.includes('wallet')) {
          throw new Error('Wallet error. Please try again.')
        }
        
        // Pass through the original error message if it's user-friendly
        throw new Error(error.message)
      }
      
      throw new Error('Transaction failed. Please try again.')
    }
  }

  // Helper function to convert token amount to lamports
  static toTokenAmount(amount: number, decimals: number): number {
    return Math.floor(amount * Math.pow(10, decimals))
  }

  // Helper function to convert lamports to token amount
  static fromTokenAmount(lamports: string, decimals: number): number {
    return parseInt(lamports) / Math.pow(10, decimals)
  }

  // Get token price in USD
  async getTokenPrice(tokenMint: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseURL}/price?ids=${tokenMint}`)
      
      if (!response.ok) {
        return 0
      }

      const data = await response.json()
      return data.data?.[tokenMint]?.price || 0
    } catch (error) {
      console.error('Error fetching token price:', error)
      return 0
    }
  }
}

export const jupiterAPI = new JupiterAPI()