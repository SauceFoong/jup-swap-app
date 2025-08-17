# Jupiter Swap App

A modern, feature-rich decentralized exchange (DEX) interface built with Next.js that integrates with Jupiter's aggregator protocol on Solana. This application provides a seamless token swapping experience with real-time quotes, wallet integration, and comprehensive error handling.

## ✨ Features

### Core Functionality
- **Token Swapping**: Instant token swaps powered by Jupiter's v6 aggregator
- **Real-time Quotes**: Live pricing with automatic quote updates and slippage protection
- **Multiple Swap Modes**: 
  - Instant swaps (fully functional)
  - Trigger-based swaps (UI ready)
  - Recurring swaps (UI ready)
- **Price Impact Calculation**: Real-time price impact and exchange rate display
- **USD Value Tracking**: Live USD valuations for all supported tokens

### Wallet Integration
- **Multi-wallet Support**: Compatible with all Solana wallet adapters
- **Connection Management**: Seamless wallet connection and disconnection
- **Transaction Signing**: Secure transaction signing workflow
- **Balance Validation**: Automatic balance checking and validation

### User Experience
- **Modern UI**: Clean, responsive design built with Tailwind CSS and Radix UI
- **Dark Theme**: Jupiter-inspired dark theme with custom styling
- **Mobile Responsive**: Optimized for mobile and desktop experiences
- **Loading States**: Smooth loading animations and state management
- **Error Handling**: Comprehensive error messages and user feedback

### Technical Features
- **TypeScript**: Fully typed for enhanced developer experience
- **API Routes**: Dedicated backend endpoints for Jupiter integration
- **State Management**: Efficient state management with React hooks and Jotai
- **Real-time Updates**: Automatic quote refresh and price updates
- **Slippage Protection**: Configurable slippage tolerance (default 0.5%)

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.x, Radix UI components
- **Blockchain**: Solana Web3.js, Solana Wallet Adapter
- **API Integration**: Jupiter v6 API
- **State Management**: React hooks, Jotai, TanStack Query
- **Development**: ESLint, Prettier, PostCSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

#### Clone the repository
```shell
git clone <repository-url>
cd jup-swap-app
```

#### Install dependencies
```shell
npm install
# or
pnpm install
# or
yarn install
```

#### Start the development server
```shell
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for production
```shell
npm run build
npm run start
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/jupiter/       # Jupiter API routes
│   │   ├── quote/         # Quote generation endpoint
│   │   ├── swap/          # Swap transaction endpoint
│   │   ├── price/         # Token pricing endpoint
│   │   └── submit/        # Transaction submission endpoint
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── swap/             # Swap-related components
│   │   ├── swap-feature.tsx    # Main swap interface
│   │   ├── swap-card.tsx       # Swap card container
│   │   ├── swap-input.tsx      # Amount input component
│   │   ├── swap-button.tsx     # Swap execution button
│   │   └── token-selector.tsx  # Token selection component
│   ├── ui/               # Reusable UI components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
│   └── useJupiterSwap.ts # Jupiter swap logic hook
├── lib/                  # Utility libraries
│   ├── jupiter-api.ts    # Jupiter API client
│   └── utils.ts          # Utility functions
└── styles/               # Global styles
```

## 🔧 Configuration

### Supported Tokens
The app comes pre-configured with popular Solana tokens:
- **SOL** (Solana)
- **USDC** (USD Coin)
- **USDT** (Tether USD)
- **JUP** (Jupiter)

Additional tokens can be added by modifying the `POPULAR_TOKENS` array in `src/components/swap/swap-feature.tsx`.

### Slippage Settings
Default slippage is set to 0.5%. This can be modified in the settings panel or programmatically in the swap component.

### RPC Configuration
The application uses Solana's mainnet-beta RPC endpoint. For production use, consider using a dedicated RPC provider like:
- Helius
- QuickNode
- Alchemy
- GenesisGo

## 🧪 API Endpoints

### Quote Endpoint
```
GET /api/jupiter/quote?inputMint={mint}&outputMint={mint}&amount={amount}&slippageBps={slippage}
```

### Swap Endpoint
```
POST /api/jupiter/swap
Body: { quoteResponse, userPublicKey, wrapAndUnwrapSol, dynamicComputeUnitLimit, prioritizationFeeLamports }
```

### Price Endpoint
```
GET /api/jupiter/price?ids={tokenMint}
```

### Submit Endpoint
```
POST /api/jupiter/submit
Body: { signedTransaction, lastValidBlockHeight }
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Jupiter Protocol](https://jup.ag/) for providing the aggregator infrastructure
- [Solana Foundation](https://solana.org/) for the blockchain platform
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) for wallet integration

## 📞 Support

For support and questions:
- Check the [Jupiter Documentation](https://docs.jup.ag/)
- Review [Solana Documentation](https://docs.solana.com/)
- Open an issue in this repository
