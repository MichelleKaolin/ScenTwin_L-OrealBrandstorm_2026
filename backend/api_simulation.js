export function buildPrompt(skin, life, fragrance) {
  return `
User profile:
Skin: ${JSON.stringify(skin)}
Life: ${JSON.stringify(life)}

Fragrance: ${fragrance.name}
`
}