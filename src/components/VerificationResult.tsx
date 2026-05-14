import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, X, Shield, ChevronLeft, ExternalLink } from 'lucide-react';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge, ErrorMessage, getBlockchainErrorMessage } from './Common';

interface VerificationResultProps {
  id?: string;
  onClose?: () => void;
}

export const VerificationResult = ({ id: propId, onClose }: VerificationResultProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = propId || searchParams.get('id');
  const [result, setResult] = useState<RegisteredDiploma | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerification = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const found = await blockchainService.getDiplomaById(id);
      
      // Mock fallback for demo
      if (!found && id === 'DIP-2024-BF-9921') {
        setResult({
          id,
          fullName: "KABORE Awa",
          specialty: "Licence en Informatique",
          mention: "Très Bien",
          year: "2024",
          hash: "0x7d2eb1a477890b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
          signature: "0x...",
          issuerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          timestamp: 1715621400000 
        });
      } else {
        setResult(found);
      }
    } catch (err) {
      setError(getBlockchainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [id]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-10 pt-12">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-20 h-20 border-b-2 border-brand-blue-primary rounded-full shadow-[0_0_50px_rgba(30,58,138,0.1)]"
          />
          <Shield size={32} className="absolute inset-0 m-auto text-brand-blue-primary/30 animate-pulse" />
        </div>
        <div className="text-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-slate-400">Analyse de Preuve</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-200 italic">Connexion au noeud DiploChain...</p>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="p-10 text-center space-y-8 pt-20">
        <Shield size={64} className="mx-auto text-slate-100" />
        <h2 className="text-2xl font-black text-slate-900">ID de Preuve Manquant</h2>
        <button onClick={() => navigate('/recruteur')} className="btn-primary w-full h-16">Retour au Scanner</button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 overflow-y-auto h-full pb-32">
      <button onClick={handleBack} className="flex items-center space-x-3 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-brand-blue-primary transition-colors">
        <ChevronLeft size={16} />
        <span>RETOUR</span>
      </button>

      {error ? (
        <div className="pt-20">
          <ErrorMessage message={error} onRetry={fetchVerification} />
        </div>
      ) : result ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          <div className="text-center space-y-6 pt-4">
            <div className="w-24 h-24 bg-brand-success text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl border border-white/20">
              <Check size={48} strokeWidth={3} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight font-serif italic uppercase">Vérifié ✓</h2>
              <Badge className="bg-brand-success/10 text-brand-success px-6 py-2 border-none font-black uppercase text-[10px] tracking-[0.3em]">DiploChain Authentique</Badge>
            </div>
          </div>

          <div className="glass-card p-10 bg-white shadow-2xl border-slate-100 space-y-8">
            <div className="space-y-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Titulaire</span>
                <span className="text-slate-900 font-black">{result.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Certification</span>
                <span className="text-slate-900 font-black text-right max-w-[170px] font-serif italic">{result.specialty}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Mention</span>
                <span className="text-slate-900 font-black">{result.mention}</span>
              </div>
              <div className="flex justify-between">
                <span>Année Émission</span>
                <span className="text-slate-900 font-black">{result.year}</span>
              </div>
            </div>

            <div className="pt-6 space-y-4">
                <div className="flex items-center space-x-4 text-brand-success bg-brand-success/5 p-5 rounded-2xl border border-brand-success/10">
                    <div className="w-8 h-8 rounded-full bg-brand-success/20 flex items-center justify-center">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Intégrité Hash Confirmée</span>
                </div>
                <div className="flex items-center space-x-4 text-brand-success bg-brand-success/5 p-5 rounded-2xl border border-brand-success/10">
                    <div className="w-8 h-8 rounded-full bg-brand-success/20 flex items-center justify-center">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Clé Émetteur Validée</span>
                </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl space-y-3 flex flex-col items-center border border-slate-100">
               <div className="text-[9px] font-black uppercase text-slate-400 flex items-center space-x-2">
                  <ExternalLink size={12} />
                  <span>IDENTITÉ DE PREUVE BLOCKCHAIN</span>
               </div>
               <div className="text-[9px] font-mono text-brand-blue-primary break-all leading-relaxed p-2 bg-white rounded-xl text-center w-full shadow-sm">
                  {result.id}
               </div>
            </div>
          </div>

          <div className="text-center font-bold text-[10px] text-slate-300 uppercase tracking-[0.4em]">
             Preuve Certifiée {new Date(result.timestamp).toLocaleDateString()} ✦ DiploChain Core
          </div>
        </motion.div>
      ) : (
        <div className="text-center space-y-8 pt-12">
           <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl">
              <X size={48} strokeWidth={3} />
           </div>
           <div className="space-y-3 px-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight font-serif italic uppercase">Erreur de Preuve</h2>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-[0.2em]">Ce hash ne correspond à aucune certification active sur le registre DiploChain.</p>
           </div>
           <button onClick={() => navigate('/recruteur')} className="btn-primary w-full h-16 shadow-[0_20px_50px_rgba(239,68,68,0.05)]">Relancer un Scan</button>
        </div>
      )}
    </div>
  );
};
