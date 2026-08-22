'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full w-full p-6 text-center space-y-4">
          <div className="p-4 bg-red-100 rounded-full text-red-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="text-slate-500 max-w-md">
            We encountered an unexpected error. Our team has been notified. 
            Please try refreshing the page.
          </p>
          <div className="flex gap-4 mt-2">
            <Button onClick={this.handleRetry}>Retry</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
