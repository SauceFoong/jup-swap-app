import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ids = searchParams.get('ids')

  if (!ids) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 })
  }

  try {
    // Try multiple price API endpoints
    const endpoints = [
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${ids}&vs_currencies=usd`,
      `https://public-api.birdeye.so/public/price?address=${ids}`,
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        
        if (response.ok) {
          const data = await response.json()
          
          // Transform different API formats to consistent format
          if (endpoint.includes('coingecko')) {
            const price = data[ids]?.usd || 0
            return NextResponse.json({
              data: {
                [ids]: { price }
              }
            })
          } else if (endpoint.includes('birdeye')) {
            return NextResponse.json({
              data: {
                [ids]: { price: data.value || 0 }
              }
            })
          }
        }
      } catch (err) {
        console.log(`Failed to fetch from ${endpoint}:`, err)
        continue
      }
    }

    // Fallback: return zero price instead of error
    console.log('All price APIs failed, returning zero price')
    return NextResponse.json({
      data: {
        [ids]: { price: 0 }
      }
    })
    
  } catch (error) {
    console.error('Error fetching token price:', error)
    // Return zero price instead of error to prevent breaking the UI
    return NextResponse.json({
      data: {
        [request.nextUrl.searchParams.get('ids')!]: { price: 0 }
      }
    })
  }
}