import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Custo do processamento (10 é o padrão seguro atual)

/**
 * Criptografa uma senha limpa
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara uma senha limpa com o hash do banco
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};