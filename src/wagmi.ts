/// <reference types="vite/client" />
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// VITE_WALLETCONNECT_PROJECT_ID should be defined in .env.example
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'fb242498263156cf389178696bed5133'; // Default placeholder

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
