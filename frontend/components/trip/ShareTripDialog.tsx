'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { tripsApi } from '@/lib/api/trips';

interface ShareTripDialogProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareTripDialog({ tripId, isOpen, onClose }: ShareTripDialogProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleToggleSharing = async (checked: boolean) => {
    setIsLoading(true);
    try {
      if (checked) {
        const { shareLink } = await tripsApi.shareTrip(tripId);
        setShareLink(shareLink);
        setIsSharing(true);
      } else {
        await tripsApi.disableSharing(tripId);
        setShareLink('');
        setIsSharing(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
          <DialogDescription>
            Share your itinerary with friends or publish it for others to copy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="share-toggle" className="text-sm font-medium leading-none cursor-pointer">
              Enable Public Link
            </Label>
            <Switch
              id="share-toggle"
              checked={isSharing}
              onCheckedChange={handleToggleSharing}
              disabled={isLoading}
            />
          </div>

          {isSharing && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input 
                  readOnly 
                  value={shareLink} 
                  className="bg-slate-50 font-mono text-xs" 
                />
                <Button onClick={handleCopy} variant="secondary">
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="default">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
