import React from 'react'

export function AppFooter() {
  return (
    <footer className="text-center p-2 bg-jupiter-dark dark:bg-jupiter-dark dark:text-neutral-400 text-xs">
      Created by{' '}
      <a
        className="link hover:text-neutral-500 dark:hover:text-white"
        href="https://jup.ag/"
        target="_blank"
        rel="noopener noreferrer"
      >
        by SauceFoong
      </a>
    </footer>
  )
}
