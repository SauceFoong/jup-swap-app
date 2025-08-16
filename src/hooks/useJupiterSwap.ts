import { useState, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { jupiterAPI, JupiterQuote, JupiterAPI } from '@/lib/jupiter-api'

export interface Token {
  symbol: string
  name: string
  logoURI: string
  address: string
  decimals: number
}

export interface SwapState {
  quote: JupiterQuote | null
  loading: boolean
  error: string | null
  priceImpact: number
  rate: number
  usdValue: number
}

export function useJupiterSwap() {
  const { connection } = useConnection()
  const { wallet, publicKey, signTransaction } = useWallet()
  const [swapState, setSwapState] = useState<SwapState>({
    quote: null,
    loading: false,
    error: null,
    priceImpact: 0,
    rate: 0,
    usdValue: 0
  })
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})

  // Fetch token prices
  const fetchTokenPrice = useCallback(async (tokenAddress: string) => {
    try {
      const price = await jupiterAPI.getTokenPrice(tokenAddress)
      setTokenPrices(prev => ({
        ...prev,
        [tokenAddress]: price
      }))
      return price
    } catch (error) {
      console.error('Error fetching token price:', error)
      return 0
    }
  }, [])

  // Get quote for swap
  const getQuote = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: number,
    slippage: number = 50
  ) => {
    if (!amount || amount <= 0) {
      setSwapState(prev => ({
        ...prev,
        quote: null,
        rate: 0,
        priceImpact: 0,
        usdValue: 0
      }))
      return null
    }

    setSwapState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const tokenAmount = JupiterAPI.toTokenAmount(amount, fromToken.decimals)
      const quote = await jupiterAPI.getQuote(
        fromToken.address,
        toToken.address,
        tokenAmount,
        slippage * 100 // Convert to basis points
      )

      const outAmount = JupiterAPI.fromTokenAmount(quote.outAmount, toToken.decimals)
      const rate = outAmount / amount
      const priceImpact = parseFloat(quote.priceImpactPct) || 0

      // Get USD value
      const fromTokenPrice = await fetchTokenPrice(fromToken.address)
      const usdValue = amount * fromTokenPrice

      setSwapState(prev => ({
        ...prev,
        quote,
        loading: false,
        rate,
        priceImpact,
        usdValue
      }))

      return quote
    } catch (error) {
      console.error('Error getting quote:', error)
      
      // Handle specific RPC/API errors
      let errorMessage = 'Failed to get quote'
      if (error instanceof Error) {
        if (error.message.includes('403') || error.message.includes('forbidden')) {
          errorMessage = 'RPC endpoint access denied. Try switching to a different network in settings.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Try switching to a different RPC endpoint.'
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Network connection issue. Try refreshing the page.'
        } else {
          errorMessage = error.message
        }
      }
      
      setSwapState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      return null
    }
  }, [fetchTokenPrice])

  // Execute swap
  const executeSwap = useCallback(async (
    quote: JupiterQuote
  ): Promise<string | null> => {
    if (!publicKey || !wallet || !signTransaction) {
      throw new Error('Wallet not connected')
    }

    setSwapState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Get swap transaction
      const swapTransaction = await jupiterAPI.getSwapTransaction(
        quote,
        publicKey.toString()
      )

      // Execute the swap
      const signature = await jupiterAPI.executeSwap(
        connection,
        swapTransaction,
        { signTransaction }
      )

      setSwapState(prev => ({
        ...prev,
        loading: false,
        quote: null // Clear quote after successful swap
      }))

      return signature
    } catch (error) {
      console.error('Error executing swap:', error)
      setSwapState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Swap failed'
      }))
      throw error
    }
  }, [connection, publicKey, wallet, signTransaction])

  // Calculate output amount based on current quote
  const calculateOutputAmount = useCallback((
    inputAmount: number,
    fromToken: Token,
    toToken: Token
  ): string => {
    if (!swapState.quote || !inputAmount) return ''
    
    const outputAmount = JupiterAPI.fromTokenAmount(
      swapState.quote.outAmount,
      toToken.decimals
    )
    
    return outputAmount.toFixed(6).replace(/\.?0+$/, '')
  }, [swapState.quote])

  return {
    swapState,
    getQuote,
    executeSwap,
    calculateOutputAmount,
    tokenPrices,
    fetchTokenPrice,
    isWalletConnected: !!publicKey
  }
}