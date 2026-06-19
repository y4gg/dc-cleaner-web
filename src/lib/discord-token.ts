export function normalizeDiscordToken(token: string) {
  return token.trim().replace(/^['"`]+|['"`]+$/g, "").trim();
}
