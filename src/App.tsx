/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Shield, 
  User, 
  Search, 
  Settings, 
  Plus,
  Share2,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import { InstitutionProfile } from './components/InstitutionProfile';
import { GraduateProfile } from './components/GraduateProfile';
import { RecruiterProfile } from './components/RecruiterProfile';
import { AdminProfile } from './components/AdminProfile';
import { WalletButton } from './components/WalletButton';
import { VerificationResult } from './components/VerificationResult';
import { cn } from './lib/utils';

// --- Layout Component ---

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;

  const getProfile = () => {
    if (path.startsWith('/institution')) return 'INSTITUTION';
    if (path.startsWith('/diplome')) return 'GRADUATE';
    if (path.startsWith('/recruteur')) return 'RECRUITER';
    if (path.startsWith('/admin')) return 'ADMIN';
    return 'INSTITUTION';
  };

  const profile = getProfile();

  const navItems = [
    { id: 'INSTITUTION', label: 'Institution', path: '/institution', icon: <Shield size={14} /> },
    { id: 'GRADUATE', label: 'Diplômé', path: '/diplome', icon: <User size={14} /> },
    { id: 'RECRUITER', label: 'Recruteur', path: '/recruteur', icon: <Search size={14} /> },
    { id: 'ADMIN', label: 'Admin', path: '/admin', icon: <Settings size={14} /> }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#040D1A] overflow-hidden sm:p-4">
      {/* Container simulating a mobile phone frame */}
      <div className="relative w-full max-w-[430px] h-screen sm:h-[932px] sm:rounded-[3.5rem] bg-brand-night overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col border border-white/5 ring-12 ring-black/20">
        {/* Status Bar Shim */}
        <div className="h-12 w-full flex items-center justify-between px-8 z-50 pt-2 text-white/40">
          <span className="text-sm font-bold">9:41</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1.5 h-3 bg-white/60 rounded-[2px]" />
              <div className="w-1.5 h-3 bg-white/60 rounded-[2px]" />
              <div className="w-1.5 h-3 bg-white/60 rounded-[2px]" />
              <div className="w-1.5 h-3 bg-white/10 rounded-[2px]" />
            </div>
            <span className="text-[10px] font-bold">100%</span>
          </div>
        </div>

        <div className="px-8 mt-4 flex justify-between items-center mb-6">
            <h1 className="text-3xl font-black text-white tracking-tighter font-serif">DiploChain</h1>
            <WalletButton />
        </div>

        {/* Profile Navigator - Modern Segmented Control */}
        <div className="px-6 mb-6">
          <div className="flex p-1.5 bg-white/5 rounded-2xl z-50 overflow-x-auto no-scrollbar border border-white/5 shadow-inner">
            {navItems.map((p) => (
              <Link
                key={p.id}
                to={p.path}
                className={cn(
                  "flex-1 min-w-[max-content] flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 font-serif italic",
                  profile === p.id 
                    ? "bg-brand-latte text-white shadow-[0_10px_20px_rgba(79,195,247,0.3)] scale-100" 
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {p.icon}
                <span>{p.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={path}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Sim - Modern Float Style */}
        {profile !== 'RECRUITER' && (
          <div className="px-6 pb-10 pt-2 z-50">
            <div className="h-24 bg-[#142640]/80 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-around px-2 border border-white/10 shadow-2xl">
               {[
                 { icon: <LayoutDashboard size={22} />, label: 'Accueil' },
                 { icon: <CreditCard size={22} />, label: profile === 'INSTITUTION' ? 'Coffre' : 'Détail' },
                 { icon: profile === 'INSTITUTION' ? <Plus size={22} /> : <Share2 size={22} />, label: profile === 'INSTITUTION' ? 'Émettre' : 'Partager' },
                 { icon: <Settings size={22} />, label: 'Profil' }
               ].map((item, i) => (
                 <div key={i} className={cn("flex flex-col items-center space-y-1.5 cursor-pointer transition-all duration-300 group", i === 0 ? "text-brand-latte" : "text-white/20 hover:text-white/40")}>
                    <div className={cn("p-2.5 rounded-2xl transition-all", i === 0 ? "bg-brand-latte/10 shadow-lg" : "group-hover:bg-white/5")}>
                      {item.icon}
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
        
        {/* iOS Indicator Shim */}
        <div className="h-1.5 w-36 bg-white/10 rounded-full mx-auto mb-6 z-50" />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<InstitutionProfile />} />
          <Route path="/institution" element={<InstitutionProfile />} />
          <Route path="/diplome" element={<GraduateProfile />} />
          <Route path="/recruteur" element={<RecruiterProfile />} />
          <Route path="/admin" element={<AdminProfile />} />
          <Route path="/verifier" element={<VerificationResult />} />
          <Route path="*" element={<Navigate to="/recruteur" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
