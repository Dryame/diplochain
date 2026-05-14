import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Check, Clock, CheckCircle2, Plus } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CryptoService, DiplomaData } from '../services/cryptoService';
import { blockchainService, RegisteredDiploma } from '../services/blockchainService';
import { Badge, ProgressBar, LoadingSkeleton, ErrorMessage, getBlockchainErrorMessage } from './Common';
import { useError } from './ErrorProvider';
import { cn } from '../lib/utils';

export const InstitutionProfile = () => {
  const { reportError } = useError();
  const [step, setStep] = useState(0); // 0: Login, 1: Dashboard, 2: Form, 3: Signature, 4: Confirmation
  const [formData, setFormData] = useState<DiplomaData>(() => {
    const saved = localStorage.getItem('diplo_form_data');
    return saved ? JSON.parse(saved) : {
      fullName: '',
      specialty: '',
      mention: '',
      year: ''
    };
  });

  React.useEffect(() => {
    localStorage.setItem('diplo_form_data', JSON.stringify(formData));
  }, [formData]);

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
  
  const sanitizeInput = (val: string) => {
    return val.replace(/[<>]/g, '').trim();
  };

  const handleInputChange = (field: keyof DiplomaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
  };

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
      const msg = getBlockchainErrorMessage(err);
      setError(msg);
      reportError(`Échec de la certification: ${msg}`);
      clearInterval(interval);
      setStep(1); // Go back to dashboard on error
    } finally {
      setIsSigning(false);
    }
  };

  const handleConfirm = () => setStep(4);

  return (
    <div className="h-full space-y-12">
      {step === 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto flex flex-col items-center space-y-16 pt-32">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 text-brand-accent font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
              <div className="w-12 h-px bg-brand-accent" />
              <span>Accès Institutionnel</span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter text-slate-900 font-serif italic uppercase leading-none">Archives <br/> <span className="text-slate-300 italic underline decoration-1 underline-offset-8">Centrales.</span></h1>
          </div>
          <div className="w-full space-y-10 bg-white p-16 rounded-none border border-slate-900 shadow-heavy relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-900" />
            <div className="space-y-6">
              <input type="email" defaultValue="admin@univ-ouaga.bf" className="w-full input-field border-2" placeholder="Identifiant Institutionnel" />
              <input type="password" defaultValue="password" className="w-full input-field border-2" placeholder="Clef de Sécurité" />
            </div>
            <button onClick={() => setStep(1)} className="w-full btn-primary py-8 text-sm">
              Authentifier & Ouvrir le Registre
            </button>
          </div>
        </motion.div>
      )}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24 pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-16 border-b-4 border-slate-900 pb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-brand-accent font-bold uppercase tracking-[0.4em] text-[10px]">
                <span>Ministère de l'Enseignement Supérieur</span>
              </div>
              <h2 className="text-9xl font-black text-slate-900 tracking-tighter font-serif uppercase italic leading-none">Registre.</h2>
              <p className="text-2xl text-slate-500 font-serif italic">Université Joseph Ki-Zerbo · Ouagadougou</p>
            </div>
            <button onClick={handleStartIssuance} className="btn-primary px-16 py-8 h-auto text-sm shadow-heavy">
              <Plus size={20} strokeWidth={3} />
              <span>Certifier un Nouveau Titre</span>
            </button>
          </div>

          {error ? (
            <ErrorMessage message={error} onRetry={fetchData} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse border border-slate-100" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
              {/* Stats */}
              <div className="lg:col-span-5 space-y-20">
                <div className="space-y-6">
                  <div className="text-[12rem] font-black text-slate-900 tracking-tighter font-serif leading-none italic">{stats.emitted}</div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] border-t border-slate-200 pt-6">Diplômes Ancres dans la Blockchain</div>
                </div>
                <div className="grid grid-cols-2 gap-16">
                   <div className="space-y-4">
                      <div className="text-6xl font-black text-slate-900 font-serif italic">{stats.verified}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.4em]">Audits Réalisés</div>
                   </div>
                   <div className="space-y-4">
                      <div className="text-6xl font-black text-brand-accent font-serif italic">{stats.validity}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.4em]">Niveau d’Integrité</div>
                   </div>
                </div>
              </div>

              {/* Activity */}
              <div className="lg:col-span-7 space-y-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] flex items-center gap-4">
                  <span>Flux de Transaction Récent</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </h3>
                <div className="divide-y-2 divide-slate-50">
                  {recentDiplomas.length > 0 ? recentDiplomas.slice(0, 6).map(d => (
                    <div key={d.id} className="py-10 flex items-center justify-between group cursor-default">
                      <div className="space-y-2">
                        <div className="text-3xl font-black text-slate-900 font-serif italic group-hover:text-brand-accent transition-all duration-500 group-hover:translate-x-2 block uppercase">{d.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] font-sans">{d.specialty}</div>
                      </div>
                      <div className="text-right space-y-3">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">{new Date(d.timestamp).toLocaleDateString()}</div>
                        <Badge className="bg-slate-950 text-white border-transparent">Vérifié</Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="py-32 text-center opacity-10">
                      <Shield size={120} className="mx-auto mb-8" />
                      <p className="text-xl font-black uppercase tracking-[1em]">Vide</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto space-y-20">
          <ProgressBar steps={['Saisie', 'Signature', 'Confirmation']} current={0} />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
            <div className="md:col-span-5 space-y-10">
              <div className="space-y-8">
                <div className="flex items-center space-x-3 text-brand-accent font-bold uppercase tracking-[0.4em] text-[10px]">
                  <div className="w-12 h-px bg-brand-accent" />
                  <span>Certification Digitale</span>
                </div>
                <h2 className="text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] font-serif italic uppercase">Données <br/> <span className="text-slate-300">Porteur.</span></h2>
                <p className="text-xl text-slate-500 font-serif leading-relaxed italic pr-12">Saisissez les informations académiques certifiées. Ces données seront hachées et immuablement inscrites sur la blockchain nationale.</p>
              </div>
              
              <div className="p-12 bg-slate-50 border-l-[12px] border-slate-900 shadow-xl">
                 <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900">Standard de Sécurité</p>
                    <p className="text-base text-slate-500 font-serif italic leading-relaxed">Le certificat généré sera conforme au standard W3C Verifiable Credentials.</p>
                 </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-12 bg-white p-20 border-[8px] border-slate-950 shadow-heavy relative">
               <div className="absolute -top-8 -left-8 w-16 h-16 bg-slate-950 flex items-center justify-center">
                  <Shield className="text-white" size={32} />
               </div>
              <div className="grid grid-cols-1 gap-12 pt-8">
                <div className="space-y-4">
                  <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.4em] block">Nom complet du Titulaire</label>
                  <input 
                    placeholder="EX: NAGALO ABIGAIL" 
                    className="w-full input-field text-2xl font-black uppercase tracking-tight border-2"
                    value={formData.fullName}
                    onChange={e => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.4em] block">Spécialité / Filière</label>
                  <input 
                    placeholder="EX: LICENCE EN GÉNIE LOGICIEL" 
                    className="w-full input-field text-xl font-bold border-2"
                    value={formData.specialty}
                    onChange={e => handleInputChange('specialty', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.4em] block">Mention</label>
                    <input 
                      placeholder="TRÈS BIEN" 
                      className="w-full input-field border-2"
                      value={formData.mention}
                      onChange={e => handleInputChange('mention', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.4em] block">Série / Année</label>
                    <input 
                      placeholder="2024" 
                      className="w-full input-field border-2"
                      value={formData.year}
                      onChange={e => handleInputChange('year', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col sm:flex-row gap-8">
                <button 
                  onClick={handleSignature} 
                  disabled={!formData.fullName || !formData.specialty}
                  className="flex-3 btn-primary py-8 text-base shadow-heavy group"
                >
                  <span className="group-hover:translate-x-2 transition-transform">Lancer l’Incrustation Blockchain →</span>
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 rounded-none border-2 border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all font-sans bg-white"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-16">
          <ProgressBar steps={['Données', 'Preuve', 'Fin']} current={1} />
          
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="hero-glow w-60 h-60 bg-brand-blue-primary/10 inset-0 m-auto animate-pulse pointer-events-none" />
              <div className="w-40 h-40 bg-white rounded-full border border-slate-200 flex items-center justify-center relative z-10 backdrop-blur-3xl shadow-2xl">
                 <div className="w-32 h-32 rounded-full border-4 border-brand-blue-primary/10 border-t-brand-blue-primary animate-spin" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter font-serif italic uppercase">Ancrage Sécurisé</h2>
              <p className="text-slate-500 uppercase font-black tracking-[0.4em] text-xs animate-pulse">Signature électronique en cours...</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Calcul de l\'empreinte SHA-256', p: 30 },
              { label: 'Authentification de l\'émetteur', p: 60 },
              { label: 'Validation du consensus réseau', p: 95 }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-8 flex items-center justify-between border-slate-200 transition-all duration-500 overflow-hidden relative">
                <div className="flex items-center space-x-8 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg",
                    progress >= item.p ? "bg-brand-success text-white shadow-brand-success/20" : "bg-white text-slate-300 border border-slate-200"
                  )}>
                    {progress >= item.p ? <Check size={28} strokeWidth={3} /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                  </div>
                  <span className={cn(
                    "text-lg font-black transition-colors duration-500",
                    progress >= item.p ? "text-slate-900" : "text-slate-400"
                  )}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleConfirm} 
            disabled={isSigning || progress < 100}
            className="w-full btn-primary h-20 text-sm shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
          >
            Confirmer l'Inscription au Registre
          </button>
        </motion.div>
      )}

      {step === 4 && registeredDiploma && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-5xl mx-auto space-y-16 pb-20">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="hero-glow w-48 h-48 bg-brand-success/10 inset-0 m-auto pointer-events-none" />
              <div className="w-32 h-32 bg-brand-success text-white rounded-[3.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(16,185,129,0.2)] border border-white/20 relative z-10 transition-transform hover:scale-110 duration-500">
                <CheckCircle2 size={64} strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter font-serif italic uppercase leading-none">Emission Certifiée</h2>
              <p className="text-slate-500 uppercase font-black tracking-[0.5em] text-[10px]">Identité numérique sécurisée sur la blockchain</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="glass-card p-12 space-y-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-blue-primary" />
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-10">
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.3em] block mb-2">Diplômé</label>
                      <div className="text-4xl font-black text-slate-900">{registeredDiploma.fullName}</div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.3em] block mb-2">Certification</label>
                      <div className="text-3xl font-black text-brand-blue-primary font-serif italic">{registeredDiploma.specialty}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.3em] block mb-2">Mention</label>
                      <div className="text-xl font-black text-slate-900 uppercase">{registeredDiploma.mention}</div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 uppercase font-black tracking-[0.3em] block mb-2">Série / Année</label>
                      <div className="text-xl font-black text-slate-900 uppercase">{registeredDiploma.year}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 font-mono text-[10px] text-slate-400 truncate uppercase tracking-widest">
                  Blockchain Hash: {registeredDiploma.hash}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card p-12 flex flex-col items-center justify-center space-y-8 shadow-2xl group hover:border-brand-blue-primary/30 transition-colors">
                <div className="p-6 bg-white rounded-[2.5rem] shadow-sm group-hover:scale-105 transition-transform duration-500 border border-slate-100">
                  <QRCodeSVG value={registeredDiploma.hash} size={220} level="H" fgColor="#0F172A" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Identifiant Unique (QR)</p>
                  <p className="text-[10px] text-slate-600 font-mono">{registeredDiploma.id}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => setStep(1)} className="flex-1 btn-primary h-20 text-sm">
                  Tableau de Bord
                </button>
                <button onClick={() => { setFormData({fullName:'', specialty:'', mention:'', year:''}); setStep(2); }} className="flex-1 h-20 rounded-full text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all border border-slate-200 bg-white">
                  Émettre un autre Titre
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
