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
  LayoutDashboard,
  Mail,
  Phone,
  MapPin,
  Github,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import { ErrorProvider } from './components/ErrorProvider';
import { InstitutionProfile } from './components/InstitutionProfile';
import { GraduateProfile } from './components/GraduateProfile';
import { RecruiterProfile } from './components/RecruiterProfile';
import { AdminProfile } from './components/AdminProfile';
import { Home } from './components/Home';
import { WalletButton } from './components/WalletButton';
import { VerificationResult } from './components/VerificationResult';
import { Login } from './components/Login';
import { cn } from './lib/utils';

// --- Layout Component ---

interface AuthContextType {
  role: string | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  role: null,
  isAuthenticated: false,
  logout: () => {}
});

const AppLayout = ({ children, auth }: { children: React.ReactNode, auth: AuthContextType }) => {
  const location = useLocation();
  const path = location.pathname;

  const getProfile = () => {
    if (path === '/') return 'HOME';
    if (path.startsWith('/institution')) return 'INSTITUTION';
    if (path.startsWith('/diplome')) return 'GRADUATE';
    if (path.startsWith('/recruteur')) return 'RECRUITER';
    if (path.startsWith('/admin')) return 'ADMIN';
    return 'HOME';
  };

  const profile = getProfile();

  const navItems = [
    { id: 'HOME', label: 'Accueil', path: '/' },
    { id: 'INSTITUTION', label: 'Institution', path: '/institution' },
    { id: 'GRADUATE', label: 'Diplômé', path: '/diplome' },
    { id: 'RECRUITER', label: 'Recruteur', path: '/recruteur' },
    { id: 'ADMIN', label: 'Gestion', path: '/admin' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Top Banner - Minimal */}
      <div className="w-full bg-brand-blue-primary py-2 px-10 text-white flex justify-between items-center text-[10px] font-medium tracking-widest hidden md:flex">
        <span>GOUVERNEMENT DU BURKINA FASO</span>
        <div className="flex items-center space-x-6">
          <span>MINISTERE DE L'ENSEIGNEMENT SUPERIEUR</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between relative">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-slate-900 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic font-serif leading-none">DiploChain</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 absolute left-1/2 -translate-x-1/2">
            {navItems.map((p) => (
              <Link
                key={p.id}
                to={p.path}
                className={cn(
                  "text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative py-2",
                  profile === p.id 
                    ? "text-brand-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-brand-accent" 
                    : "text-slate-400 hover:text-slate-900"
                )}
              >
                {p.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-8">
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">{auth.role}</span>
                <button 
                  onClick={auth.logout}
                  className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
               <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary hover:text-slate-900 transition-colors">
                 Connexion →
               </Link>
            )}
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <GlobalErrorBoundary>
          <div className="max-w-[1600px] mx-auto px-10 py-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </GlobalErrorBoundary>
      </main>

      {/* Elegant Footer */}
      <footer className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue-primary opacity-50" />
        <div className="max-w-[1600px] mx-auto px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="space-y-8 max-w-sm">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white flex items-center justify-center">
                  <Shield className="text-slate-900" size={28} />
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic font-serif">DiploChain</h1>
              </div>
              <p className="text-xl text-slate-200 font-serif leading-relaxed italic">
                Le registre national de certification académique sécurisé par la blockchain.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Accès</h4>
                <ul className="space-y-4 text-xs font-medium text-slate-300">
                  <li><Link to="/verifier" className="hover:text-white transition-colors">Vérification publique</Link></li>
                  <li><Link to="/institution" className="hover:text-white transition-colors">Portail établissement</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Légalité</h4>
                <ul className="space-y-4 text-xs font-medium text-slate-300">
                  <li><span className="hover:text-white cursor-pointer transition-colors">Conditions d'utilisation</span></li>
                  <li><span className="hover:text-white cursor-pointer transition-colors">Protection des données</span></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Aide</h4>
                <ul className="space-y-4 text-xs font-medium text-slate-300">
                  <li><span className="hover:text-white cursor-pointer transition-colors">Support technique</span></li>
                  <li><span className="hover:text-white cursor-pointer transition-colors">FAQ Établissements</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            <span>© 2026 DiploChain · Burkina Faso</span>
            <span>Version 1.0.4 Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [auth, setAuth] = React.useState<{ isAuthenticated: boolean; role: string | null }>(() => {
    const saved = localStorage.getItem('diplo_auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: false, role: null };
  });

  React.useEffect(() => {
    localStorage.setItem('diplo_auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (role: string) => {
    setAuth({ isAuthenticated: true, role });
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: null });
  };

  const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) => {
    if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRole && auth.role !== allowedRole) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthContext.Provider value={{ ...auth, logout: handleLogout }}>
          <AppLayout auth={{ ...auth, logout: handleLogout }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={auth.isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
              <Route path="/institution" element={
                <ProtectedRoute allowedRole="INSTITUTION">
                  <InstitutionProfile />
                </ProtectedRoute>
              } />
              <Route path="/diplome" element={
                <ProtectedRoute allowedRole="GRADUATE">
                  <GraduateProfile />
                </ProtectedRoute>
              } />
              <Route path="/recruteur" element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <RecruiterProfile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={<AdminProfile />} />
              <Route path="/verifier" element={<VerificationResult />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </AuthContext.Provider>
      </ErrorProvider>
    </BrowserRouter>
  );
}
