'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SwapButton({ onClick, disabled = false, isLoading = false }: SwapButtonProps) {
  const getButtonText = () => {
    if (isLoading) return 'Swapping...';
    if (disabled) return 'Enter amount';
    return 'Swap';
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full h-14 bg-gradient-to-r from-[#00D4AA] to-[#00B4D8] hover:from-[#00C4AA] hover:to-[#00A4C8] text-black font-semibold text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {getButtonText()}
    </Button>
  );
}