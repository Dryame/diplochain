import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Smartphone, CheckCircle2, Share2, Copy, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge, LoadingSkeleton, ErrorMessage, getBlockchainErrorMessage } from './Common';
import { cn } from '../lib/utils';

export const GraduateProfile = () => {
  const [view, setView] = useState<'LIST' | 'DETAIL' | 'SHARE'>('LIST');
  const [selected, setSelected] = useState<RegisteredDiploma | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myDiplomas, setMyDiplomas] = useState<RegisteredDiploma[]>([]);

  const fetchDiplomas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app we would use the wallet address
      const diplomas = await blockchainService.getDiplomasByOwner("KABORE Awa");
      
      // If none found (mock), let's ensure we have some for the demo
      if (diplomas.length === 0) {
        setMyDiplomas([
          {
            id: "DIP-2024-BF-00847",
            fullName: "KABORE Awa",
            specialty: "Licence en Informatique",
            mention: "Très Bien",
            year: "2024",
            hash: "0x3a9fcd3498b72b",
            signature: "0x...",
            issuerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
            timestamp: 1718454720000
          },
          {
            id: "DIP-2022-BF-00123",
            fullName: "KABORE Awa",
            specialty: "Master Droit des Affaires",
            mention: "Bien",
            year: "2022",
            hash: "0x7d2eb1a47d2b",
            signature: "0x...",
            issuerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
            timestamp: 1655328000000
          }
        ]);
      } else {
        setMyDiplomas(diplomas);
      }
    } catch (err) {
      setError(getBlockchainErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDiplomas();
  }, []);

  const handleSelect = (d: RegisteredDiploma) => {
    setSelected(d);
    setView('DETAIL');
  };

  const [copied, setCopied] = useState(false);

  const copyShareLink = () => {
    if (!selected) return;
    const url = `${window.location.origin}/verifier?id=${selected.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-8 overflow-y-auto pb-24">
      {view === 'LIST' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 px-2">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight">Mes Titres</h2>
            <p className="text-[11px] text-brand-latte uppercase font-bold tracking-[0.3em]">COFFRE-FORT NUMÉRIQUE</p>
          </div>

          {error ? (
            <ErrorMessage message={error} onRetry={fetchDiplomas} />
          ) : isLoading ? (
            <div className="space-y-8">
              <LoadingSkeleton className="h-60" count={1} />
              <div className="space-y-4">
                <div className="h-4 w-32 bg-white/5 animate-pulse rounded-full" />
                <LoadingSkeleton className="h-20" count={2} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {myDiplomas.length > 0 && (
                <div className="relative group cursor-pointer" onClick={() => handleSelect(myDiplomas[0])}>
                   <div className="absolute inset-0 bg-brand-latte/10 blur-[80px] group-hover:bg-brand-latte/20 transition-all rounded-full" />
                   <div className="relative glass-card p-8 min-h-[240px] flex flex-col justify-between bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-500 shadow-2xl">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-brand-latte text-xs border border-white/10">UO</div>
                        <Badge className="bg-brand-latte/20 text-brand-latte px-4 py-2 border border-brand-latte/10 tracking-[0.2em] text-[8px]">✦ OFFICIEL</Badge>
                      </div>
                      <div className="space-y-2 mt-8">
                        <h3 className="text-2xl font-black leading-tight text-white">{myDiplomas[0].specialty}</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Université de Ouagadougou</p>
                      </div>
                      <div className="flex justify-between items-end border-t border-white/5 pt-6 mt-6">
                        <div className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Promotion {myDiplomas[0].year}</div>
                        <div className="text-[9px] text-white/10 font-mono tracking-tighter uppercase">{myDiplomas[0].id}</div>
                      </div>
                   </div>
                </div>
              )}
   
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/10 ml-2">Archives de Certification</h3>
                <div className="space-y-3">
                  {myDiplomas.map(d => (
                    <div key={d.id} onClick={() => handleSelect(d)} className="glass-card p-6 flex items-center justify-between cursor-pointer bg-white/[0.01] hover:bg-white/[0.05] border-white/[0.05] transition-all duration-300">
                      <div className="flex items-center space-x-5">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[11px] font-black text-brand-latte border border-white/10">
                            {d.year}
                         </div>
                         <div>
                           <div className="text-sm font-bold text-white/80">{d.specialty}</div>
                           <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest leading-loose">UO ✦ Enregistré Blockchain</div>
                         </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40">
                        <ChevronLeft className="rotate-180" size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <button onClick={() => setView('DETAIL')} className="w-full btn-primary fixed bottom-28 left-0 right-0 max-w-[340px] mx-auto h-16 shadow-[0_20px_50px_rgba(79,195,247,0.3)]">
            Accéder au Wallet Web3
          </button>
        </motion.div>
      )}

      {view === 'DETAIL' && selected && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
          <button onClick={() => setView('LIST')} className="flex items-center space-x-3 text-white/30 text-[10px] font-bold hover:text-white transition-colors tracking-[0.2em] uppercase">
            <ChevronLeft size={16} />
            <span>Retour</span>
          </button>

          <div className="glass-card overflow-hidden bg-white/5 shadow-2xl border border-white/10 rounded-[3rem]">
             <div className="p-8 bg-white/5 flex items-center justify-between border-b border-white/5">
                <div className="space-y-1">
                  <div className="text-[9px] text-brand-latte font-bold uppercase tracking-[0.3em]">IDENTITÉ DIGITALE</div>
                  <div className="text-2xl font-black text-white tracking-tight leading-tight font-serif italic">{selected.specialty}</div>
                </div>
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10"><Smartphone size={28} strokeWidth={1.5} /></div>
             </div>
             
             <div className="px-8 py-3 bg-brand-success text-white text-center font-bold text-[9px] uppercase tracking-[0.2em] flex items-center justify-center space-x-2 border-b border-white/5">
                <CheckCircle2 size={14} strokeWidth={2.5} />
                <span className="mt-0.5">PREUVE BLOCKCHAIN AUTHENTIFIÉE</span>
             </div>

             <div className="p-8 space-y-10">
                <div className="space-y-5 text-[10px] uppercase font-bold tracking-[0.1em] text-white/30">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">ID Certificat</span>
                    <span className="text-white font-mono tracking-tighter">{selected.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">Preuve SHA-256</span>
                    <span className="font-mono text-[9px] lowercase tracking-normal max-w-[140px] truncate">{selected.hash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Date Émission</span>
                    <span className="text-white font-bold">{new Date(selected.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-center p-10 bg-black/20 rounded-[3.5rem] shadow-inner border border-white/5">
                  <div className="p-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:scale-105 transition-transform duration-700">
                    <QRCodeSVG value={selected.hash} size={140} fgColor="#08162A" />
                  </div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => setView('SHARE')} className="w-full btn-primary h-16 flex items-center justify-center space-x-3 bg-brand-latte shadow-[0_15px_40px_rgba(79,195,247,0.3)]">
              <Share2 size={20} strokeWidth={2.5} />
              <span>Transmettre le Certificat</span>
            </button>
            <button className="w-full text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              Télécharger l'Original (PDF)
            </button>
          </div>
        </motion.div>
      )}

      {view === 'SHARE' && selected && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-12 pt-4">
          <button onClick={() => setView('DETAIL')} className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center shadow-xl text-white/20 hover:text-white border border-white/10 transition-colors"><X size={28} /></button>
          
          <div className="space-y-8 text-center px-4">
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 inline-block shadow-2xl relative group">
                <div className="absolute inset-0 bg-brand-latte/5 blur-3xl group-hover:bg-brand-latte/10 transition-all" />
                <h3 className="text-3xl font-black text-white leading-tight relative">{selected.specialty}</h3>
                <p className="text-[11px] text-brand-latte font-bold uppercase tracking-widest mt-4 relative">{selected.fullName}</p>
             </div>
             <div className="space-y-3">
                <h2 className="text-4xl font-black text-white tracking-tight">Partager la Preuve</h2>
                <p className="text-sm text-white/30 leading-relaxed font-bold uppercase tracking-widest">Sélectionnez un canal sécurisé pour transmettre votre certification blockchain infalsifiable.</p>
             </div>
          </div>

          <div className="grid grid-cols-4 gap-6 px-4">
            {[ 
              { icon: 'W', label: 'WhatsApp', color: 'bg-green-600/20 text-green-500 border border-green-500/20', action: () => {} },
              { icon: '@', label: 'Email', color: 'bg-brand-latte/20 text-brand-latte border border-brand-latte/20', action: () => {} },
              { icon: 'in', label: 'LinkedIn', color: 'bg-blue-600/20 text-blue-500 border border-blue-500/20', action: () => {} },
              { icon: <Copy size={22} />, label: 'Copier', color: 'bg-white/5 text-white/30 border border-white/10', action: copyShareLink }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-4 cursor-pointer group" onClick={item.action}>
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-all duration-500 group-hover:scale-110", item.color)}>
                  {item.icon}
                </div>
                <span className="text-[10px] text-white/20 font-black uppercase tracking-widest group-hover:text-white/40 transition-colors">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-10 bg-brand-latte/5 border-brand-latte/10 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-latte/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-brand-success flex items-center justify-center rounded-[3rem] z-10"
                >
                  <span className="text-[11px] font-black uppercase text-white tracking-widest flex items-center space-x-2">
                    <CheckCircle2 size={16} />
                    <span>LIEN COPIÉ SÉCURISÉ</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-[11px] text-brand-latte font-black uppercase tracking-[0.2em] leading-relaxed relative">PARTAGE ZERO-TRUST ✦ LES RECRUTEURS PEUVENT VÉRIFIER L'AUTHENTICITÉ INSTANTANÉMENT SANS INTERMÉDIAIRE.</p>
          </div>

          <button className="w-full btn-primary h-16 shadow-[0_20px_50px_rgba(79,195,247,0.2)]">
            Lancer un Test de Vérification
          </button>
        </motion.div>
      )}
    </div>
  );
};
