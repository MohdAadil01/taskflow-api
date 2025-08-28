import bcrypt from "bcrypt";

const saltRounds = process.env.SALT_ROUNDS;

export const hashPassword = async (password: string) => {
  let hashPassword;
  await bcrypt.hash(password, saltRounds || 5, (err, hash) => {
    hashPassword = hash;
  });
  return hashPassword;
};

export const comparePassword = (candidate: string, hashed: string) => {
  return bcrypt.compare(candidate, hashed);
};
