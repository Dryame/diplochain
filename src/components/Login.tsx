import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (role: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'INSTITUTION' | 'GRADUATE' | 'RECRUITER' | null>(() => {
    const saved = localStorage.getItem('diplo_last_role');
    return (saved as any) || null;
  });
  const [email, setEmail] = useState(() => localStorage.getItem('diplo_last_email') || '');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [step, setStep] = useState(0); // 0: Login, 1: 2FA
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (role) localStorage.setItem('diplo_last_role', role);
  }, [role]);

  React.useEffect(() => {
    localStorage.setItem('diplo_last_email', email);
  }, [email]);

  // Requirements: 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePassword = (pass: string) => {
    return passwordRegex.test(pass);
  };

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 0) {
      if (!role) {
        setError("Veuillez sélectionner votre profil.");
        return;
      }

      if (!validateEmail(email)) {
        setError("Veuillez entrer une adresse email valide.");
        return;
      }

      if (!validatePassword(password)) {
        setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.");
        return;
      }

      // If institution or recruiter, trigger 2FA
      if (role === 'INSTITUTION' || role === 'RECRUITER') {
        setStep(1);
        return;
      }

      // Graduate skip 2FA
      performLogin();
    } else {
      // Step 1: 2FA verification (Mock code: 123456)
      if (twoFACode === '123456') {
        performLogin();
      } else {
        setError("Code de vérification invalide. Essayez '123456'.");
      }
    }
  };

  const performLogin = () => {
    if (!role) return;
    onLogin(role);
    const paths = {
      INSTITUTION: '/institution',
      GRADUATE: '/diplome',
      RECRUITER: '/recruteur'
    };
    navigate(paths[role]);
  };

  const roles = [
    { id: 'INSTITUTION', label: 'Institution', desc: 'Universités & Écoles' },
    { id: 'GRADUATE', label: 'Diplômé', desc: 'Portefeuille numérique' },
    { id: 'RECRUITER', label: 'Recruteur', desc: 'Vérification de titres' }
  ];

  return (
    <div className="max-w-xl mx-auto py-24">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-16 space-y-16 bg-white relative rounded-none border-slate-900 border-t-[8px]"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-brand-blue-primary mx-auto flex items-center justify-center">
            <Lock className="text-white" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic font-serif">
              {step === 0 ? 'Accès Sécurisé' : 'Vérification'}
            </h2>
            <p className="text-sm font-serif text-slate-400 italic">
              {step === 0 ? 'Authentification requise pour le personnel autorisé.' : 'Un code 2FA a été généré pour votre session.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {step === 0 ? (
            <>
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Sélection du Profil</label>
                <div className="grid grid-cols-1 gap-px bg-slate-200 border border-slate-200">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={cn(
                        "flex justify-between items-center p-8 bg-white transition-all text-left group",
                        role === r.id 
                          ? "bg-slate-50" 
                          : "hover:bg-slate-50/50"
                      )}
                    >
                      <div className="space-y-1">
                        <span className={cn("text-sm font-black uppercase tracking-widest block", role === r.id ? "text-brand-accent" : "text-slate-900")}>{r.label}</span>
                        <span className="text-[10px] text-slate-400 font-serif italic">{r.desc}</span>
                      </div>
                      {role === r.id && <CheckCircle2 size={20} className="text-brand-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Identifiants</label>
                  <div className="space-y-px">
                    <input
                      type="email"
                      placeholder="Email institutionnel"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-field w-full border-b-0"
                    />
                    <input
                      type="password"
                      placeholder="Clef de sécurité"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                  {[
                    { label: '8+ Caract.', met: password.length >= 8 },
                    { label: 'Majuscule', met: /[A-Z]/.test(password) },
                    { label: 'Chiffre', met: /\d/.test(password) },
                    { label: 'Spécial', met: /[@$!%*?&]/.test(password) }
                  ].map((req, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", req.met ? "bg-brand-success" : "bg-slate-200")} />
                      <span className={cn("text-[8px] font-black uppercase tracking-widest", req.met ? "text-brand-success" : "text-slate-300")}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-10">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center block">Code de vérification (Blockchain 2FA)</label>
                <input
                  type="text"
                  placeholder="000 000"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  maxLength={6}
                  required
                  autoFocus
                  className="input-field w-full text-center text-5xl font-black tracking-[0.4em] font-mono py-10 bg-slate-50 border-slate-900 border-2"
                />
              </div>
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setStep(0)}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors inline-flex items-center space-x-2"
                >
                  <span>← Retour aux identifiants</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {error && (
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest text-center animate-shake p-4 bg-red-50">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full py-6 text-sm font-black shadow-heavy hover:translate-y-[-2px] active:translate-y-[0px]">
              <span>{step === 0 ? 'Entrer dans DiploChain' : 'Vérifier la Signature'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
