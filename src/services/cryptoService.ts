import { ethers } from 'ethers';

export interface DiplomaData {
  fullName: string;
  specialty: string;
  mention: string;
  year: string;
  institutionId?: string;
}

export class CryptoService {
  /**
   * Generates a SHA-256 hash of the diploma data.
   */
  static hashDiploma(data: DiplomaData): string {
    const payload = JSON.stringify({
      fullName: data.fullName,
      specialty: data.specialty,
      mention: data.mention,
      year: data.year,
    });
    return ethers.id(payload);
  }

  /**
   * Signs a hash using a private key (ECDSA).
   * Note: In a real app, this would be done via a wallet or secure HSM.
   */
  static async signHash(hash: string, privateKey: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.signMessage(ethers.getBytes(hash));
  }

  /**
   * Verifies an ECDSA signature.
   */
  static verifySignature(hash: string, signature: string, expectedAddress: string): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(hash), signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch {
      return false;
    }
  }

  /**
   * Generates a mock private key for simulation.
   */
  static generateMockPrivateKey(): string {
    return ethers.hexlify(ethers.randomBytes(32));
  }
}
