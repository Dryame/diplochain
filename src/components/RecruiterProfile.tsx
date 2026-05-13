import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QrCode, Check, X, Shield } from 'lucide-react';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge } from './Common';

import { VerificationResult } from './VerificationResult';

export const RecruiterProfile = () => {
  const [view, setView] = useState<'HOME' | 'SCANNING' | 'RESULT' | 'MANUAL'>('HOME');
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  
  const startScan = () => {
    setView('SCANNING');
    setTimeout(async () => {
      try {
        const diplomas = await blockchainService.getRecentDiplomas();
        setLastScannedId(diplomas.length > 0 ? diplomas[0].id : 'DIP-2024-BF-9921');
        setView('RESULT');
      } catch (err) {
        // Fallback for demo scanning error
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
    <div className="h-full flex flex-col p-6 space-y-8 overflow-y-auto pb-24 no-scrollbar">
      {view === 'HOME' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center space-y-12 py-12">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center p-6 border border-white/5 relative">
             <div className="absolute -inset-3 border-2 border-brand-latte border-dashed rounded-[3rem] animate-pulse opacity-10"></div>
             <div className="w-full h-full bg-brand-latte rounded-2xl flex items-center justify-center text-white shadow-[0_15px_30px_rgba(79,195,247,0.3)]"><QrCode size={44} /></div>
          </div>
          
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-black text-white tracking-tight px-4 leading-tight font-serif italic uppercase">Vérification de Document</h2>
            <div className="flex flex-wrap justify-center gap-3">
               <Badge className="bg-white/5 text-brand-latte border border-white/10 px-4 py-1.5 font-bold uppercase text-[9px] tracking-widest">Temps Réel</Badge>
               <Badge className="bg-white/5 text-brand-latte border border-white/10 px-4 py-1.5 font-bold uppercase text-[9px] tracking-widest">Blockchain</Badge>
            </div>
            <p className="text-[11px] text-white/30 uppercase font-bold tracking-[0.1em] leading-loose">Authenticité garantie par signatures institutionnelles.</p>
          </div>

          <div className="w-full space-y-4 pt-4">
            <button onClick={startScan} className="w-full btn-primary h-16 flex items-center justify-center space-x-3 bg-brand-latte shadow-[0_15px_40px_rgba(79,195,247,0.2)]">
              <QrCode size={20} strokeWidth={2.5} />
              <span>Démarrer le Scanner</span>
            </button>
            <button 
              onClick={() => setView('MANUAL')}
              className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              Saisie Manuelle
            </button>
          </div>
        </motion.div>
      )}

       {view === 'SCANNING' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative flex flex-col items-center justify-center space-y-12 bg-[#08162A] -mx-6 -my-8 overflow-hidden pt-12">
           <div className="relative z-10 space-y-2 text-center">
             <div className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">Objectif Digital</div>
             <p className="text-white text-3xl font-black tracking-tight font-serif italic uppercase">Analyse de Preuve</p>
           </div>
           
           <div className="relative z-10 w-72 h-72 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[3.5rem] shadow-2xl glass-card overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-brand-latte rounded-tl-[2.5rem] m-6" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-brand-latte rounded-tr-[2.5rem] m-6" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-brand-latte rounded-bl-[2.5rem] m-6" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-brand-latte rounded-br-[2.5rem] m-6" />
              
              <motion.div 
                className="w-full h-[3px] bg-brand-latte shadow-[0_0_25px_rgba(79,195,247,0.8)] absolute left-0 z-20"
                animate={{ top: ['10%', '90%', '10%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="absolute inset-0 m-auto w-48 h-48 bg-white/5 rounded-3xl animate-pulse flex items-center justify-center">
                <QrCode size={84} className="text-white/5" strokeWidth={1} />
              </div>
           </div>

           <div className="relative z-10 space-y-8 flex flex-col items-center">
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-brand-latte rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand-latte rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-brand-latte rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Analyse de preuve on-chain...</p>
              
              <button 
                onClick={() => setView('HOME')} 
                className="text-white/20 text-[10px] font-bold uppercase tracking-widest border border-white/10 px-8 py-3 rounded-2xl hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
           </div>
        </motion.div>
      )}

      {view === 'MANUAL' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pt-8 px-2">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white font-serif italic uppercase">Saisie Manuelle</h2>
            <p className="text-[11px] text-white/30 uppercase font-bold tracking-[0.2em]">Entrer l'identifiant unique</p>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] text-white/30 ml-4 uppercase font-bold tracking-widest text-left block">ID CERTIFICAT</label>
              <input 
                autoFocus
                placeholder="EX: DIP-2024-BF-XXXX" 
                className="w-full input-field text-lg font-mono tracking-wider"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
              />
            </div>
            
            <button type="submit" className="w-full btn-primary h-16 shadow-[0_15px_40px_rgba(79,195,247,0.2)]">
              Vérifier le Titre
            </button>
            <button 
              type="button"
              onClick={() => setView('HOME')}
              className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
            >
              Annuler
            </button>
          </form>

          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
             <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest leading-relaxed">L'ID est sensible à la casse. Se trouve généralement au bas du document physique original.</p>
          </div>
        </motion.div>
      )}

      {view === 'RESULT' && (
        <VerificationResult id={lastScannedId!} onClose={() => setView('HOME')} />
      )}
    </div>
  );
};
