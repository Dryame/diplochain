import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Check, Clock, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CryptoService, DiplomaData } from '../services/cryptoService';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge, ProgressBar, LoadingSkeleton, ErrorMessage, getBlockchainErrorMessage } from './Common';
import { cn } from '../lib/utils';

export const InstitutionProfile = () => {
  const [step, setStep] = useState(0); // 0: Login, 1: Dashboard, 2: Form, 3: Signature, 4: Confirmation
  const [formData, setFormData] = useState<DiplomaData>({
    fullName: '',
    specialty: '',
    mention: '',
    year: ''
  });
  const [isSigning, setIsSigning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [registeredDiploma, setRegisteredDiploma] = useState<RegisteredDiploma | null>(null);

  // Loading and Error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentDiplomas, setRecentDiplomas] = useState<RegisteredDiploma[]>([]);
  const [stats, setStats] = useState({ emitted: 0, verified: 0, validity: 0 });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedStats, fetchedDiplomas] = await Promise.all([
        blockchainService.getStats(),
        blockchainService.getRecentDiplomas()
      ]);
      setStats(fetchedStats);
      setRecentDiplomas(fetchedDiplomas);
    } catch (err) {
      setError(getBlockchainErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === 1) {
      fetchData();
    }
  }, [step]);

  const handleStartIssuance = () => setStep(2);
  
  const handleSignature = async () => {
    setStep(3);
    setIsSigning(true);
    setProgress(0);
    setError(null);
    
    // Simulation of steps
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const hash = CryptoService.hashDiploma(formData);
      const mockPrivKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; 
      const sig = await CryptoService.signHash(hash, mockPrivKey);
      
      const diploma: RegisteredDiploma = {
        ...formData,
        id: `DIP-${new Date().getFullYear()}-BF-${Math.floor(10000 + Math.random() * 90000)}`,
        hash,
        signature: sig,
        issuerAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        timestamp: Date.now()
      };

      await blockchainService.registerDiploma(diploma);
      setRegisteredDiploma(diploma);
      setProgress(100);
    } catch (err) {
      setError(getBlockchainErrorMessage(err));
      clearInterval(interval);
      setStep(1); // Go back to dashboard on error
    } finally {
      setIsSigning(false);
    }
  };

  const handleConfirm = () => setStep(4);

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto pb-24">
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center space-y-8 pt-12">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/10">
            <Shield className="text-brand-latte w-12 h-12" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white">DiploChain</h1>
            <Badge className="bg-white/5 text-brand-latte border border-white/10 lowercase italic">
              Établissement Accrédité
            </Badge>
          </div>
          <div className="w-full space-y-4 px-4 pt-4">
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 ml-4 uppercase font-bold tracking-[0.2em]">Adresse Email</label>
              <input type="email" defaultValue="admin@univ-ouaga.bf" className="w-full input-field italic text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 ml-4 uppercase font-bold tracking-[0.2em]">Mot de passe</label>
              <input type="password" defaultValue="password" className="w-full input-field italic text-sm" />
            </div>
            <button onClick={() => setStep(1)} className="w-full btn-primary h-16 mt-6 shadow-[0_15px_40px_rgba(79,195,247,0.2)]">
              S'authentifier
            </button>
            <div className="flex items-center justify-center space-x-2 pt-4">
              <div className="w-2 h-2 rounded-full bg-brand-latte animate-pulse" />
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">Signature Blockchain Sécurisée</span>
            </div>
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 px-2">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-black text-white leading-tight font-serif uppercase italic">Centre Universitaire</h2>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.3em]">Portail Vérifié ✓</p>
          </div>

          {error ? (
            <ErrorMessage message={error} onRetry={fetchData} />
          ) : isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-3">
                <LoadingSkeleton className="h-20" count={3} />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-32 bg-white/5 animate-pulse rounded-full" />
                <LoadingSkeleton className="h-24" count={3} />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-5 text-center space-y-1 bg-white/5 border-white/5">
                  <div className="text-2xl font-black text-white">{stats.emitted}</div>
                  <div className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Émis</div>
                </div>
                <div className="glass-card p-5 text-center space-y-1 bg-white/5 border-white/5">
                  <div className="text-2xl font-black text-white">{stats.verified}</div>
                  <div className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Vérifiés</div>
                </div>
                <div className="glass-card p-5 text-center space-y-1 bg-white/5 border-white/5">
                  <div className="text-2xl font-black text-brand-latte">{stats.validity}%</div>
                  <div className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Score</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 ml-2">Registre Récent</h3>
                <div className="space-y-3">
                  {recentDiplomas.length > 0 ? recentDiplomas.slice(0, 3).map(d => (
                    <div key={d.id} className="glass-card p-5 flex items-center justify-between bg-white/[0.02] border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xs font-black text-white border border-white/10 group-hover:bg-brand-latte transition-colors">
                          {d.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white/90">{d.fullName}</div>
                          <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{d.specialty}</div>
                        </div>
                      </div>
                      <Badge className="bg-brand-success/10 text-brand-success border border-brand-success/20">VALIDE</Badge>
                    </div>
                  )) : (
                    <div className="text-center py-12 glass-card border-dashed border-white/5">
                       <p className="text-xs text-white/20 font-bold uppercase tracking-[0.2em]">En attente d'émission</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <button onClick={handleStartIssuance} className="w-full btn-primary fixed bottom-28 left-0 right-0 max-w-[340px] mx-auto h-16 shadow-[0_20px_50px_rgba(79,195,247,0.2)]">
            Émettre un nouveau Titre
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <ProgressBar steps={['Données', 'Preuve', 'Fin']} current={0} />
          <div className="space-y-2 mt-4">
            <span className="text-[11px] text-brand-latte font-bold tracking-[0.3em] uppercase italic">Phase 01</span>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Saisie du Registre</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 ml-4 uppercase font-bold tracking-[0.2em]">Nom complet du titulaire</label>
              <input 
                placeholder="EX: NAGALO ABIGAIL" 
                className="w-full input-field italic text-sm border-white/5"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 ml-4 uppercase font-bold tracking-[0.2em]">Libellé du diplôme</label>
              <input 
                placeholder="EX: LICENCE INFORMATIQUE" 
                className="w-full input-field italic text-sm border-white/5"
                value={formData.specialty}
                onChange={e => setFormData({...formData, specialty: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 ml-4 uppercase font-bold tracking-[0.2em]">Mention</label>
                <input 
                  placeholder="TRÈS BIEN" 
                  className="w-full input-field px-4 italic text-sm border-white/5"
                  value={formData.mention}
                  onChange={e => setFormData({...formData, mention: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 ml-4 uppercase font-bold tracking-[0.2em]">Année</label>
                <input 
                  placeholder="2024" 
                  className="w-full input-field px-4 italic text-sm border-white/5"
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSignature} 
            disabled={!formData.fullName || !formData.specialty}
            className="w-full btn-primary h-16 shadow-[0_15px_40px_rgba(79,195,247,0.3)] mt-8"
          >
            Passer à la signature →
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
          <ProgressBar steps={['Données', 'Preuve', 'Fin']} current={1} />
          
          <div className="space-y-8">
            <div className="space-y-1">
              <span className="text-[10px] text-brand-latte font-black tracking-[0.2em] uppercase">Phase 02</span>
              <h2 className="text-3xl font-black text-white tracking-tight">Ancrage Blockchain</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Calculer la Preuve', p: 30 },
                { label: 'Signature de Clé', p: 60 },
                { label: 'Validation du Noeud', p: 95 }
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-6 flex items-center justify-between border-white/5">
                  <div className="flex items-center space-x-5">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700",
                      progress >= item.p ? "bg-brand-success text-white" : "bg-white/5 text-white/10"
                    )}>
                      {progress >= item.p ? <Check size={24} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
                    </div>
                    <span className={cn(
                      "text-sm font-bold transition-colors duration-500",
                      progress >= item.p ? "text-white" : "text-white/20"
                    )}>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-4">
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em] animate-pulse">Signature électronique en cours...</p>
            </div>
          </div>

          <button 
            onClick={handleConfirm} 
            disabled={isSigning || progress < 100}
            className="w-full btn-primary h-16 shadow-[0_15px_40px_rgba(79,195,247,0.3)]"
          >
            Valider l'Émission
          </button>
        </motion.div>
      )}

      {step === 4 && registeredDiploma && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-10 py-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-brand-success text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,0.3)] border border-brand-success/20">
              <CheckCircle2 size={56} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white">Succès !</h2>
              <p className="text-[11px] text-white/30 uppercase font-bold tracking-[0.3em]">Certification Inscrite sur DiploChain</p>
            </div>
          </div>

          <div className="glass-card p-10 space-y-10 bg-white/5 shadow-2xl border-white/5">
            <div className="grid grid-cols-1 gap-y-6 text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Titulaire</span>
                <span className="text-white font-black">{registeredDiploma.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Domaine</span>
                <span className="text-white font-black font-serif italic">{registeredDiploma.specialty}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>TX ID</span>
                <span className="text-brand-latte font-mono lowercase tracking-normal">{registeredDiploma.id}</span>
              </div>
            </div>

            <div className="flex justify-center p-8 bg-black/20 rounded-[3rem] shadow-inner border border-white/5">
              <QRCodeSVG value={registeredDiploma.hash} size={160} level="H" fgColor="#FFFFFF" className="opacity-90" />
            </div>
          </div>

          <div className="space-y-4">
            <button onClick={() => setStep(1)} className="w-full btn-primary h-16 shadow-[0_15px_40px_rgba(79,195,247,0.3)]">
              Accorder l'accès au Diplômé
            </button>
            <button onClick={() => { setFormData({fullName:'', specialty:'', mention:'', year:''}); setStep(2); }} className="w-full text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              Émettre une autre Certification
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
