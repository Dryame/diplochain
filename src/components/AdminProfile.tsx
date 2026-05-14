import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, UserCheck, AlertTriangle, Activity, Database, Server } from 'lucide-react';
import { Badge, LoadingSkeleton, ErrorMessage, getBlockchainErrorMessage } from './Common';
import { blockchainService } from '../services/blockchainService';
import { cn } from '../lib/utils';

export const AdminProfile = () => {
  const [stats, setStats] = useState({ emitted: 0, verified: 0, validity: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await blockchainService.getStats();
      setStats(data);
    } catch (err) {
      setError(getBlockchainErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="h-full space-y-12 pb-20 no-scrollbar">
      {error ? (
        <ErrorMessage message={error} onRetry={fetchAdminData} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 animate-pulse" />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-slate-100 pb-12">
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter font-serif uppercase italic leading-none">Superviseur</h2>
              <p className="text-lg text-slate-500 font-serif lowercase italic">Réseau DiploChain / {stats.emitted} titres sécurisés</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-slate-50 flex items-center justify-center border border-slate-100">
                 <Settings size={24} className="text-brand-blue-primary" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-4">
                <div className="text-8xl font-black text-slate-900 tracking-tighter font-serif">12</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institutions</div>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-black text-brand-blue-primary tracking-tighter font-serif italic">Mainnet 1.0</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Noeud Stable</div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100">
                  {[
                    { label: 'Accréditations', desc: 'Gestion des établissements' },
                    { label: 'Risque', desc: 'Audit du consensus' },
                    { label: 'Meta-Logs', desc: 'Journal système' },
                    { label: 'Audits', desc: 'Rapports conformité' }
                  ].map((action, i) => (
                    <div key={i} className="bg-white p-10 space-y-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="text-xl font-bold text-slate-900 font-serif uppercase italic">{action.label}</div>
                      <p className="text-sm text-slate-400 font-serif">{action.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
