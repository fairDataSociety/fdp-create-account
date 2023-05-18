export function isPasswordValid(password: string): boolean {
  // TODO check if password contains lowercase and uppercase letters
  return typeof password === "string" && password.length >= 12;
}
