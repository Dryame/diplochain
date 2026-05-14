
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { XCircle, AlertCircle, X } from 'lucide-react';

interface ErrorContextType {
  reportError: (message: string, type?: 'ERROR' | 'WARNING') => void;
  clearError: (id: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error('useError must be used within an ErrorProvider');
  return context;
};

interface ErrorItem {
  id: string;
  message: string;
  type: 'ERROR' | 'WARNING';
}

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  const reportError = useCallback((message: string, type: 'ERROR' | 'WARNING' = 'ERROR') => {
    const id = Math.random().toString(36).substr(2, 9);
    setErrors((prev) => [...prev, { id, message, type }]);
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e.id !== id));
    }, 5000);
  }, []);

  const clearError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <ErrorContext.Provider value={{ reportError, clearError }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[1000] flex flex-col space-y-4 pointer-events-none">
        <AnimatePresence>
          {errors.map((error) => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto bg-slate-950 text-white p-6 rounded-2xl shadow-2xl border border-white/10 min-w-[320px] max-w-md flex items-start space-x-4"
            >
              <div className={error.type === 'ERROR' ? "text-red-500" : "text-amber-500"}>
                <AlertCircle size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Notification Système</p>
                <p className="text-sm font-serif">{error.message}</p>
              </div>
              <button 
                onClick={() => clearError(error.id)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ErrorContext.Provider>
  );
};
