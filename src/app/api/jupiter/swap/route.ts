import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    
    
    // Build request body exactly like Jupiter's example
    const swapRequestBody = {
      quoteResponse: requestBody.quoteResponse,
      userPublicKey: requestBody.userPublicKey,
      wrapAndUnwrapSol: requestBody.wrapAndUnwrapSol !== false, // default true
      dynamicComputeUnitLimit: requestBody.dynamicComputeUnitLimit || true,
      prioritizationFeeLamports: requestBody.prioritizationFeeLamports || 'auto'
    }


    // Use fetch exactly like Jupiter's example
    const response = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(swapRequestBody)
    })


    if (!response.ok) {
      const errorText = await response.text()
      console.error('Jupiter swap error:', response.status, errorText)
      return NextResponse.json({
        error: `Jupiter Swap API error: ${response.status}`,
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error creating swap transaction:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create swap transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}