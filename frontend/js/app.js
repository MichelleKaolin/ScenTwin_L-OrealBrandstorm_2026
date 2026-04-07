import { useState } from "react"
import { FRAGRANCES } from "./data/fragrances"
import { runSimulation } from "./services/api"
import PrimaryButton from "./components/PrimaryButton"
import SelectButton from "./components/SelectButton"
import StepBar from "./components/StepBar"

export default function App() {
  const [step, setStep] = useState(0)
  const [skin, setSkin] = useState({})
  const [life, setLife] = useState({})
  const [fragrance, setFragrance] = useState(null)
  const [sim, setSim] = useState(null)

  async function handleSimulation() {
    const result = await runSimulation({ skin, life, fragrance })
    setSim(result)
    setStep(2)
  }

  if (step === 0) {
    return (
      <div>
        <h1>SCENTWIN™</h1>
        <PrimaryButton label="Start" onClick={() => setStep(1)} />
      </div>
    )
  }

  if (step === 1) {
    return (
      <div>
        <StepBar step={1} />
        {FRAGRANCES.map(f => (
          <div key={f.id} onClick={() => setFragrance(f)}>
            {f.name}
          </div>
        ))}
        <PrimaryButton label="Simulate" onClick={handleSimulation} />
      </div>
    )
  }

  if (step === 2 && sim) {
    return (
      <div>
        <h2>Result</h2>
        <p>{sim.rec}</p>
      </div>
    )
  }

  return null
}