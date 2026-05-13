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
    <div className="h-full flex flex-col p-6 space-y-10 overflow-y-auto pb-24 no-scrollbar">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight font-serif italic uppercase">Superviseur</h2>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Console de Contrôle DiploChain</p>
          </div>
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
            <Settings size={28} className="text-white/40 group-hover:text-white transition-colors" />
          </div>
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={fetchAdminData} />
        ) : isLoading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <LoadingSkeleton className="h-32" count={2} />
            </div>
            <LoadingSkeleton className="h-24" count={3} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 space-y-4 bg-white/[0.03] border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Database size={40} strokeWidth={1} />
                </div>
                <div className="space-y-1 relative z-10">
                  <div className="text-3xl font-black text-white tracking-tighter">12</div>
                  <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Institutions</div>
                </div>
                <div className="flex items-center space-x-2 text-[8px] text-brand-success font-black uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                  <span>Actives</span>
                </div>
              </div>
              <div className="glass-card p-6 space-y-4 bg-white/[0.03] border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Shield size={40} strokeWidth={1} />
                </div>
                <div className="space-y-1 relative z-10">
                  <div className="text-3xl font-black text-white tracking-tighter">{stats.emitted.toLocaleString()}</div>
                  <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Diplômes</div>
                </div>
                <div className="flex items-center space-x-2 text-[8px] text-brand-latte font-black uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-brand-latte animate-pulse" />
                  <span>Sécurisés</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 ml-4">Maintenance Systémique</h3>
              <div className="space-y-3">
                {[
                  { icon: <Database size={20} />, label: 'Accréditations', desc: 'Gestion des clés universités', color: 'bg-brand-latte/10 text-brand-latte' },
                  { icon: <AlertTriangle size={20} />, label: 'Alertes Fraude', desc: '3 signalements suspects', color: 'bg-red-500/10 text-red-500', alert: '3' },
                  { icon: <Activity size={20} />, label: 'Logs de Transaction', desc: 'Analyse des blocs temps réel', color: 'bg-blue-500/10 text-blue-400' }
                ].map((action, i) => (
                  <div key={i} className="glass-card p-5 flex items-center justify-between bg-white/[0.01] hover:bg-white/[0.05] border-white/[0.03] cursor-pointer transition-all group">
                    <div className="flex items-center space-x-5">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", action.color)}>
                        {action.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{action.label}</div>
                        <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{action.desc}</div>
                      </div>
                    </div>
                    {action.alert && <Badge className="bg-red-500/20 text-red-500 border-none font-black px-3">{action.alert}</Badge>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 -m-8 w-40 h-40 bg-brand-latte/5 blur-[80px] group-hover:bg-brand-latte/10 transition-all" />
               <div className="flex items-start justify-between relative z-10">
                 <div className="space-y-1">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Statut du Réseau</h4>
                   <div className="flex items-center space-x-3 text-[11px] text-brand-success font-black uppercase tracking-widest">
                     <div className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                     <span>Mainnet Burkina Faso Actif</span>
                   </div>
                 </div>
                 <Server size={24} className="text-white/10" />
               </div>
               <div className="space-y-2 relative z-10">
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-brand-latte" 
                   />
                 </div>
                 <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                   <span>Charge CPU : 42%</span>
                   <span>RAM : 12.4 GB / 32 GB</span>
                 </div>
               </div>
               <p className="text-[9px] text-white/10 font-mono tracking-tighter uppercase relative z-10">Dernière synchronisation : #{Math.floor(Math.random() * 99999999)} · UTC-0</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
