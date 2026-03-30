import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, ReferenceLine, LabelList, AreaChart, Area } from "recharts";

const C = {
  coral: "#FF6B6B",
  rose: "#FDA4AF",
  amber: "#FBBF24",
  green: "#34D399",
  teal: "#2DD4BF",
  blue: "#60A5FA",
  purple: "#A78BFA",
  orange: "#FB923C",
  pink: "#F472B6",
  cyan: "#22D3EE",
  white: "#F8FAFC",
  lightSlate: "#94A3B8",
  bg: "#0F172A",
  card: "#1E293B",
  border: "#334155",
  nuclear: "#A78BFA",
  solar: "#FBBF24",
  wind: "#22D3EE",
  gas: "#FB923C",
  hydro: "#60A5FA",
  battery: "#34D399",
  geo: "#F472B6",
};

// --- DATA ---
const electricityRates = [
  { state: "Hawaii", rate: 41.62, fill: C.coral },
  { state: "California", rate: 33.75, fill: C.coral },
  { state: "Massachusetts", rate: 31.51, fill: C.orange },
  { state: "Rhode Island", rate: 31.30, fill: C.orange },
  { state: "Connecticut", rate: 28.50, fill: C.amber },
  { state: "Alaska", rate: 26.57, fill: C.amber },
  { state: "US Average", rate: 18.05, fill: C.blue },
  { state: "Texas", rate: 16.18, fill: C.green },
  { state: "Idaho", rate: 11.50, fill: C.green },
  { state: "Louisiana", rate: 12.44, fill: C.teal },
  { state: "N. Dakota", rate: 11.02, fill: C.teal },
];

const billComparison = [
  { state: "California", bill: 170, kwh: 491, rate: 34.71 },
  { state: "US Average", bill: 155, kwh: 899, rate: 17.24 },
  { state: "Texas", bill: 174, kwh: 1096, rate: 15.87 },
  { state: "Louisiana", bill: 130, kwh: 1045, rate: 12.44 },
];

const genMix = [
  { source: "Solar", pct: 29.4, color: C.solar },
  { source: "Natural Gas", pct: 25.8, color: C.gas },
  { source: "Imports", pct: 19.0, color: C.lightSlate },
  { source: "Wind", pct: 7.5, color: C.wind },
  { source: "Nuclear", pct: 8.6, color: C.nuclear },
  { source: "Hydro", pct: 5.2, color: C.hydro },
  { source: "Geothermal", pct: 3.0, color: C.geo },
  { source: "Other", pct: 1.5, color: C.border },
];

const solarGrowth = [
  { year: "2020", solar: 22.0, gas: 55.5, battery: 0.5 },
  { year: "2021", solar: 26.3, gas: 58.2, battery: 1.2 },
  { year: "2022", solar: 29.1, gas: 53.8, battery: 2.8 },
  { year: "2023", solar: 32.5, gas: 50.1, battery: 5.5 },
  { year: "2024", solar: 34.4, gas: 49.0, battery: 10.2 },
  { year: "2025", solar: 40.3, gas: 45.5, battery: 15.5 },
];

const rateHistory = [
  { year: "2019", ca: 19.2, us: 13.0, tx: 11.8 },
  { year: "2020", ca: 20.5, us: 13.2, tx: 11.4 },
  { year: "2021", ca: 22.8, us: 13.7, tx: 12.2 },
  { year: "2022", ca: 25.8, us: 14.9, tx: 13.8 },
  { year: "2023", ca: 28.4, us: 15.9, tx: 14.3 },
  { year: "2024", ca: 30.6, us: 16.5, tx: 15.1 },
  { year: "2025", ca: 31.1, us: 17.1, tx: 15.9 },
  { year: "2026", ca: 33.8, us: 18.1, tx: 16.2 },
];

const nuclearTimeline = [
  { name: "Rancho Seco", status: "Closed 1989", capacity: "913 MW", reason: "Voter referendum" },
  { name: "San Onofre 1", status: "Closed 1992", capacity: "436 MW", reason: "Economic / age" },
  { name: "San Onofre 2 & 3", status: "Closed 2013", capacity: "2,150 MW", reason: "Steam generator failure" },
  { name: "Humboldt Bay", status: "Closed 1976", capacity: "63 MW", reason: "Seismic concerns" },
  { name: "Diablo Canyon", status: "Operating — extended to 2030+", capacity: "2,240 MW", reason: "Seeking 20-yr NRC renewal to 2045" },
];

const costDrivers = [
  { driver: "Wildfire Mitigation", amount: "~$5.5B/yr", pct: 30, color: C.coral },
  { driver: "Grid Hardening / Undergrounding", amount: "~$3.2B/yr", pct: 18, color: C.orange },
  { driver: "Renewable Mandates (RPS/SB100)", amount: "~$2.8B/yr", pct: 15, color: C.solar },
  { driver: "Natural Gas Import Premium", amount: "~$2.1B/yr", pct: 12, color: C.gas },
  { driver: "PG&E Bankruptcy Recovery", amount: "~$1.8B/yr", pct: 10, color: C.amber },
  { driver: "Distributed Solar Subsidies (NEM)", amount: "~$1.5B/yr", pct: 8, color: C.purple },
  { driver: "Regulatory / Administrative", amount: "~$1.2B/yr", pct: 7, color: C.lightSlate },
];

const duckCurve = [
  { hour: "12am", solar: 0, wind: 3.5, gas: 8.0, hydro: 2.5, nuclear: 2.2, demand: 22, battery: 0 },
  { hour: "3am", solar: 0, wind: 4.0, gas: 6.0, hydro: 2.0, nuclear: 2.2, demand: 20, battery: 0 },
  { hour: "6am", solar: 0.5, wind: 3.0, gas: 7.0, hydro: 2.5, nuclear: 2.2, demand: 23, battery: 0 },
  { hour: "9am", solar: 10.0, wind: 2.5, gas: 4.0, hydro: 2.5, nuclear: 2.2, demand: 26, battery: -2 },
  { hour: "12pm", solar: 18.8, wind: 2.0, gas: 1.5, hydro: 2.0, nuclear: 2.2, demand: 28, battery: -5 },
  { hour: "3pm", solar: 15.0, wind: 2.5, gas: 2.0, hydro: 2.5, nuclear: 2.2, demand: 30, battery: -3 },
  { hour: "6pm", solar: 4.0, wind: 3.5, gas: 12.0, hydro: 3.5, nuclear: 2.2, demand: 33, battery: 4 },
  { hour: "8pm", solar: 0, wind: 4.0, gas: 14.0, hydro: 3.0, nuclear: 2.2, demand: 31, battery: 5 },
  { hour: "10pm", solar: 0, wind: 4.5, gas: 10.0, hydro: 2.5, nuclear: 2.2, demand: 26, battery: 2 },
];

// --- COMPONENTS ---
const Section = ({ title, subtitle, children }) => (
  <div style={{ marginBottom: 44 }}>
    <h2 style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 24,
      fontWeight: 700,
      color: C.white,
      marginBottom: 4,
      borderLeft: `4px solid ${C.amber}`,
      paddingLeft: 16,
    }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 13, color: C.lightSlate, marginTop: 4, marginBottom: 18, paddingLeft: 20 }}>{subtitle}</p>}
    {children}
  </div>
);

const Stat = ({ label, value, sub, color = C.coral }) => (
  <div style={{
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "14px 18px",
    flex: "1 1 140px",
    minWidth: 140,
  }}>
    <div style={{ fontSize: 11, color: C.lightSlate, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: C.lightSlate, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Tip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: "#0F172AEE", border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: C.white, fontWeight: 600, marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill, marginTop: 1 }}>
          {p.name}: {typeof p.value === "number" ? (p.value < 1 ? p.value.toFixed(1) : p.value.toFixed(p.value > 50 ? 0 : 1)) : p.value}
        </div>
      ))}
    </div>
  );
};

const CalloutBox = ({ children, color = C.amber }) => (
  <div style={{
    marginTop: 14,
    padding: "12px 16px",
    background: `${color}15`,
    border: `1px solid ${color}55`,
    borderRadius: 6,
    fontSize: 13,
    color: C.white,
    lineHeight: 1.6,
  }}>
    {children}
  </div>
);

const tabs = [
  { id: "rates", label: "Electricity Rates" },
  { id: "mix", label: "Generation Mix" },
  { id: "duck", label: "The Duck Curve" },
  { id: "nuclear", label: "Nuclear Saga" },
  { id: "costs", label: "Why So Expensive?" },
  { id: "pattern", label: "The Pattern" },
];

export default function CAEnergyDashboard() {
  const [tab, setTab] = useState("rates");

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #78350F 0%, #1E293B 60%)",
        padding: "30px 24px 22px",
        borderBottom: `2px solid ${C.amber}`,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: C.amber, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8, fontWeight: 600 }}>
            Policy Analysis — March 2026
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 32,
            fontWeight: 900,
            color: C.white,
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            California's Electricity Crisis
          </h1>
          <p style={{ fontSize: 14, color: "#CBD5E1", maxWidth: 600, lineHeight: 1.5 }}>
            Double the price, half the usage. How the Golden State built the most expensive 
            electricity market in the continental US — and the policy contradictions driving it.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 24px", overflowX: "auto", whiteSpace: "nowrap" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: "none", border: "none",
              borderBottom: tab === t.id ? `3px solid ${C.amber}` : "3px solid transparent",
              color: tab === t.id ? C.white : C.lightSlate,
              fontSize: 13,
              fontWeight: tab === t.id ? 700 : 400,
              padding: "12px 14px",
              cursor: "pointer",
              fontFamily: "'Source Sans 3', sans-serif",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "26px 24px" }}>

        {/* RATES */}
        {tab === "rates" && (<>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
            <Stat label="CA Residential" value="33.8¢" sub="Per kWh, March 2026" color={C.coral} />
            <Stat label="US Average" value="18.1¢" sub="Per kWh" color={C.blue} />
            <Stat label="CA Premium" value="+87%" sub="Above national avg" color={C.amber} />
            <Stat label="CA Monthly Bill" value="$170" sub="Using only 491 kWh" color={C.orange} />
          </div>

          <Section title="Residential Electricity Rates by State" subtitle="Cents per kWh, March 2026 (EIA data)">
            <div style={{ background: C.card, borderRadius: 8, padding: "18px 10px", border: `1px solid ${C.border}` }}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={electricityRates} margin={{ left: 0, right: 25, top: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="state" tick={{ fill: C.lightSlate, fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: C.lightSlate, fontSize: 11 }} tickFormatter={v => `${v}¢`} domain={[0, 45]} />
                  <Tooltip content={<Tip />} />
                  <ReferenceLine y={18.05} stroke={C.blue} strokeDasharray="5 5" label={{ value: "US Avg", fill: C.blue, fontSize: 10 }} />
                  <Bar dataKey="rate" name="Rate (¢/kWh)" radius={[4, 4, 0, 0]} barSize={36}>
                    {electricityRates.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    <LabelList dataKey="rate" position="top" fill={C.white} fontSize={11} formatter={v => `${v}¢`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="The Paradox: Use Less, Pay More" subtitle="California households use ~45% less electricity than the national average but pay higher bills">
            <div style={{ background: C.card, borderRadius: 8, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {billComparison.map((b, i) => (
                  <div key={i} style={{
                    flex: "1 1 180px",
                    background: C.bg,
                    borderRadius: 8,
                    padding: 16,
                    textAlign: "center",
                    borderTop: `3px solid ${i === 0 ? C.coral : i === 1 ? C.blue : C.green}`,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 8 }}>{b.state}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: C.amber, fontFamily: "'Playfair Display', serif" }}>${b.bill}</div>
                    <div style={{ fontSize: 11, color: C.lightSlate, marginTop: 4 }}>Monthly bill</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: C.white, marginTop: 8 }}>{b.kwh} kWh</div>
                    <div style={{ fontSize: 11, color: C.lightSlate }}>Monthly usage</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? C.coral : C.green, marginTop: 8 }}>{b.rate}¢/kWh</div>
                  </div>
                ))}
              </div>
              <CalloutBox>
                <strong>Key insight:</strong> Texas households use <strong>2.2x more electricity</strong> than California households 
                and pay essentially the same monthly bill ($174 vs $170). The difference is pure rate premium — Californians 
                are paying for policy costs, not energy consumption.
              </CalloutBox>
            </div>
          </Section>

          <Section title="Rate Trajectory: The Divergence" subtitle="Residential electricity rates 2019–2026 (¢/kWh)">
            <div style={{ background: C.card, borderRadius: 8, padding: "18px 10px", border: `1px solid ${C.border}` }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rateHistory} margin={{ left: 0, right: 20, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" tick={{ fill: C.lightSlate, fontSize: 12 }} />
                  <YAxis tick={{ fill: C.lightSlate, fontSize: 11 }} tickFormatter={v => `${v}¢`} domain={[8, 38]} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="ca" name="California" stroke={C.coral} strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="us" name="US Average" stroke={C.blue} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="tx" name="Texas" stroke={C.green} strokeWidth={2} dot={{ r: 3 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </LineChart>
              </ResponsiveContainer>
              <CalloutBox color={C.coral}>
                California's rates have grown <strong>76% since 2019</strong> — nearly double the growth rate of the national average (39%) 
                and triple that of Texas (37%). The gap is accelerating, not closing.
              </CalloutBox>
            </div>
          </Section>
        </>)}

        {/* GENERATION MIX */}
        {tab === "mix" && (<>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
            <Stat label="Low-Carbon" value="55%" sub="Of generation" color={C.green} />
            <Stat label="Solar" value="29.4%" sub="Largest single source" color={C.solar} />
            <Stat label="Natural Gas" value="25.8%" sub="Still essential" color={C.gas} />
            <Stat label="Imports" value="19%" sub="From other states" color={C.lightSlate} />
          </div>

          <Section title="California's Electricity Generation Mix" subtitle="Share by source, 2024–2025 data (CAISO region)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
              <div style={{ flex: "1 1 300px", background: C.card, borderRadius: 8, padding: 18, border: `1px solid ${C.border}` }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={genMix} dataKey="pct" nameKey="source" cx="50%" cy="50%" outerRadius={110} innerRadius={55} paddingAngle={2}
                      label={({ source, pct }) => `${source} ${pct}%`} labelLine={{ stroke: C.lightSlate }}>
                      {genMix.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: "1 1 280px" }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 18 }}>
                  <h3 style={{ fontSize: 16, color: C.amber, marginBottom: 10, fontFamily: "'Playfair Display', serif" }}>Credit Where It's Due</h3>
                  <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6, marginBottom: 10 }}>
                    California has made <strong style={{ color: C.green }}>genuine progress</strong> on solar. Utility-scale solar generation 
                    nearly doubled from 2020 to 2025, reaching 40.3 billion kWh.
                  </p>
                  <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6, marginBottom: 10 }}>
                    But 19% of electricity is <strong style={{ color: C.coral }}>imported from other states</strong> — 
                    much of it generated by the same fossil fuels California regulates against domestically.
                  </p>
                  <p style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>
                    And natural gas still provides <strong style={{ color: C.gas }}>~26% of generation</strong> — 
                    it's the indispensable backup when the sun goes down and the wind stops.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Solar Rising, Gas Falling" subtitle="Jan–Aug generation in billion kWh, California (2020–2025)">
            <div style={{ background: C.card, borderRadius: 8, padding: "18px 10px", border: `1px solid ${C.border}` }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={solarGrowth} margin={{ left: 0, right: 20, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: C.lightSlate, fontSize: 12 }} />
                  <YAxis tick={{ fill: C.lightSlate, fontSize: 11 }} label={{ value: "Billion kWh", angle: -90, position: "insideLeft", fill: C.lightSlate, fontSize: 11 }} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="solar" name="Solar" fill={C.solar} radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="gas" name="Natural Gas" fill={C.gas} radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="battery" name="Battery Storage" fill={C.battery} radius={[4, 4, 0, 0]} barSize={20} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
              <CalloutBox color={C.green}>
                Battery storage output grew <strong>30x from 2020 to 2025</strong> — from 0.5 to 15.5 billion kWh. 
                This is essential for smoothing solar's daily cycle, but it comes at significant capital cost 
                that gets passed to ratepayers.
              </CalloutBox>
            </div>
          </Section>
        </>)}

        {/* DUCK CURVE */}
        {tab === "duck" && (<>
          <Section title="The Duck Curve: Solar's Structural Problem" subtitle="Typical spring day generation profile (GW) — CAISO region">
            <div style={{ background: C.card, borderRadius: 8, padding: "18px 10px", border: `1px solid ${C.border}` }}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={duckCurve} margin={{ left: 0, right: 20, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" tick={{ fill: C.lightSlate, fontSize: 11 }} />
                  <YAxis tick={{ fill: C.lightSlate, fontSize: 11 }} label={{ value: "GW", angle: -90, position: "insideLeft", fill: C.lightSlate, fontSize: 11 }} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="solar" stackId="1" fill={C.solar} stroke={C.solar} fillOpacity={0.7} name="Solar" />
                  <Area type="monotone" dataKey="wind" stackId="1" fill={C.wind} stroke={C.wind} fillOpacity={0.5} name="Wind" />
                  <Area type="monotone" dataKey="nuclear" stackId="1" fill={C.nuclear} stroke={C.nuclear} fillOpacity={0.6} name="Nuclear" />
                  <Area type="monotone" dataKey="hydro" stackId="1" fill={C.hydro} stroke={C.hydro} fillOpacity={0.5} name="Hydro" />
                  <Area type="monotone" dataKey="gas" stackId="1" fill={C.gas} stroke={C.gas} fillOpacity={0.6} name="Natural Gas" />
                  <Line type="monotone" dataKey="demand" stroke={C.white} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Demand" />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="What the Duck Curve Means">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {[
                { time: "Midday (10am–3pm)", title: "Solar Flood", desc: "Solar produces far more than needed. Excess is curtailed (wasted) or stored in batteries. Wholesale prices sometimes go negative — generators pay the grid to take their power.", color: C.solar, icon: "☀️" },
                { time: "Evening (5pm–9pm)", title: "The Ramp", desc: "Solar drops to zero in ~2 hours. Gas plants must ramp up 12+ GW in the steepest generation climb on any US grid. This is the most expensive electricity of the day.", color: C.gas, icon: "🌙" },
                { time: "Night (9pm–6am)", title: "Gas Dependent", desc: "With no solar and limited wind, natural gas provides the backbone of nighttime power. Batteries help for 2-4 hours but can't carry the full night load.", color: C.coral, icon: "🔥" },
                { time: "Cloudy/Smoky Days", title: "The Vulnerability", desc: "Wildfire smoke or overcast weather can cut solar output 50-80%. During these events, gas and imports surge — and so do prices. Multi-day events strain the grid.", color: C.purple, icon: "🌫️" },
              ].map((c, i) => (
                <div key={i} style={{
                  flex: "1 1 200px",
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: 16,
                  borderTop: `3px solid ${c.color}`,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
                  <div style={{ fontSize: 11, color: C.lightSlate, marginBottom: 2 }}>{c.time}</div>
                  <h4 style={{ fontSize: 14, color: c.color, marginBottom: 6, fontWeight: 700 }}>{c.title}</h4>
                  <p style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <CalloutBox color={C.gas}>
              <strong>The irony:</strong> California has the most solar capacity in the nation but can't use it when people 
              need electricity most — in the evening. The state needs gas plants to sit idle all day, then sprint 
              for 4–5 hours. Those plants still cost money to maintain, and that cost is spread across every kWh you use.
            </CalloutBox>
          </Section>
        </>)}

        {/* NUCLEAR */}
        {tab === "nuclear" && (<>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 26 }}>
            <Stat label="Plants Closed" value="4" sub="Since 1976" color={C.coral} />
            <Stat label="Remaining" value="1" sub="Diablo Canyon" color={C.nuclear} />
            <Stat label="Output" value="18 TWh" sub="8.6% of CA generation" color={C.amber} />
            <Stat label="Potential Savings" value="$21B" sub="If run to 2045 (MIT/Stanford)" color={C.green} />
          </div>

          <Section title="California's Nuclear History: A Story of Self-Sabotage" subtitle="Every closed plant was zero-carbon. Every closure increased fossil fuel dependence.">
            <div style={{ background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              {nuclearTimeline.map((n, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 20px",
                  borderBottom: i < nuclearTimeline.length - 1 ? `1px solid ${C.border}` : "none",
                  background: i === nuclearTimeline.length - 1 ? `${C.nuclear}15` : "transparent",
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: i === nuclearTimeline.length - 1 ? C.green : C.coral,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: C.white }}>{n.name}</span>
                      <span style={{ fontSize: 12, color: i === nuclearTimeline.length - 1 ? C.green : C.coral, fontWeight: 600 }}>{n.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 12, color: C.lightSlate }}>{n.capacity}</span>
                      <span style={{ fontSize: 12, color: C.lightSlate, fontStyle: "italic" }}>{n.reason}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="The Diablo Canyon Paradox">
            <div style={{ background: C.card, borderRadius: 8, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
                {[
                  { label: "2016–2018", desc: "CA agrees to close Diablo Canyon by 2025. Environmentalists celebrate.", color: C.coral, icon: "❌" },
                  { label: "2021", desc: "MIT/Stanford study: keeping it open saves $21B and cuts emissions 11%/yr. Oops.", color: C.amber, icon: "📊" },
                  { label: "2022", desc: "Newsom reverses, signs SB 846 to extend through 2030. $1.4B state loan + $1.1B DOE grant.", color: C.green, icon: "↩️" },
                  { label: "2026", desc: "PG&E seeks 20-year NRC license to 2045. State legislators still fighting. Extension legislation must pass this year.", color: C.nuclear, icon: "⚡" },
                ].map((step, i) => (
                  <div key={i} style={{
                    flex: "1 1 180px",
                    background: C.bg,
                    borderRadius: 8,
                    padding: 14,
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{step.icon}</div>
                    <div style={{ fontSize: 12, color: step.color, fontWeight: 700, marginBottom: 4 }}>{step.label}</div>
                    <p style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.4 }}>{step.desc}</p>
                  </div>
                ))}
              </div>
              <CalloutBox color={C.nuclear}>
                <strong>The bottom line:</strong> California spent years trying to close its single largest source of 
                carbon-free electricity (23% of clean power), then reversed course when the grid couldn't handle the loss. 
                The state is now spending billions in ratepayer money and federal loans to keep open a plant it already agreed 
                to close — while simultaneously mandating 100% clean electricity by 2045. The operational cost of Diablo Canyon 
                is as low as <strong>$21/MWh</strong> — cheaper than any new-build alternative. The politically imposed fees push 
                it to $75–111/MWh.
              </CalloutBox>
            </div>
          </Section>
        </>)}

        {/* COSTS */}
        {tab === "costs" && (<>
          <Section title="What's Driving California's Electricity Costs?" subtitle="Major cost categories flowing through to ratepayers (estimated annual, all IOUs)">
            <div style={{ background: C.card, borderRadius: 8, padding: 20, border: `1px solid ${C.border}` }}>
              {costDrivers.map((d, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                    <span style={{ color: C.white }}>{d.driver}</span>
                    <span style={{ color: d.color, fontWeight: 700 }}>{d.amount}</span>
                  </div>
                  <div style={{ background: C.bg, borderRadius: 4, height: 18, overflow: "hidden" }}>
                    <div style={{
                      width: `${d.pct * 3.3}%`,
                      height: "100%",
                      background: `${d.color}CC`,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: 6,
                    }}>
                      <span style={{ fontSize: 10, color: C.white, fontWeight: 600 }}>{d.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <CalloutBox color={C.coral}>
                <strong>Wildfire costs dominate.</strong> After the Camp Fire (Paradise, 2018), PG&E went bankrupt. 
                The utility is now spending billions on undergrounding power lines, vegetation management, and liability reserves 
                — all passed to ratepayers. This is the largest single driver of California's electricity cost premium, 
                and it has nothing to do with energy generation.
              </CalloutBox>
            </div>
          </Section>

          <Section title="The Regressive Burden">
            <div style={{ background: C.card, borderRadius: 8, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {[
                  { title: "Rooftop Solar Subsidy Shift", desc: "Under legacy net metering (NEM), solar homeowners exported power at retail rates. Non-solar ratepayers subsidized this — overwhelmingly benefiting wealthy homeowners. NEM 3.0 reduced this but the legacy costs persist.", color: C.solar },
                  { title: "Income-Based Fixed Charges", desc: "New CPUC rules impose fixed monthly charges of $6–$128 based on income. The concept: shift costs from per-kWh to fixed. The reality: another layer of complexity on already-confused bills.", color: C.purple },
                  { title: "EV Mandate Costs", desc: "Grid upgrades for EV charging infrastructure are being paid by all ratepayers — including those who can't afford EVs. Transformer and distribution upgrades run into the billions.", color: C.blue },
                  { title: "Central Valley Impact", desc: "Inland CA has extreme heat, long commutes, no public transit, and median incomes half of coastal cities. These households are hit hardest by both high gas prices and high electricity prices.", color: C.coral },
                ].map((c, i) => (
                  <div key={i} style={{
                    flex: "1 1 200px",
                    background: C.bg,
                    borderRadius: 8,
                    padding: 16,
                    borderLeft: `3px solid ${c.color}`,
                  }}>
                    <h4 style={{ fontSize: 14, color: c.color, marginBottom: 6, fontWeight: 700 }}>{c.title}</h4>
                    <p style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.5 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </>)}

        {/* THE PATTERN */}
        {tab === "pattern" && (<>
          <Section title="The California Energy Policy Pattern" subtitle="The same playbook across gasoline and electricity">
            <div style={{ background: C.card, borderRadius: 8, padding: 20, border: `1px solid ${C.border}` }}>
              {[
                { step: "1", action: "Impose strictest regulations in the country", gas: "CARBOB blend, LCFS, cap-and-trade", elec: "RPS mandates, SB100 (100% clean by 2045), wildfire hardening", color: C.coral },
                { step: "2", action: "Drive out domestic production", gas: "Refineries close (42 → 11 since 1980s)", elec: "Nuclear plants close (5 → 1), gas plant opposition", color: C.orange },
                { step: "3", action: "Become import-dependent", gas: "Gasoline from India, S. Korea, Bahamas", elec: "19% of electricity imported from other states", color: C.amber },
                { step: "4", action: "Pay the highest prices in the continental US", gas: "$5.90/gal (vs $3.10 in TX)", elec: "33.8¢/kWh (vs 16.2¢ in TX)", color: C.solar },
                { step: "5", action: "Claim environmental victory", gas: "Export refinery emissions to Asia", elec: "Import fossil electricity from neighbors", color: C.green },
                { step: "6", action: "Disproportionately burden lower-income residents", gas: "Central Valley farmworkers hit hardest", elec: "Those who can't afford solar or EVs pay most", color: C.purple },
              ].map((r, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: i < 5 ? `1px solid ${C.border}` : "none",
                  alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: `${r.color}30`,
                    border: `2px solid ${r.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: r.color, flexShrink: 0,
                  }}>{r.step}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>{r.action}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontSize: 12, color: C.coral, background: `${C.coral}15`, padding: "2px 8px", borderRadius: 4 }}>⛽ {r.gas}</span>
                      <span style={{ fontSize: 12, color: C.amber, background: `${C.amber}15`, padding: "2px 8px", borderRadius: 4 }}>⚡ {r.elec}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="The Verdict">
            <div style={{
              background: "linear-gradient(135deg, #78350F22, #1E293B)",
              border: `1px solid ${C.amber}55`,
              borderRadius: 8,
              padding: 24,
            }}>
              <p style={{ fontSize: 15, color: C.white, lineHeight: 1.7, marginBottom: 14 }}>
                California has built a system that <strong style={{ color: C.amber }}>achieves real environmental progress</strong> — 
                55% low-carbon electricity, nation-leading solar deployment, falling gas-plant output. That's not nothing.
              </p>
              <p style={{ fontSize: 15, color: C.white, lineHeight: 1.7, marginBottom: 14 }}>
                But the state has done so at <strong style={{ color: C.coral }}>extraordinary cost</strong>, borne disproportionately 
                by those least able to afford it, while simultaneously exporting emissions to other jurisdictions 
                rather than truly eliminating them.
              </p>
              <p style={{ fontSize: 15, color: C.white, lineHeight: 1.7, marginBottom: 14 }}>
                The core contradiction: California is the <strong>only state that tried to close its largest carbon-free 
                power plant</strong> while mandating 100% clean electricity. It's the only state that 
                <strong> shut down 17% of its refinery capacity</strong> while 30 million gas-powered vehicles still 
                drive its roads. In both cases, the state created demand-supply mismatches that enriched 
                importers and punished consumers.
              </p>
              <p style={{ fontSize: 15, color: "#CBD5E1", lineHeight: 1.7, fontStyle: "italic" }}>
                The question isn't whether clean energy is worth pursuing. It's whether California's approach — 
                destroying domestic supply before alternatives are ready, then importing the same energy from 
                jurisdictions with weaker standards — constitutes environmental policy or environmental theater.
              </p>
            </div>
          </Section>
        </>)}

        {/* Footer */}
        <div style={{
          marginTop: 36,
          padding: "18px 0",
          borderTop: `1px solid ${C.border}`,
          fontSize: 11,
          color: C.lightSlate,
          lineHeight: 1.6,
        }}>
          <strong style={{ color: C.white }}>Sources:</strong> U.S. Energy Information Administration (EIA), California ISO (CAISO), 
          California Energy Commission, California Public Utilities Commission, California Legislative Analyst's Office, 
          Nuclear Regulatory Commission, MIT/Stanford (2021), Californians for Green Nuclear Power, Electric Choice, 
          Choose Energy. Data as of March 2026. Some cost estimates are approximate composites from multiple sources.
        </div>
      </div>
    </div>
  );
}
