export const passwordRequirementText = "Password must be 8-16 characters and include at least one uppercase letter and one special character.";
export const passwordPattern = "^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$";

export function isStrongPassword(password: string) {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);
}
