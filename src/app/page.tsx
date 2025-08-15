import { SwapFeature } from '@/components/swap/swap-feature';

export default function Home() {
  return (
    <div className="min-h-screen bg-jupiter-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[80vh]">
          <SwapFeature />
        </div>
      </div>
    </div>
  );
}
