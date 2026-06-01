import { useState } from "react";
import { calcCF } from "./utils/cfEngine.js";
import { MOCK_CASES } from "./data/mockCases.js";
import Landing    from "./pages/Landing.jsx";
import Symptoms   from "./pages/Symptoms.jsx";
import Results    from "./pages/Results.jsx";
import Technician from "./pages/Technician.jsx";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "symptoms" | "results" | "tech"

  // ── Client form 
  const [company, setCompany] = useState({
    name: "", phone: "",
  });

  // ── Symptom selection: { [gejalaId]: confidenceValue } ───
  const [selected, setSelected] = useState({});

  // ── CF results 
  const [results, setResults] = useState([]);

  // ── Technician cases
  const [cases, setCases] = useState(MOCK_CASES);

  const toggleSymptom = (id) =>
    setSelected((prev) => {
      if (id in prev) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: 0.6 }; // default confidence
    });

  const setConf = (id, val) =>
    setSelected((prev) => ({ ...prev, [id]: val }));

  // ── Analyze: jalankan CF engine, pindah ke hasil ─────────
  const handleAnalyze = () => {
    setResults(calcCF(selected));
    setPage("results");
  };

  // ── Teknisi login ─────────────────────────────────────────
  const handleTechLogin = ({ user, pass }) => {
    if (user.toLowerCase() === "teknisi" && pass.length > 0) {
      setPage("tech");
      return true;
    }
    return false;
  };

  // ── Update status kasus oleh teknisi ─────────────────────
  const handleCaseUpdate = (id, status) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  // ── Reset ke form laporan baru ────────────────────────────
  const handleReset = () => {
    setSelected({});
    setResults([]);
    setCompany({ name: "", contact: "", phone: "", location: "" });
    setPage("symptoms");
  };

  // ── Render ────────────────────────────────────────────────
  if (page === "landing")
    return (
      <Landing
        onStart={() => setPage("symptoms")}
        onTechLogin={handleTechLogin}
      />
    );

  if (page === "symptoms")
    return (
      <Symptoms
        company={company}
        setCompany={setCompany}
        selected={selected}
        onToggle={toggleSymptom}
        onSetConf={setConf}
        onBack={() => setPage("landing")}
        onAnalyze={handleAnalyze}
      />
    );

  if (page === "results")
    return (
      <Results
        results={results}
        selected={selected}
        company={company}
        onBack={() => setPage("symptoms")}
        onReset={handleReset}
      />
    );

  if (page === "tech")
    return (
      <Technician
        cases={cases}
        onCaseUpdate={handleCaseUpdate}
        onLogout={() => setPage("landing")}
      />
    );

  return null;
}
