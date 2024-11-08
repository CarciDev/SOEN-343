/**
 * Type guard function that retrieves the value of an environment variable.
 *
 * @param {string} name - Environment variable's name.
 * @returns {string} - Environment variable's value.
 * @throws {Error} If the environment variable is not defined.
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}
