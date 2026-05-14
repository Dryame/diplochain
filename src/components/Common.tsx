import React from 'react';
import { cn } from '../lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

import { BlockchainError, BlockchainErrorType } from '../services/blockchainService';

export const getBlockchainErrorMessage = (error: any) => {
  if (error instanceof BlockchainError) {
    switch (error.type) {
      case BlockchainErrorType.WALLET_NOT_FOUND:
        return "Portefeuille introuvable. Veuillez connecter votre extension Web3 (Metamask, etc.).";
      case BlockchainErrorType.TRANSACTION_REJECTED:
        return "Signature rejetée. Vous avez annulé la transaction dans votre portefeuille.";
      case BlockchainErrorType.INVALID_DATA:
        return "Données invalides. Le format du titre n'est pas conforme aux standards du registre.";
      case BlockchainErrorType.NETWORK_ERROR:
        return "Erreur de connexion sécurisée. Le noeud blockchain ne répond pas.";
      case BlockchainErrorType.INSUFFICIENT_FUNDS:
        return "Frais de gaz insuffisants. Le portefeuille ne possède pas assez d'ETH/MATIC pour l'ancrage.";
      default:
        return error.message;
    }
  }
  return error instanceof Error ? error.message : "Une erreur technique est survenue. Veuillez réessayer.";
};

export const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-4 py-2 rounded-none text-[11px] font-black uppercase tracking-[0.3em] border border-slate-900 bg-white", className)}>
    {children}
  </span>
);

export const ProgressBar = ({ steps, current }: { steps: string[], current: number }) => (
  <div className="flex justify-between items-center w-full px-8 py-12">
    {steps.map((step, i) => (
      <div key={step} className="flex flex-col items-center flex-1 mx-2 first:ml-0 last:mr-0 group">
        <div className={cn(
          "w-full h-1.5 transition-all duration-1000",
          i <= current ? "bg-slate-900 shadow-heavy" : "bg-slate-100"
        )} />
        <span className={cn(
          "mt-6 text-[10px] tracking-[0.4em] uppercase font-black whitespace-nowrap transition-colors",
          i === current ? "text-slate-900" : "text-slate-300"
        )}>{step}</span>
      </div>
    ))}
  </div>
);

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col items-center justify-center p-16 space-y-8", className)}>
    <div className="relative group">
      <div className="w-24 h-24 rounded-none border-[12px] border-slate-100 animate-pulse" />
      <Loader2 className="w-24 h-24 text-slate-900 animate-spin absolute inset-0 stroke-[3]" />
    </div>
    <span className="text-xs font-black uppercase tracking-[0.6em] text-slate-900 animate-pulse font-mono">Blockchain_Syncing_State_01</span>
  </div>
);

export const LoadingSkeleton = ({ className, count = 1 }: { className?: string, count?: number }) => (
  <div className="space-y-8 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn("animate-pulse bg-slate-50 border border-slate-100 h-32", className)} />
    ))}
  </div>
);

export const ErrorMessage = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-16 text-center space-y-8 bg-red-50 border-t-8 border-red-600 shadow-heavy">
    <div className="w-16 h-16 bg-red-600 flex items-center justify-center">
      <AlertCircle className="w-10 h-10 text-white" />
    </div>
    <div className="space-y-4">
      <p className="text-3xl font-black text-slate-900 uppercase italic font-serif tracking-tighter italic">Anomalie Détectée</p>
      <p className="text-lg text-slate-500 font-serif leading-relaxed italic max-w-md mx-auto">{message}</p>
    </div>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="btn-primary"
      >
        Réinitialiser la transaction
      </button>
    )}
  </div>
);
