import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-rose-500/10 p-6 rounded-full text-rose-500 mb-6">
            <AlertTriangle size={64} />
          </div>
          
          <h1 className="text-2xl font-black text-foreground mb-2">Ops! Algo deu errado.</h1>
          <p className="text-muted-foreground mb-8 max-w-[320px]">
            Ocorreu um erro inesperado. Tente recarregar a página ou voltar para o início.
          </p>

          <div className="flex flex-col w-full gap-3 max-w-[280px]">
            <Button 
              onClick={() => window.location.reload()} 
              variant="primary"
              className="w-full gap-2 h-12"
            >
              <RotateCcw size={18} />
              Tentar Novamente
            </Button>
            
            <Button 
              onClick={this.handleReset} 
              variant="outline"
              className="w-full gap-2 h-12"
            >
              <Home size={18} />
              Ir para o Início
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-secondary rounded-xl text-left overflow-auto max-w-full">
              <p className="text-xs font-mono text-rose-500">{this.state.error?.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
