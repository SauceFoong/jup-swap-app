'use client';

import { useState } from 'react';
import { SwapCard } from './swap-card';
import { TokenSelector } from './token-selector';
import { SwapInput } from './swap-input';
import { SwapButton } from './swap-button';
import { ArrowUpDown, Bell, RefreshCw, Rocket, Settings } from 'lucide-react';

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
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('0.00519196');
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState('0.5');

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
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
    if (value && !isNaN(Number(value))) {
      const mockRate = 0.00519196;
      const result = Number(value) * mockRate;
      setToAmount(formatNumber(result));
    } else {
      setToAmount('');
    }
  };

  const handleSwap = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setFromAmount('');
      setToAmount('');
    }, 2000);
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
                  <div className="text-sm text-gray-400">$1</div>
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
                  <div className="text-2xl font-semibold text-white truncate" title={toAmount}>{toAmount}</div>
                  <div className="text-sm text-gray-400">$1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Routers */}
          <div className="text-sm text-gray-400">
            <span className="border-b border-dotted border-gray-600">Routers: Auto</span>
          </div>

          {/* Connect Button */}
          <button className="w-full bg-button-color hover:bg-button-color/80 text-black font-semibold py-4 rounded-2xl transition-colors">
            Connect
          </button>

          {/* Rate and Fee Information */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Rate</span>
              <span className="text-white">1 USDC ≈ 0.0051919 SOL</span>
              <RefreshCw className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">
                🌐 Metis v1.6
              </div>
              <span className="text-[#C8FF02] font-medium">0% FEE</span>
            </div>
          </div>
        </div>
      </SwapCard>
    </div>
  );
}