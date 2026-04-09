import React, { useState } from 'react';
import { updateBondStatus } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';

export default function ProofReview({ bond }: { bond: any }) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (status: 'completed' | 'failed') => {
    if (!confirm(`Are you sure you want to mark this bond as ${status}? This action cannot be reversed.`)) return;
    
    setLoading(true);
    const result = await updateBondStatus(bond.id, status);
    
    if (result.error) {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  const isFinalized = bond.status === 'completed' || bond.status === 'failed';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Bond Details & Proofs</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={isFinalized || loading}
            onClick={() => handleStatusUpdate('failed')}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
            Mark as Failed
          </Button>
          <Button 
            size="sm"
            disabled={isFinalized || loading}
            onClick={() => handleStatusUpdate('completed')}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            Mark as Completed
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Participants Side */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">Participants ({bond.bond_participants?.length || 0})</h4>
          <div className="space-y-3">
            {bond.bond_participants?.map((participant: any) => (
              <div key={participant.user_id} className="bg-background border rounded p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{participant.profiles?.email}</span>
                  <Badge variant="secondary" className="text-[10px]">{participant.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground font-mono truncate mb-2">
                  {participant.profiles?.wallet_address || 'No wallet'}
                </div>
                <div className="flex justify-between text-xs">
                  <span>Joined: {new Date(participant.joined_at).toLocaleDateString()}</span>
                  <span>Payout: <strong className={participant.payout_status === 'claimed' ? 'text-green-500' : ''}>{participant.payout_status}</strong></span>
                </div>
              </div>
            ))}
            {(!bond.bond_participants || bond.bond_participants.length === 0) && (
              <p className="text-sm text-muted-foreground italic">No participants yet.</p>
            )}
          </div>
        </div>

        {/* Proofs Side */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">Submitted Proofs ({bond.proof_submissions?.length || 0})</h4>
          <div className="space-y-3">
            {bond.proof_submissions?.map((proof: any) => (
              <div key={proof.id} className="bg-background border rounded p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{proof.profiles?.email}</span>
                  <span className="text-xs text-muted-foreground">{new Date(proof.submitted_at).toLocaleDateString()}</span>
                </div>
                <div className="text-xs mt-2 bg-muted/50 p-2 rounded">
                  <p className="font-semibold mb-1">Notes:</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{proof.notes || 'No notes provided.'}</p>
                </div>
                {proof.proof_url && (
                  <a 
                    href={proof.proof_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center mt-3 text-xs text-blue-500 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" /> View Associated Link
                  </a>
                )}
              </div>
            ))}
            {(!bond.proof_submissions || bond.proof_submissions.length === 0) && (
              <p className="text-sm text-muted-foreground italic">No proofs submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}