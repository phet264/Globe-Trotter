// @ts-nocheck
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Bot, User, Send, X, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';

export function CopilotChat({ tripId }: { tripId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/v1/ai/chat',
    body: { tripId },
  });

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleApplyAction = async (proposal: any) => {
    try {
      const res = await fetch('/api/v1/ai/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, actionType: proposal.actionType, parameters: proposal.parameters }),
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        queryClient.invalidateQueries({ queryKey: ['trip-full', tripId] });
        queryClient.invalidateQueries({ queryKey: ['intelligence', tripId] });
        append({ role: 'user', content: 'I have applied your proposed changes.' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center z-50 text-white border-2 border-white/20"
      >
        <Sparkles size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm font-display">Travel Copilot</h3>
            <p className="text-xs text-white/70">GlobeTrotter AI</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-70">
            <Sparkles size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">How can I help plan your trip?</p>
          </div>
        )}

        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-br-sm' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
            }`}>
              {m.content}
              
              {/* Render Tool Invocations that require confirmation */}
              {m.toolInvocations?.map((toolInv: any) => {
                if (toolInv.toolName === 'propose_action' && 'result' in toolInv) {
                  const proposal = toolInv.result.proposal;
                  return (
                    <div key={toolInv.toolCallId} className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-center gap-2 text-blue-800 font-bold mb-1 text-xs uppercase tracking-wider">
                        <AlertCircle size={14} /> Action Proposal
                      </div>
                      <p className="text-blue-900 text-sm mb-2">{proposal.description}</p>
                      <div className="bg-white/60 p-2 rounded text-xs text-blue-800 mb-3 font-medium">
                        Impact: {proposal.expectedImpact}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full h-8" onClick={() => handleApplyAction(proposal)}>
                          <Check size={14} className="mr-1.5" /> Apply
                        </Button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-bl-sm p-3 px-4 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your budget, itinerary..."
            className="pr-12 rounded-full h-11 bg-slate-50 border-slate-200 focus-visible:ring-slate-400 text-sm"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()} 
            className="absolute right-1.5 h-8 w-8 rounded-full bg-slate-900 text-white hover:bg-slate-800"
          >
            <Send size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
