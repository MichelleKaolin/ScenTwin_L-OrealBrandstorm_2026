import { useState, useEffect } from "react"

const FRAGRANCES = [
  { id: 1, brand: "Lancôme", name: "Idôle", family: "Floral Aquático", top: "pera, magnólia, bergamota", heart: "rosa centifólia, jasmim, íris", base: "musgo branco, almíscar, cedro", price: "R$ 380", accent: "#7c5cbb" },
  { id: 2, brand: "YSL Beauté", name: "Mon Paris", family: "Floral Frutado", top: "morango, framboesa, toranja", heart: "peônia, rosa branca, datura", base: "musgo branco, patchouli, almíscar", price: "R$ 420", accent: "#b85470" },
  { id: 3, brand: "Lancôme", name: "La Vie Est Belle", family: "Floral Gourmet", top: "groselha preta, pera, íris", heart: "jasmim, pralinê, flor de laranjeira", base: "baunilha, patchouli, tonka", price: "R$ 460", accent: "#b07820" },
  { id: 4, brand: "Armani Beauty", name: "Sì", family: "Chipre Floral", top: "groselha negra, bergamota, neroli", heart: "rosa, freesia, heliotropo", base: "musgo de carvalho, baunilha, patchouli", price: "R$ 390", accent: "#1e6ea8" },
  { id: 5, brand: "Valentino", name: "Born in Roma", family: "Floral Amadeirado", top: "bergamota, mandarina, rosa turca", heart: "jasmim bourbon, ylang ylang, rosa", base: "sândalo, âmbar cinza, vetiver", price: "R$ 440", accent: "#7a6040" },
]

export default function ScentWin() {
  const [step, setStep] = useState(0)
  const [skin, setSkin] = useState({ name: "", type: "", phototype: "", hormonal: "", reactions: "" })
  const [life, setLife] = useState({ climate: "", env: "", occasion: "", timing: "" })
  const [fragrance, setFragrance] = useState(null)
  const [sim, setSim] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [twinProg, setTwinProg] = useState(0)

  useEffect(() => {
    if (step === 3) {
      setTwinProg(0)
      const t = setInterval(() => {
        setTwinProg(p => {
          if (p >= 100) { clearInterval(t); setTimeout(() => setStep(4), 700); return 100 }
          return p + 1.2
        })
      }, 25)
      return () => clearInterval(t)
    }
  }, [step])

  const runSim = async (f) => {
    setLoading(true)
    setStep(5)
    setError(null)
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é o motor preditivo SCENTWIN™ da L'Oréal.

PERFIL CUTÂNEO:
- Tipo: ${skin.type} | Fototipo: ${skin.phototype}
- Fator hormonal: ${skin.hormonal} | Reações: ${skin.reactions}

CONTEXTO DE VIDA OLFATIVO:
- Clima: ${life.climate} | Ambiente: ${life.env}
- Ocasião: ${life.occasion} | Horário: ${life.timing}

FRAGRÂNCIA: ${f.brand} ${f.name} (${f.family})
- Topo: ${f.top}
- Coração: ${f.heart}
- Base: ${f.base}

Simule a evolução desta fragrância nesta pele específica. Responda APENAS JSON válido sem markdown:
{"ph":"faixa ex 5.0-5.5","trait":"característica dominante curta","a1":{"dur":"ex 0–30 min","int":7,"title":"título curto","desc":"2 frases sobre topo nessa pele","chem":"nota química curta"},"a2":{"dur":"ex 30 min–4h","int":8,"title":"título curto","desc":"2 frases coração e sebum","chem":"nota química"},"a3":{"dur":"ex 4h+","int":6,"title":"título curto","desc":"2 frases sobre fixação no microbioma","chem":"nota química"},"compat":85,"total":"ex 8–10h","rec":"2 frases compatibilidade geral","tip":"dica específica de aplicação para esse contexto","scene":"cenário ideal em 1 frase"}`
          }]
        })
      })
      const data = await res.json()
      const txt = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim()
      setSim(JSON.parse(txt))
      setStep(6)
    } catch {
      setError("Erro na simulação.")
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  const S = {
    wrap: { maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem" },
    card: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem", marginBottom: "10px" },
    lbl: { fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 8, display: "block", letterSpacing: "0.5px" },
    sec: { marginBottom: "1.25rem" },
    pgHead: (t, s) => (<div style={{ marginBottom: "1.25rem" }}><div style={{ fontSize: 18, fontWeight: 500 }}>{t}</div><div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{s}</div></div>),
  }

  const SelBtn = ({ label, active, onClick, sub }) => (
    <button onClick={onClick} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", marginBottom: 6, borderRadius: "var(--border-radius-md)", border: active ? "2px solid #2d1b69" : "0.5px solid var(--color-border-secondary)", background: active ? "#2d1b69" : "var(--color-background-primary)", color: active ? "#ede8fc" : "var(--color-text-primary)", fontSize: 14, cursor: "pointer" }}>
      {label}{sub && <span style={{ display: "block", fontSize: 12, color: active ? "#c9bef5" : "var(--color-text-tertiary)", marginTop: 2 }}>{sub}</span>}
    </button>
  )

  const PrimaryBtn = ({ label, disabled, onClick, secondary }) => (
    <button disabled={disabled} onClick={onClick} style={{ width: "100%", padding: 14, borderRadius: "var(--border-radius-md)", border: secondary ? "0.5px solid var(--color-border-secondary)" : "none", background: disabled ? "var(--color-background-secondary)" : secondary ? "var(--color-background-primary)" : "#2d1b69", color: disabled ? "var(--color-text-tertiary)" : secondary ? "var(--color-text-secondary)" : "#ede8fc", fontSize: 15, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", marginTop: 8 }}>
      {label}
    </button>
  )

  const StepBar = () => (
    <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= i ? "#2d1b69" : "var(--color-border-tertiary)" }} />)}
    </div>
  )

  const canSkin = skin.type && skin.phototype && skin.hormonal && skin.reactions
  const canLife = life.climate && life.env && life.occasion && life.timing

  // STEP 0 — Welcome
  if (step === 0) return (
    <div style={{ ...S.wrap, paddingTop: "2.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "var(--color-text-tertiary)", marginBottom: 6 }}>L'ORÉAL BRANDSTORM</div>
        <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: 5, marginBottom: 4 }}>SCENTWIN™</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontStyle: "italic" }}>Predictive Fragrance Intelligence</div>
      </div>
      <div style={{ ...S.card, textAlign: "center" }}>
        <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
          Um perfume não cheira igual para todos.
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.5rem" }}>
          O SCENTWIN™ sabe como ele vai cheirar em você.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["Mapeamento cutâneo", "Gêmeo Olfativo Digital", "Simulação dos 3 atos", "IA preditiva L'Oréal"].map(t => (
            <span key={t} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ ...S.card, background: "var(--color-background-secondary)", border: "none" }}>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
          Em menos de 5 minutos: mapeie sua química de pele, crie seu Gêmeo Olfativo Digital e descubra como qualquer fragrância do portfólio L'Oréal vai evoluir especificamente em você — da nota de abertura à fixação final.
        </div>
      </div>
      <PrimaryBtn label="Iniciar mapeamento →" onClick={() => setStep(1)} />
    </div>
  )

  // STEP 1 — Skin mapping
  if (step === 1) return (
    <div style={S.wrap}>
      <StepBar />
      {S.pgHead("Mapeamento cutâneo", "Motor 01 — Scent Profile")}
      <div style={S.sec}>
        <span style={S.lbl}>COMO POSSO TE CHAMAR?</span>
        <input type="text" placeholder="Seu nome" value={skin.name} onChange={e => setSkin(s => ({...s, name: e.target.value}))} style={{ width: "100%", boxSizing: "border-box" }} />
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>TIPO DE PELE</span>
        {[["Normal", "Equilibrada, sem excessos"], ["Oleosa", "Brilho, poros dilatados, T-zone intensa"], ["Seca", "Descamação, tensão, pouco brilho"], ["Mista", "Oleosa no centro, seca nas laterais"]].map(([t, s]) => (
          <SelBtn key={t} label={t} sub={s} active={skin.type === t} onClick={() => setSkin(sk => ({...sk, type: t}))} />
        ))}
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>FOTOTIPO</span>
        {[["I–II", "Pele muito clara — queima fácil, bronzeia pouco"], ["III–IV", "Pele média — bronzeia moderado"], ["V–VI", "Pele escura — bronzeia com facilidade"]].map(([t, s]) => (
          <SelBtn key={t} label={t} sub={s} active={skin.phototype === t} onClick={() => setSkin(sk => ({...sk, phototype: t}))} />
        ))}
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>FATOR HORMONAL ATUAL</span>
        {["Estável", "Variação hormonal (TPM / ciclo irregular)", "Gestação", "Menopausa / pós-menopausa"].map(t => (
          <SelBtn key={t} label={t} active={skin.hormonal === t} onClick={() => setSkin(sk => ({...sk, hormonal: t}))} />
        ))}
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>COMO FRAGRÂNCIAS COSTUMAM AGIR NA SUA PELE?</span>
        {["Nunca tive reações especiais", "Às vezes some rápido no calor", "Geralmente amplifica muito no meu corpo", "Frequentemente irrita ou perde a abertura rapidamente"].map(t => (
          <SelBtn key={t} label={t} active={skin.reactions === t} onClick={() => setSkin(sk => ({...sk, reactions: t}))} />
        ))}
      </div>
      <PrimaryBtn label="Continuar →" disabled={!canSkin} onClick={() => setStep(2)} />
    </div>
  )

  // STEP 2 — Life profile
  if (step === 2) return (
    <div style={S.wrap}>
      <StepBar />
      {S.pgHead("Perfil de vida olfativo", "Motor 03 — Contexto de uso")}
      <div style={S.sec}>
        <span style={S.lbl}>SEU CLIMA / REGIÃO</span>
        {[["Tropical / Quente e úmido", "Litoral, Nordeste, RJ, SP capital"], ["Temperado", "Sul do Brasil, Sudeste serrano"], ["Árido / Semiárido", "Centro-Oeste, interior do Nordeste"], ["Frio / Inverno rigoroso", "Serra gaúcha, Campos do Jordão"]].map(([t, s]) => (
          <SelBtn key={t} label={t} sub={s} active={life.climate === t} onClick={() => setLife(l => ({...l, climate: t}))} />
        ))}
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>AMBIENTE PRINCIPAL DE USO</span>
        {[["Escritório climatizado", "AC o dia todo, baixa umidade"], ["Ao ar livre / externo", "Parques, ruas, eventos"], ["Ambientes mistos", "Entra e sai o dia todo"], ["Casa / uso pessoal", "Principalmente em casa"]].map(([t, s]) => (
          <SelBtn key={t} label={t} sub={s} active={life.env === t} onClick={() => setLife(l => ({...l, env: t}))} />
        ))}
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>OCASIÃO PRINCIPAL</span>
        {["Trabalho / Profissional", "Social / Encontros e saídas", "Ocasião especial / Noite", "Uso diário casual"].map(t => (
          <SelBtn key={t} label={t} active={life.occasion === t} onClick={() => setLife(l => ({...l, occasion: t}))} />
        ))}
      </div>
      <div style={S.sec}>
        <span style={S.lbl}>HORÁRIO DE APLICAÇÃO</span>
        {["Manhã (antes do trabalho)", "Tarde (após almoço)", "Noite (antes de sair)", "Variado / todos os horários"].map(t => (
          <SelBtn key={t} label={t} active={life.timing === t} onClick={() => setLife(l => ({...l, timing: t}))} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <PrimaryBtn label="← Voltar" secondary onClick={() => setStep(1)} />
        <PrimaryBtn label="Criar Gêmeo Olfativo →" disabled={!canLife} onClick={() => setStep(3)} />
      </div>
    </div>
  )

  // STEP 3 — Twin building
  if (step === 3) return (
    <div style={{ ...S.wrap, paddingTop: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "var(--color-text-tertiary)", marginBottom: 8 }}>SCENTWIN™</div>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>Criando seu Gêmeo Olfativo</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          {twinProg < 30 ? "Analisando perfil cutâneo..." : twinProg < 55 ? "Mapeando parâmetros químicos..." : twinProg < 78 ? "Calibrando modelos preditivos..." : twinProg < 95 ? "Construindo seu ScentTwin™..." : "Pronto!"}
        </div>
      </div>
      <div style={{ height: 4, background: "var(--color-background-secondary)", borderRadius: 2, overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ width: `${twinProg}%`, height: "100%", background: "#2d1b69", borderRadius: 2, transition: "width 0.08s linear" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          { label: "pH estimado", val: skin.type === "Oleosa" ? "4.8 – 5.3" : skin.type === "Seca" ? "5.5 – 6.2" : "5.0 – 5.8", at: 20 },
          { label: "Nível de sebum", val: skin.type === "Oleosa" ? "Alto" : skin.type === "Seca" ? "Baixo" : "Moderado", at: 38 },
          { label: "Fototipo registrado", val: skin.phototype, at: 54 },
          { label: "Temperatura corpórea rel.", val: skin.phototype?.startsWith("V") ? "Levemente elevada" : "Padrão", at: 68 },
          { label: "Contexto ambiental", val: life.climate, at: 82 },
          { label: "Identidade ScentTwin™", val: `${skin.name || "Usuário"}'s Digital Twin`, at: 94 },
        ].map(({ label, val, at }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-secondary)", fontSize: 13, opacity: twinProg >= at ? 1 : 0.25, transition: "opacity 0.5s" }}>
            <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{twinProg >= at ? val : "···"}</span>
          </div>
        ))}
      </div>
    </div>
  )

  // STEP 4 — Fragrance selection
  if (step === 4) return (
    <div style={S.wrap}>
      <StepBar />
      {S.pgHead("Escolha uma fragrância", `Portfólio L'Oréal Groupe — simulando para ${skin.name || "você"}`)}
      {error && <div style={{ fontSize: 14, color: "var(--color-text-danger)", marginBottom: "1rem", padding: "10px 14px", background: "var(--color-background-danger)", borderRadius: "var(--border-radius-md)" }}>{error} Escolha novamente.</div>}
      {FRAGRANCES.map(f => (
        <div key={f.id} onClick={() => setFragrance(f)} style={{ ...S.card, cursor: "pointer", border: fragrance?.id === f.id ? `2px solid ${f.accent}` : "0.5px solid var(--color-border-tertiary)", transition: "border 0.15s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1, color: "var(--color-text-secondary)", marginBottom: 2 }}>{f.brand.toUpperCase()}</div>
              <div style={{ fontSize: 17, fontWeight: 500 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{f.family}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{f.price}</div>
              {fragrance?.id === f.id && <div style={{ fontSize: 11, marginTop: 4, color: f.accent }}>● selecionada</div>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["Topo", f.top.split(",")[0].trim()], ["Coração", f.heart.split(",")[0].trim()], ["Base", f.base.split(",")[0].trim()]].map(([k, v]) => (
              <span key={k} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>{k}: {v}</span>
            ))}
          </div>
        </div>
      ))}
      <PrimaryBtn label="Simular em minha pele →" disabled={!fragrance} onClick={() => runSim(fragrance)} />
    </div>
  )

  // STEP 5 — Simulation loading
  if (step === 5) return (
    <div style={{ ...S.wrap, paddingTop: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "var(--color-text-tertiary)", marginBottom: "2rem" }}>SCENTWIN™ · MOTOR 02</div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>Simulando evolução olfativa</div>
      <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        {fragrance?.brand} {fragrance?.name} na sua química de pele...
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
        {["Analisando volatilidade das notas de topo no seu pH...", "Modelando interação entre coração e nível de sebum...", "Simulando fusão da base com seu microbioma cutâneo...", "Calculando compatibilidade e duração total...", "Gerando recomendações personalizadas..."].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--color-text-secondary)", padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2d1b69", flexShrink: 0, opacity: loading ? 0.9 : 0.3 }} />
            {t}
          </div>
        ))}
      </div>
    </div>
  )

  // STEP 6 — Results
  if (step === 6 && sim) {
    const compat = Number(sim.compat) || 0
    const compatVar = compat >= 80 ? "var(--color-text-success)" : compat >= 60 ? "var(--color-text-warning)" : "var(--color-text-danger)"
    const compatBg = compat >= 80 ? "var(--color-background-success)" : compat >= 60 ? "var(--color-background-warning)" : "var(--color-background-danger)"
    const actColors = ["var(--color-text-warning)", "var(--color-text-info)", "var(--color-text-success)"]
    const actBgs = ["var(--color-background-warning)", "var(--color-background-info)", "var(--color-background-success)"]

    const Bar = ({ val, bg }) => (
      <div style={{ height: 6, background: "var(--color-border-tertiary)", borderRadius: 3, overflow: "hidden", marginTop: 8 }}>
        <div style={{ width: `${((val || 0) / 10) * 100}%`, height: "100%", background: bg, borderRadius: 3 }} />
      </div>
    )

    return (
      <div style={S.wrap}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "var(--color-text-tertiary)", marginBottom: 4 }}>SCENTWIN™</div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Simulação completa</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{fragrance?.brand} {fragrance?.name} × {skin.name || "Seu perfil"}</div>
        </div>

        {/* Compat card */}
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--color-text-secondary)", marginBottom: 4 }}>COMPATIBILIDADE GERAL</div>
          <div style={{ fontSize: 52, fontWeight: 500, color: compatVar, lineHeight: 1.1 }}>{compat}%</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 6 }}>
            pH estimado: {sim.ph} · {sim.trait}
          </div>
          <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 3, overflow: "hidden", marginTop: 12 }}>
            <div style={{ width: `${compat}%`, height: "100%", background: compatVar, borderRadius: 3 }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 13, padding: "8px 12px", background: compatBg, borderRadius: "var(--border-radius-md)", color: compatVar, lineHeight: 1.6 }}>{sim.rec}</div>
        </div>

        {/* 3-Act evolution */}
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: 2, margin: "1.25rem 0 8px" }}>EVOLUÇÃO EM 3 ATOS</div>
        {[
          { key: "a1", label: "Ato 1 — Notas de Topo" },
          { key: "a2", label: "Ato 2 — Notas de Coração" },
          { key: "a3", label: "Ato 3 — Fixação de Fundo" },
        ].map(({ key, label }, idx) => (
          <div key={key} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{sim[key]?.title}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{sim[key]?.dur}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: actColors[idx] }}>Int. {sim[key]?.int}/10</div>
              </div>
            </div>
            <Bar val={sim[key]?.int} bg={actBgs[idx]} />
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 10, lineHeight: 1.7 }}>{sim[key]?.desc}</div>
            <div style={{ fontSize: 12, color: actColors[idx], marginTop: 6, fontStyle: "italic" }}>{sim[key]?.chem}</div>
          </div>
        ))}

        {/* Details */}
        <div style={{ ...S.card, background: "var(--color-background-secondary)", border: "none" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, color: "var(--color-text-secondary)", marginBottom: 4 }}>DURAÇÃO ESTIMADA</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{sim.total}</div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, color: "var(--color-text-secondary)", marginBottom: 4 }}>DICA DE APLICAÇÃO</div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{sim.tip}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, color: "var(--color-text-secondary)", marginBottom: 4 }}>CENÁRIO IDEAL</div>
            <div style={{ fontSize: 14, color: "var(--color-text-secondary)", fontStyle: "italic", lineHeight: 1.7 }}>{sim.scene}</div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>
          {fragrance?.brand} {fragrance?.name} · {fragrance?.price}
        </div>
        <PrimaryBtn label="Simular outra fragrância →" onClick={() => { setSim(null); setFragrance(null); setError(null); setStep(4) }} />
        <PrimaryBtn label="Recomeçar do início" secondary onClick={() => { setSim(null); setFragrance(null); setError(null); setSkin({ name: "", type: "", phototype: "", hormonal: "", reactions: "" }); setLife({ climate: "", env: "", occasion: "", timing: "" }); setStep(0) }} />
      </div>
    )
  }

  return <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-secondary)" }}>Carregando...</div>
}