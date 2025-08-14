export type Credentials = { username: string; password: string };

export const isCredentials = (creds: unknown): creds is Credentials => {
  return (
    typeof (creds as Credentials)?.username === "string" &&
    typeof (creds as Credentials)?.password === "string"
  );
};

export const validateCredentials = (creds: Credentials): string | null => {
  const usernameRegex = /^[a-zA-Z0-9_]{8,20}$/;
  if (!usernameRegex.test(creds.username)) {
    return "Username must be between 8 and 20 characters long and contain only letters, numbers, and underscores.";
  }

  const passwordRegex = /^[a-zA-Z0-9_$@!]{8,20}$/;
  if (!passwordRegex.test(creds.password)) {
    return "Password must be between 8 and 20 characters and can only contain letters, number, and the special characters _, $, @, and !.";
  }

  return null;
};
