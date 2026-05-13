import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const WalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = React.useState(false);

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <>
      <button
        onClick={() => isConnected ? disconnect() : setShowModal(true)}
        className={cn(
          "flex items-center space-x-2 py-2.5 px-5 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
          isConnected 
            ? "bg-brand-success/10 text-brand-success border border-brand-success/20 shadow-[0_5px_15px_rgba(16,185,129,0.1)]" 
            : "bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 active:scale-95"
        )}
      >
        <Wallet size={14} strokeWidth={2.5} />
        <span className="mt-0.5">{isConnected ? truncatedAddress : 'Connect'}</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#0B1E3B] rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 border border-white/10"
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tight">Wallet Connect</h3>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em]">Select Provider</p>
              </div>

              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => {
                        connect({ connector });
                        setShowModal(false);
                    }}
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#162B4D] rounded-xl flex items-center justify-center border border-white/5">
                         <span className="font-bold text-white text-xs">{connector.name[0]}</span>
                      </div>
                      <span className="font-bold text-white/80">{connector.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full text-center py-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                Annuler
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
