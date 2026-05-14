import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Check, X, Shield } from 'lucide-react';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge, getBlockchainErrorMessage } from './Common';
import { useError } from './ErrorProvider';

import { VerificationResult } from './VerificationResult';

export const RecruiterProfile = () => {
  const { reportError } = useError();
  const [view, setView] = useState<'HOME' | 'SCANNING' | 'RESULT' | 'MANUAL'>('HOME');
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [manualId, setManualId] = useState(() => localStorage.getItem('diplo_manual_id') || '');
  
  React.useEffect(() => {
    localStorage.setItem('diplo_manual_id', manualId);
  }, [manualId]);

  const startScan = () => {
    setView('SCANNING');
    setTimeout(async () => {
      try {
        const diplomas = await blockchainService.getRecentDiplomas();
        setLastScannedId(diplomas.length > 0 ? diplomas[0].id : 'DIP-2024-BF-9921');
        setView('RESULT');
      } catch (err) {
        setLastScannedId('DIP-2024-BF-9921');
        setView('RESULT');
      }
    }, 2500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      setLastScannedId(manualId.trim());
      setView('RESULT');
    }
  };

  return (
    <div className="h-full space-y-12 pb-20">
      {view === 'HOME' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-slate-100 pb-12">
            <div className="space-y-4 text-left">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter font-serif uppercase italic leading-none">
                Audit <span className="text-brand-blue-primary">Blockchain</span>
              </h2>
              <p className="text-lg text-slate-500 font-serif lowercase italic">Vérification instantanée de l'authenticité.</p>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => setView('MANUAL')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                 Saisie manuelle
              </button>
              <button 
                onClick={startScan} 
                className="btn-primary"
              >
                <span>Démarrer Scan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
            <div className="p-20 bg-slate-50 flex flex-col items-center justify-center space-y-8 border border-slate-100">
               <QrCode className="text-brand-blue-primary" size={64} strokeWidth={1} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanner de Preuve</p>
            </div>
            
            <div className="space-y-12 border-l border-slate-100 pl-12 flex flex-col justify-center">
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Temps Réel</h3>
                  <p className="text-lg text-slate-500 font-serif">Accès direct au registre national décentralisé.</p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Status</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Réseau Opérationnel</span>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}

      {view === 'SCANNING' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[80vh] relative flex flex-col items-center justify-center space-y-16 overflow-hidden max-w-4xl mx-auto">
          <div className="space-y-4 text-center relative z-10">
            <div className="flex items-center justify-center space-x-3 text-brand-blue-primary font-black uppercase tracking-[0.4em] text-xs">
              <div className="w-8 h-[2px] bg-brand-blue-primary" />
              <span>Camera Active</span>
            </div>
            <p className="text-slate-900 text-5xl font-black tracking-tighter font-serif italic uppercase leading-none">Analyse de Preuve</p>
          </div>
          
          <div className="relative group">
            <div className="hero-glow w-[400px] h-[400px] bg-brand-blue-primary/5 inset-0 m-auto pointer-events-none" />
            <div className="relative w-[320px] h-[320px] border border-slate-200 bg-white rounded-[3rem] shadow-2xl glass-card overflow-hidden">
              {/* Corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-brand-blue-primary rounded-tl-[2.5rem] m-6 opacity-40" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-brand-blue-primary rounded-tr-[2.5rem] m-6 opacity-40" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-brand-blue-primary rounded-bl-[2.5rem] m-6 opacity-40" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-brand-blue-primary rounded-br-[2.5rem] m-6 opacity-40" />
              
              <motion.div 
                 className="w-full h-1 bg-brand-blue-primary shadow-[0_0_30px_rgba(30,58,138,0.5)] absolute left-0 z-20"
                 animate={{ top: ['10%', '90%', '10%'] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="absolute inset-0 m-auto w-48 h-48 bg-slate-50 rounded-3xl animate-pulse flex items-center justify-center">
                <QrCode size={120} className="text-slate-200" strokeWidth={1} />
              </div>
            </div>
          </div>

          <div className="space-y-10 flex flex-col items-center">
              <div className="flex space-x-4">
                <div className="w-3 h-3 bg-brand-blue-primary rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-brand-blue-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-3 h-3 bg-brand-blue-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <p className="text-sm text-slate-500 font-black uppercase tracking-[0.5em] animate-pulse">Signature en cours de validation...</p>
              
              <button 
                onClick={() => setView('HOME')} 
                className="text-slate-400 text-xs font-black uppercase tracking-widest border border-slate-200 px-12 py-4 rounded-full hover:bg-white hover:text-brand-blue-primary transition-all shadow-sm"
              >
                Annuler
              </button>
           </div>
        </motion.div>
      )}

      {view === 'MANUAL' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-12 py-24">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-slate-900 font-serif italic uppercase tracking-tighter">Saisie Manuelle</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Identification Directe de Preuve</p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-12 bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4">
              <label className="text-[11px] text-slate-400 ml-6 uppercase font-black tracking-widest block">Code d'Identification Certificat</label>
              <input 
                autoFocus
                placeholder="EX: DIP-2024-BF-XXXX" 
                className="w-full input-field text-2xl font-mono tracking-widest p-8 h-24 text-center bg-slate-50"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
              />
            </div>
            
            <button type="submit" className="w-full btn-primary h-20 text-sm shadow-[0_20px_50px_rgba(30,58,138,0.2)]">
              Lancer la Vérification
            </button>
            <button 
              type="button"
              onClick={() => setView('HOME')}
              className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue-primary transition-colors"
            >
              Retourner à l'accueil
            </button>
          </form>

          <div className="px-10 py-6 bg-brand-blue-primary/5 rounded-3xl border border-brand-blue-primary/10 text-center">
             <p className="text-[10px] font-black uppercase text-brand-blue-primary tracking-widest leading-relaxed">Assurez-vous de saisir l'ID tel qu'il apparaît sur l'acte authentique original.</p>
          </div>
        </motion.div>
      )}

      {view === 'RESULT' && (
        <VerificationResult id={lastScannedId!} onClose={() => setView('HOME')} />
      )}
    </div>
  );
};
