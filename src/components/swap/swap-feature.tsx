'use client';

import { useState, useEffect } from 'react';
import { SwapCard } from './swap-card';
import { TokenSelector } from './token-selector';
import { ArrowUpDown, Bell, RefreshCw, Rocket, Settings } from 'lucide-react';
import { useJupiterSwap } from '@/hooks/useJupiterSwap';
import { toast } from 'sonner';

interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  address: string;
  decimals: number;
}

const POPULAR_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    logoURI: '/tokens/sol.png',
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: '/tokens/usdc.png', 
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: '/tokens/usdt.png',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    logoURI: '/tokens/jup.png',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
  },
];

type SwapMode = 'instant' | 'trigger' | 'recurring';

export function SwapFeature() {
  const [mode, setMode] = useState<SwapMode>('instant');
  const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[1]); // USDC
  const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[0]); // SOL
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage] = useState('0.5');
  
  const {
    swapState,
    getQuote,
    executeSwap,
    tokenPrices,
    fetchTokenPrice,
    isWalletConnected
  } = useJupiterSwap();

  // Fetch token prices on mount
  useEffect(() => {
    POPULAR_TOKENS.forEach(token => {
      fetchTokenPrice(token.address);
    });
  }, [fetchTokenPrice]);

  // Get quote when amount or tokens change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        getQuote(fromToken, toToken, parseFloat(fromAmount), parseFloat(slippage));
      } else {
        setToAmount('');
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [fromAmount, fromToken, toToken, slippage, getQuote]);

  // Update output amount when quote changes
  useEffect(() => {
    if (swapState.quote && fromAmount) {
      const outputAmount = formatNumber(parseFloat(swapState.quote.outAmount) / Math.pow(10, toToken.decimals));
      setToAmount(outputAmount);
    }
  }, [swapState.quote, fromAmount, toToken.decimals]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Clear amounts when swapping tokens
    setFromAmount('');
    setToAmount('');
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 0.000001) return num.toExponential(2);
    if (num < 1) return num.toFixed(8).replace(/\.?0+$/, '');
    if (num < 1000) return num.toFixed(6).replace(/\.?0+$/, '');
    if (num < 1000000) return num.toFixed(2).replace(/\.?0+$/, '');
    return num.toExponential(2);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleSwap = async () => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!swapState.quote) {
      toast.error('No quote available');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const signature = await executeSwap(swapState.quote);
      if (signature) {
        toast.success('Swap completed successfully!', {
          description: `Transaction: ${signature.slice(0, 8)}...${signature.slice(-8)}`
        });
        setFromAmount('');
        setToAmount('');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Simple error handling
      if (errorMessage.includes('cancelled by user')) {
        toast.info('Transaction cancelled', {
          description: 'You cancelled the swap transaction'
        });
      } else if (errorMessage.includes('Insufficient funds')) {
        toast.error('Insufficient funds', {
          description: 'You don\'t have enough tokens for this swap'
        });
      } else {
        toast.error('Swap failed', {
          description: 'Please try again in a moment'
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <SwapCard>
        <div className="p-4 space-y-4">
          {/* Tab Navigation */}
          <div className="flex bg-gray-800/50 rounded-2xl p-1">
            <button
              onClick={() => setMode('instant')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                mode === 'instant'
                  ? 'bg-button-color text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Rocket className="w-4 h-4" />
              Instant
            </button>
            <button
              onClick={() => setMode('trigger')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                mode === 'trigger'
                  ? 'bg-button-color text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              Trigger
            </button>
            <button
              onClick={() => setMode('recurring')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                mode === 'recurring'
                  ? 'bg-button-color text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Recurring
            </button>
          </div>

          {/* Settings Panel */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Manual</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-300">{slippage}%</span>
              <Settings className="w-4 h-4 text-gray-400" />
            </div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Selling Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Selling</label>
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <TokenSelector
                  token={fromToken}
                  onTokenSelect={setFromToken}
                  tokens={POPULAR_TOKENS}
                />
                <div className="text-right">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="bg-transparent text-right text-2xl font-semibold text-white outline-none min-w-0 max-w-[120px] truncate"
                    placeholder="0"
                  />
                  <div className="text-sm text-gray-400">
                    {swapState.usdValue && swapState.usdValue > 0 ? 
                      `$${swapState.usdValue.toFixed(2)}` : 
                      tokenPrices[fromToken.address] && tokenPrices[fromToken.address] > 0 && fromAmount ?
                      `$${(tokenPrices[fromToken.address] * parseFloat(fromAmount || '0')).toFixed(2)}` :
                      ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="p-2 bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Buying Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Buying</label>
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <TokenSelector
                  token={toToken}
                  onTokenSelect={setToToken}
                  tokens={POPULAR_TOKENS}
                />
                <div className="text-right min-w-0 max-w-[140px]">
                  <div className="text-2xl font-semibold text-white truncate" title={toAmount}>
                    {swapState.loading ? (
                      <div className="animate-pulse">...</div>
                    ) : toAmount || '0'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tokenPrices[toToken.address] && tokenPrices[toToken.address] > 0 && toAmount ? 
                      `$${(tokenPrices[toToken.address] * parseFloat(toAmount || '0')).toFixed(2)}` : 
                      ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Routers */}
          <div className="text-sm text-gray-400">
            <span className="border-b border-dotted border-gray-600">Routers: Auto</span>
          </div>

          {/* Swap Button */}
          <button 
            onClick={handleSwap}
            disabled={!isWalletConnected || swapState.loading || !fromAmount || !swapState.quote}
            className="w-full bg-button-color hover:bg-button-color/80 disabled:bg-gray-600 disabled:text-gray-400 text-black font-semibold py-4 rounded-2xl transition-colors"
          >
            {swapState.loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                {swapState.quote ? 'Swapping...' : 'Getting Quote...'}
              </div>
            ) : !isWalletConnected ? (
              'Connect Wallet'
            ) : !fromAmount ? (
              'Enter Amount'
            ) : !swapState.quote ? (
              'No Quote Available'
            ) : (
              'Swap'
            )}
          </button>

          {/* Rate and Fee Information */}
          {swapState.quote && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">
                  1 {fromToken.symbol} ≈ {swapState.rate.toFixed(6)} {toToken.symbol}
                </span>
                <RefreshCw className="w-3 h-3 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">
                  🌐 Jupiter v6
                </div>
                {swapState.priceImpact > 0 && (
                  <span className={`font-medium ${swapState.priceImpact > 1 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {swapState.priceImpact.toFixed(2)}% Impact
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </SwapCard>
    </div>
  );
}