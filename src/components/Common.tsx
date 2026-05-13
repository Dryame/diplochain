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
  <span className={cn("px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.1em]", className)}>
    {children}
  </span>
);

export const ProgressBar = ({ steps, current }: { steps: string[], current: number }) => (
  <div className="flex justify-between items-center w-full px-4 py-4">
    {steps.map((step, i) => (
      <div key={step} className="flex flex-col items-center flex-1 mx-1">
        <div className={cn(
          "w-full h-1 my-2 transition-all duration-300 rounded-full",
          i <= current ? "bg-brand-latte" : "bg-white/10"
        )} />
        <span className={cn(
          "text-[8px] tracking-widest uppercase font-bold whitespace-nowrap italic",
          i === current ? "text-brand-latte" : "text-white/20"
        )}>{step}</span>
      </div>
    ))}
  </div>
);

export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col items-center justify-center p-12 space-y-4", className)}>
    <Loader2 className="w-10 h-10 text-brand-latte animate-spin" />
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Chargement des données...</span>
  </div>
);

export const LoadingSkeleton = ({ className, count = 1 }: { className?: string, count?: number }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn("animate-pulse bg-white/5 rounded-2xl", className)} />
    ))}
  </div>
);

export const ErrorMessage = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-red-500/5 rounded-3xl border border-red-500/10">
    <AlertCircle className="w-10 h-10 text-red-500/50" />
    <div className="space-y-1">
      <p className="text-sm font-bold text-white/80">Une erreur est survenue</p>
      <p className="text-xs text-white/40 leading-relaxed">{message}</p>
    </div>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white transition-all border border-white/10"
      >
        Réessayer
      </button>
    )}
  </div>
);
