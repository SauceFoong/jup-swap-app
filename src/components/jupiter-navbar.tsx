'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Settings, Menu, X, ChevronDown } from 'lucide-react'
import { WalletButton } from '@/components/solana/solana-provider'

export function JupiterNavbar() {
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navigationItems = [
    { label: 'Swap', href: '/', active: pathname === '/' },
    { label: 'Pro', href: '/pro', active: pathname === '/pro' },
    { 
      label: 'Perps', 
      href: '/perps', 
      active: pathname === '/perps',
      badge: 'NEW',
      badgeColor: 'bg-green-500'
    },
    { label: 'Limit', href: '/limit', active: pathname === '/limit' },
    { label: 'Portfolio', href: '/portfolio', active: pathname === '/portfolio' },
    { label: 'More', href: '/more', active: pathname === '/more', hasDropdown: true },
  ]

  return (
    <nav className="bg-jupiter-dark border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Jupiter Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/32x32j.png" 
                alt="Jupiter" 
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-white font-semibold text-lg">Jupiter</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tokens or wallet"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right section - Settings and Connect */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tokens or wallet"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.active
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Mobile Settings and Connect */}
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <button className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <div className="px-3">
                  <WalletButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}