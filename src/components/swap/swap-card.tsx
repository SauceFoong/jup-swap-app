'use client';

import { ReactNode } from 'react';

interface SwapCardProps {
  children: ReactNode;
}

export function SwapCard({ children }: SwapCardProps) {
  return (
    <div className="bg-jupiter-dark border border-gray-700 rounded-3xl shadow-2xl backdrop-blur-sm">
      {children}
    </div>
  );
}