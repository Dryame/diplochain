import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center space-y-8 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center border border-red-100 shadow-xl shadow-red-500/10">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter font-serif uppercase italic italic">
                Oups, Quelque chose a mal tourné
              </h2>
              <p className="text-lg text-slate-500 font-serif leading-relaxed">
                Une erreur critique est survenue dans l'infrastructure de DiploChain. 
                Ne vous inquiétez pas, vos données sécurisées sur la blockchain ne sont pas affectées.
              </p>
              {this.state.error && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-400 break-all max-w-md mx-auto">
                  {this.state.error.toString()}
                </div>
              )}
            </div>
            <button 
              onClick={this.handleReset}
              className="btn-primary flex items-center space-x-3 px-10"
            >
              <RefreshCcw size={18} />
              <span>Redémarrer l'Application</span>
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
