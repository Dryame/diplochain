import { DiplomaData } from './cryptoService';

export interface RegisteredDiploma extends DiplomaData {
  id: string;
  hash: string;
  signature: string;
  issuerAddress: string;
  timestamp: number;
}

export enum BlockchainErrorType {
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  INVALID_DATA = 'INVALID_DATA',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS'
}

export class BlockchainError extends Error {
  constructor(public type: BlockchainErrorType, message: string) {
    super(message);
    this.name = 'BlockchainError';
  }
}

class BlockchainService {
  private diplomas: Map<string, RegisteredDiploma> = new Map();
  private accreditedInstitutions: Set<string> = new Set();

  constructor() {
    // Initial mock state
    this.accreditedInstitutions.add('0x71C7656EC7ab88b098defB751B7401B5f6d8976F'.toLowerCase());
  }

  private async simulateInteraction<T>(result: T, delay: number, errorChance: number = 0.15): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate random blockchain errors if requested (15% chance by default)
    if (Math.random() < errorChance) {
      const errors = [
        { type: BlockchainErrorType.TRANSACTION_REJECTED, msg: "Signature rejected by user" },
        { type: BlockchainErrorType.WALLET_NOT_FOUND, msg: "No Web3 wallet detected" },
        { type: BlockchainErrorType.NETWORK_ERROR, msg: "Node connection timeout" },
        { type: BlockchainErrorType.INSUFFICIENT_FUNDS, msg: "Insufficient gas estimation" }
      ];
      const error = errors[Math.floor(Math.random() * errors.length)];
      throw new BlockchainError(error.type, error.msg);
    }
    
    return result;
  }

  async registerDiploma(diploma: RegisteredDiploma): Promise<boolean> {
    const success = !this.diplomas.has(diploma.hash);
    if (success) {
      this.diplomas.set(diploma.hash, diploma);
    }
    return this.simulateInteraction(success, 2000, 0.2); // Higher error chance for mutation
  }

  async verifyDiploma(hash: string): Promise<RegisteredDiploma | null> {
    return this.simulateInteraction(this.diplomas.get(hash) || null, 1500, 0.1);
  }

  async getDiplomaById(id: string): Promise<RegisteredDiploma | null> {
    const found = Array.from(this.diplomas.values()).find(d => d.id === id) || null;
    return this.simulateInteraction(found, 1000, 0.1);
  }

  async isAccredited(address: string): Promise<boolean> {
    return this.simulateInteraction(this.accreditedInstitutions.has(address.toLowerCase()), 500, 0.05);
  }

  async getRecentDiplomas(): Promise<RegisteredDiploma[]> {
    const sorted = Array.from(this.diplomas.values()).sort((a, b) => b.timestamp - a.timestamp);
    return this.simulateInteraction(sorted, 1500, 0.1);
  }

  async getStats(): Promise<{ emitted: number; verified: number; validity: number }> {
    const stats = {
      emitted: this.diplomas.size + 142,
      verified: 38,
      validity: 100
    };
    return this.simulateInteraction(stats, 1200, 0.1);
  }

  async getDiplomasByOwner(fullName: string): Promise<RegisteredDiploma[]> {
    const filtered = Array.from(this.diplomas.values()).filter(d => d.fullName.toLowerCase() === fullName.toLowerCase());
    return this.simulateInteraction(filtered, 1500, 0.1);
  }
}

export const blockchainService = new BlockchainService();
