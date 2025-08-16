import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const inputMint = searchParams.get('inputMint')
  const outputMint = searchParams.get('outputMint')
  const amount = searchParams.get('amount')
  const slippageBps = searchParams.get('slippageBps') || '50'

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ 
      error: 'Missing required parameters: inputMint, outputMint, amount' 
    }, { status: 400 })
  }

  try {
    // Build URL exactly like Jupiter's example
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    
    
    // Use fetch exactly like Jupiter's example (no special headers)
    const response = await fetch(quoteUrl)
    
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Jupiter quote error:', response.status, errorText)
      return NextResponse.json({
        error: `Jupiter API error: ${response.status}`,
        details: errorText,
        url: quoteUrl
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}