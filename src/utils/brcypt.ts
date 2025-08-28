import bcrypt from "bcrypt";

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const comparePassword = async (
  candidate: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(candidate, hashed);
};
