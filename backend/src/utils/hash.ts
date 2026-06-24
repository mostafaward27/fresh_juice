import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_SALTLEN = 16;

/**
 * Hash a password using Node's native scrypt algorithm.
 * Runs asynchronously on the libuv threadpool (non-blocking).
 */
export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SCRYPT_SALTLEN).toString('hex');
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derivedKey.toString('hex')}`);
      }
    );
  });
};

/**
 * Compare a password against a hash (either scrypt or bcrypt format).
 * Returns isMatch and whether the hash is legacy and should be upgraded.
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<{ isMatch: boolean; shouldUpgrade: boolean }> => {
  if (hash.startsWith('scrypt$')) {
    return new Promise((resolve, reject) => {
      const parts = hash.split('$');
      if (parts.length !== 6) {
        resolve({ isMatch: false, shouldUpgrade: false });
        return;
      }

      const N = parseInt(parts[1], 10);
      const r = parseInt(parts[2], 10);
      const p = parseInt(parts[3], 10);
      const salt = parts[4];
      const originalHash = parts[5];

      crypto.scrypt(
        password,
        salt,
        SCRYPT_KEYLEN,
        { N, r, p },
        (err, derivedKey) => {
          if (err) return reject(err);
          const isMatch = derivedKey.toString('hex') === originalHash;
          resolve({ isMatch, shouldUpgrade: false });
        }
      );
    });
  }

  // Fallback to legacy bcryptjs
  const isMatch = await bcrypt.compare(password, hash);
  return { isMatch, shouldUpgrade: isMatch }; // Only upgrade if password is correct
};
