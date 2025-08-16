import { NextResponse } from 'next/server'

export async function GET() {
  console.log('Testing Jupiter API exactly like their documentation...')
  
  try {
    // Exact URL from Jupiter documentation
    const quoteUrl = 'https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50'
    
    console.log('Fetching:', quoteUrl)
    console.log('Environment:', {
      nodeVersion: process.version,
      platform: process.platform,
      userAgent: process.env.USER_AGENT || 'not-set'
    })
    
    // Exact fetch like Jupiter example - no headers
    const quoteResponse = await fetch(quoteUrl)
    
    console.log('Quote Response Status:', quoteResponse.status)
    console.log('Quote Response Headers:', Object.fromEntries(quoteResponse.headers.entries()))
    
    if (!quoteResponse.ok) {
      const errorText = await quoteResponse.text()
      console.error('Quote Error:', errorText)
      
      return NextResponse.json({
        test: 'quote',
        success: false,
        status: quoteResponse.status,
        error: errorText,
        environment: {
          nodeVersion: process.version,
          platform: process.platform
        }
      })
    }

    const quoteData = await quoteResponse.json()
    console.log('Quote Success! Output amount:', quoteData.outAmount)

    // Now test swap API like Jupiter example
    const swapRequestBody = {
      quoteResponse: quoteData,
      userPublicKey: 'So11111111111111111111111111111111111111112', // Dummy public key for test
      wrapAndUnwrapSol: true
    }

    console.log('Testing swap API...')
    const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(swapRequestBody)
    })

    console.log('Swap Response Status:', swapResponse.status)
    
    if (!swapResponse.ok) {
      const swapErrorText = await swapResponse.text()
      console.error('Swap Error:', swapErrorText)
      
      return NextResponse.json({
        test: 'both',
        quote: { success: true, outputAmount: quoteData.outAmount },
        swap: { success: false, status: swapResponse.status, error: swapErrorText },
        conclusion: 'Quote works but swap fails - this might be expected with dummy public key'
      })
    }

    const swapData = await swapResponse.json()
    console.log('Swap Success! Transaction exists:', !!swapData.swapTransaction)

    return NextResponse.json({
      test: 'both', 
      success: true,
      quote: { 
        outputAmount: quoteData.outAmount,
        routes: quoteData.routePlan?.length || 0
      },
      swap: { 
        hasTransaction: !!swapData.swapTransaction,
        transactionLength: swapData.swapTransaction?.length || 0
      },
      conclusion: 'Both APIs working perfectly!'
    })

  } catch (error) {
    console.error('Direct Jupiter test failed:', error)
    
    return NextResponse.json({
      test: 'direct',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}