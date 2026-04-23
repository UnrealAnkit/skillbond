import { logUserActivity } from '@/lib/logger';

/**
 * Frontend helper to ask backend to sponsor a signed Soroban transaction.
 * Usually called right before submitting via Freight/SorobanRPC.
 *
 * Usage:
 * const userSignedXdr = await await window.freighterApi.signTransaction(txXdr, 'TESTNET');
 * const sponsoredXdr = await requestFeeSponsorship(userSignedXdr);
 * const submitResult = await submitToSorobanRpc(sponsoredXdr);
 */
export async function requestFeeSponsorship(signedXdr: string, network: 'TESTNET' | 'PUBLIC' = 'TESTNET'): Promise<string> {
  try {
    const res = await fetch('/api/sponsor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xdr: signedXdr, network }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Failed to sponsor transaction');
    }

    return data.sponsoredXdr;
  } catch (error: any) {
    console.error('requestFeeSponsorship =>', error);
    throw error; // Re-throw to caller to handle UI error states
  }
}

