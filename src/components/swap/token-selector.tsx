'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  address: string;
  decimals: number;
}

interface TokenSelectorProps {
  token: Token;
  onTokenSelect: (token: Token) => void;
  tokens: Token[];
}

export function TokenSelector({ token, onTokenSelect, tokens }: TokenSelectorProps) {
  const [search, setSearch] = useState('');

  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl px-3 py-2 transition-colors">
          <Image 
            src={token.logoURI} 
            alt={token.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-sm font-bold text-white hidden">
            {token.symbol === 'USDC' ? '$' : token.symbol === 'SOL' ? '◎' : token.symbol.charAt(0)}
          </div>
          <span className="text-white font-medium text-lg">{token.symbol}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-[#1a1a1a] border-gray-700">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#2a2a2a] border-gray-600 text-white"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredTokens.map((t) => (
            <DropdownMenuItem
              key={t.address}
              onClick={() => onTokenSelect(t)}
              className="flex items-center space-x-3 p-3 hover:bg-[#2a2a2a] cursor-pointer"
            >
              <div className="relative">
                <Image 
                  src={t.logoURI} 
                  alt={t.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white hidden">
                  {t.symbol.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{t.symbol}</div>
                <div className="text-gray-400 text-sm">{t.name}</div>
              </div>
              <div className="text-gray-400 text-sm">0</div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}