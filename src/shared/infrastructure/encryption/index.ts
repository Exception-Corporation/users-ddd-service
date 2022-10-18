import { BcrypEncryption } from '@/shared/infrastructure/encryption/bcrypt.encryption';

export const EncryptionService = BcrypEncryption.getInstance();
