import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Smartphone, CheckCircle2, Share2, Copy, X, Shield, Search } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge, LoadingSkeleton, ErrorMessage, getBlockchainErrorMessage } from './Common';
import { useError } from './ErrorProvider';
import { cn } from '../lib/utils';

export const GraduateProfile = () => {
  const { reportError } = useError();
  const [view, setView] = useState<'LIST' | 'DETAIL' | 'SHARE'>('LIST');
  const [selected, setSelected] = useState<RegisteredDiploma | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myDiplomas, setMyDiplomas] = useState<RegisteredDiploma[]>([]);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('diplo_graduate_search') || '');

  React.useEffect(() => {
    localStorage.setItem('diplo_graduate_search', searchTerm);
  }, [searchTerm]);

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
      const msg = getBlockchainErrorMessage(err);
      setError(msg);
      reportError(`Chargement portfolio échoué: ${msg}`);
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
  const filteredDiplomas = myDiplomas.filter(d => 
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.year.includes(searchTerm)
  );

  return (
    <div className="h-full space-y-12 pb-20">
      {view === 'LIST' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-slate-100 pb-12">
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter font-serif uppercase italic leading-none">Portfolio</h2>
              <p className="text-lg text-slate-500 font-serif lowercase italic">KABORE Awa / {myDiplomas.length} certifications</p>
            </div>
            <div className="flex items-center space-x-6">
               <div className="relative font-sans">
                 <input 
                   type="text" 
                   placeholder="Rechercher..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="input-field w-64"
                 />
               </div>
               <div className="w-14 h-14 bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Smartphone size={24} className="text-brand-blue-primary" />
               </div>
            </div>
          </div>

          {error ? (
            <ErrorMessage message={error} onRetry={fetchDiplomas} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {filteredDiplomas.length > 0 ? filteredDiplomas.map((d, i) => (
                <div 
                  key={d.id}
                  className="p-12 border border-slate-100 group cursor-pointer hover:bg-slate-50 transition-all bg-white" 
                  onClick={() => handleSelect(d)}
                >
                   <div className="flex justify-between items-start mb-12">
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{d.id}</span>
                     <div className="w-2 h-2 rounded-full bg-brand-success" />
                   </div>

                   <div className="space-y-4">
                     <h3 className="text-4xl font-black text-slate-900 group-hover:text-brand-blue-primary transition-colors font-serif italic uppercase">{d.specialty}</h3>
                     <p className="text-sm text-slate-400 font-bold uppercase tracking-widest font-sans">Université de Ouagadougou / {d.year}</p>
                   </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Aucun résultat trouvé</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {view === 'DETAIL' && selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-12">
          <button onClick={() => setView('LIST')} className="group flex items-center space-x-4 text-slate-400 text-xs font-black uppercase tracking-[0.3em] hover:text-brand-blue-primary transition-colors">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-white transition-colors">
              <ChevronLeft size={20} />
            </div>
            <span>Retour au Coffre</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-12">
                <div className="glass-card overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-[3rem] relative">
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue-primary/5 to-transparent pointer-events-none" />
                  
                  <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-brand-blue-primary font-black uppercase tracking-[0.4em] text-xs">
                        <div className="w-8 h-[2px] bg-brand-blue-primary" />
                        <span>Identité Numérique Blockchain</span>
                      </div>
                      <h2 className="text-6xl font-black text-slate-900 tracking-tighter font-serif italic uppercase leading-none">{selected.specialty}</h2>
                    </div>
                    <div className="flex items-center space-x-6">
                       <div className="text-right hidden md:block">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Propriétaire</p>
                          <p className="text-lg font-black text-slate-900">{selected.fullName}</p>
                       </div>
                       <div className="w-20 h-20 bg-brand-blue-primary rounded-3xl flex items-center justify-center text-white shadow-2xl">
                          <Shield size={40} />
                       </div>
                    </div>
                  </div>
                  
                  <div className="bg-brand-success/5 py-4 text-brand-success text-center font-black text-xs uppercase tracking-[0.4em] border-b border-brand-success/10">
                     Verification Check: Secure Hash Path Verified
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12">
                     <div className="space-y-10">
                        <div className="grid grid-cols-1 gap-8 text-xs uppercase font-black tracking-[0.2em]">
                           <div className="space-y-2">
                              <span className="text-slate-400 block">ID Transaction DiploChain</span>
                              <span className="text-brand-blue-primary font-mono break-all bg-slate-50 p-4 rounded-xl block border border-slate-100">{selected.id}</span>
                           </div>
                           <div className="space-y-2">
                              <span className="text-slate-400 block">Empreinte Cryptographique</span>
                              <span className="text-slate-600 font-mono break-all italic">{selected.hash}</span>
                           </div>
                           <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <span className="text-slate-400 block">Date d'Ancrage</span>
                                 <span className="text-slate-900 font-black text-xl">{new Date(selected.timestamp).toLocaleDateString()}</span>
                              </div>
                              <div className="space-y-2">
                                 <span className="text-slate-400 block">Mention</span>
                                 <span className="text-brand-accent font-black text-xl italic">{selected.mention}</span>
                              </div>
                           </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row gap-6">
                           <button onClick={() => setView('SHARE')} className="flex-1 btn-primary h-20 flex items-center justify-center space-x-4 text-sm">
                             <Share2 size={24} />
                             <span>Transmettre la Preuve</span>
                           </button>
                           <button className="flex-1 h-20 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
                             Archive PDF
                           </button>
                        </div>
                     </div>

                     <div className="flex flex-col items-center justify-center space-y-8 bg-slate-50 rounded-[3rem] p-12 border border-slate-200">
                        <div className="p-8 bg-white rounded-[3rem] shadow-sm group transition-transform hover:scale-105 duration-700 border border-slate-100">
                           <QRCodeSVG value={selected.hash} size={240} level="H" fgColor="#1E3A8A" />
                        </div>
                        <div className="text-center space-y-2">
                           <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.3em]">Scanner pour Vérifier</p>
                           <p className="text-[10px] text-slate-300 font-mono italic">Signature ECDSA P-256</p>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      )}

      {view === 'SHARE' && selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <button onClick={() => setView('DETAIL')} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-400 hover:text-brand-blue-primary border border-slate-200 transition-colors">
              <X size={28} />
            </button>
            <div className="text-right space-y-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Partage en cours</p>
              <p className="text-slate-900 font-black">{selected.specialty}</p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
             <div className="inline-block p-4 bg-brand-blue-primary/5 rounded-2xl mb-4">
                <Share2 className="text-brand-blue-primary" size={32} />
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Transmettre la Preuve</h2>
             <p className="max-w-xl mx-auto text-slate-500 text-sm leading-relaxed">Générez un lien sécurisé ou utilisez nos intégrations directes pour certifier votre parcours auprès de tiers.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[ 
              { icon: 'W', label: 'WhatsApp', color: 'bg-green-600/5 text-green-500 border border-green-500/10', action: () => {} },
              { icon: '@', label: 'Email', color: 'bg-brand-blue-primary/5 text-brand-blue-primary border border-brand-blue-primary/10', action: () => {} },
              { icon: 'in', label: 'LinkedIn', color: 'bg-blue-600/5 text-blue-500 border border-blue-500/10', action: () => {} },
              { icon: <Copy size={24} />, label: 'Lien Public', color: 'bg-slate-50 text-slate-400 border border-slate-200', action: copyShareLink }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer space-y-4 text-center" onClick={item.action}>
                <div className={cn("aspect-square rounded-[2rem] flex items-center justify-center font-black text-3xl transition-all duration-500 group-hover:scale-110 shadow-xl border border-slate-100", item.color)}>
                  {item.icon}
                </div>
                <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest group-hover:text-slate-900 transition-colors">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-card p-12 bg-white border border-slate-200 text-center relative overflow-hidden group shadow-2xl">
            <div className="hero-glow w-40 h-40 bg-brand-blue-primary/5 top-0 left-0" />
            <AnimatePresence>
              {copied && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-brand-success flex items-center justify-center z-10"
                >
                  <span className="text-sm font-black uppercase text-white tracking-[0.4em] flex items-center space-x-4">
                    <CheckCircle2 size={24} />
                    <span>Lien Sécurisé Copié</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-sm text-slate-400 font-black uppercase tracking-[0.3em] leading-relaxed relative z-10">
              Protocole DiploChain <span className="text-brand-blue-primary">v2.4</span> ✦ Architecture Décentralisée Zero-Knowledge.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
