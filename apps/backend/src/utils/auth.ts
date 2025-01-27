import bcrypt from "bcryptjs"

export const encode = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const encodedPassword = await bcrypt.hash(password, salt)
  return encodedPassword
}

export const confirmPassword = async (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, userPassword)
}
