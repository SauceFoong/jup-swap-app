'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import { JupiterNavbar } from '@/components/jupiter-navbar'
import React from 'react'
import { AppFooter } from '@/components/app-footer'

export function AppLayout({
  children,
}: {
  children: React.ReactNode
  links?: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen bg-jupiter-dark">
        <JupiterNavbar />
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <AppFooter />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
