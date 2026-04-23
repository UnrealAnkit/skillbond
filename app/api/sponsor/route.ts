import { NextResponse } from 'next/server';
import { TransactionBuilder, Keypair, Networks, Transaction } from '@stellar/stellar-sdk';
import { logSystemEvent } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { xdr, network = 'TESTNET' } = await request.json();

    if (!xdr) {
      return NextResponse.json({ error: 'Missing transaction XDR' }, { status: 400 });
    }

    const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
    if (!sponsorSecret) {
      throw new Error('Server misconfiguration: SPONSOR_SECRET_KEY missing.');
    }

    const networkPassphrase = network === 'PUBLIC' ? Networks.PUBLIC : Networks.TESTNET;
    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);

    // Decode the inner transaction
    const innerTx = TransactionBuilder.fromXDR(xdr, networkPassphrase) as Transaction;

    // Wrap the transaction in a FeeBumpTransaction
    // Allocate a sufficient max fee (e.g., 5 XLM) to cover Soroban execution
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      "50000000", // 5 XLM max fee in stroops
      innerTx,
      networkPassphrase
    );

    // Sponsor signs the outer FeeBump transaction
    feeBumpTx.sign(sponsorKeypair);
    
    // Serialize back to XDR
    const sponsoredXdr = feeBumpTx.toXDR();

    return NextResponse.json({ 
      success: true, 
      sponsoredXdr,
      message: 'Transaction fee successfully sponsored'
    });

  } catch (error: any) {
    console.error('Sponsorship error:', error);
    // Use the error logging we built previously
    await logSystemEvent?.('ERROR', 'Fee_Sponsorship_Endpoint', error.message, { stack: error.stack });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
