export async function runSimulation({ skin, life, fragrance }) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Simulate fragrance perception for ${fragrance.name}`
          }
        ]
      })
    })

    const data = await res.json()
    return { rec: "Simulated response (mock or API)" }

  } catch (err) {
    return { rec: "Error in simulation" }
  }
}