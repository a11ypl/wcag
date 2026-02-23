import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const HASH_PREFIX = 'pbkdf2_sha256';

export function verifyPassword(password: string, encodedHash: string): boolean {
  const parts = encodedHash.split('$');
  if (parts.length !== 4) return false;

  const [prefix, iterationsText, salt, expectedHash] = parts;
  if (prefix !== HASH_PREFIX) return false;

  const iterations = Number(iterationsText);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;

  const actualHash = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');

  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const actualBuffer = Buffer.from(actualHash, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

export function hashPassword(password: string, iterations = 210_000): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
  return `${HASH_PREFIX}$${iterations}$${salt}$${hash}`;
}
