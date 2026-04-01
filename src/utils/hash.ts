import bcrypt from "bcryptjs";

export const hashPassword = async (rawPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(rawPassword, salt);
};

export const verifyPassword = async (rawPassword: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(rawPassword, hash);
};
