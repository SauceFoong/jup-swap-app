import { NextRequest, NextResponse } from 'next/server'
import { Connection, VersionedTransaction } from '@solana/web3.js'

export async function POST(request: NextRequest) {
  try {
    const { signedTransaction, lastValidBlockHeight } = await request.json()
    
    // Use real RPC endpoint on backend
    const connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    )
    
    // Deserialize the signed transaction
    const txBuffer = Buffer.from(signedTransaction, 'base64')
    const transaction = VersionedTransaction.deserialize(txBuffer)
    
    // Submit to network
    const signature = await connection.sendRawTransaction(transaction.serialize(), {
      skipPreflight: true,
      maxRetries: 3
    })
    
    // Confirm the transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: transaction.message.recentBlockhash || '',
      lastValidBlockHeight
    }, 'confirmed')
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err}`)
    }
    
    return NextResponse.json({ signature })
    
  } catch (error) {
    console.error('Error submitting transaction:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}