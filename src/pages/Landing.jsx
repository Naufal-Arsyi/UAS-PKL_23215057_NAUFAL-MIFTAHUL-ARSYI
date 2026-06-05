import { useState } from "react";
import {
  Wifi, Activity, Globe, Shield, Clock, MessageSquare,
  Server, Printer, CheckCircle, Wrench,
} from "lucide-react";
import Modal from "../components/Modal.jsx";
import "../styles/global.css";
import "../styles/landing.css";

const FEATURES = [
  { Icon: Wifi,         title: "50 Gejala WiFi",      desc: "Keluhan jaringan perusahaan yang umum terjadi" },
  { Icon: Activity,     title: "CF Engine",            desc: "Certainty Factor + Forward Chaining" },
  { Icon: Globe,        title: "17 Penyebab WiFi",     desc: "Identifikasi root cause gangguan WiFi" },
  { Icon: CheckCircle,  title: "Dispatch Otomatis",    desc: "Sistem tentukan perlu teknisi datang atau tidak" },
  { Icon: Printer,      title: "Cetak Laporan",        desc: "Ekspor tiket laporan gangguan ke PDF" },
  { Icon: MessageSquare,title: "Notif WhatsApp",       desc: "Teknisi update status via Qontak API" },
];

export default function Landing({ onStart, onTechLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [creds, setCreds]         = useState({ user: "", pass: "" });
  const [loginErr, setLoginErr]   = useState("");

  const handleSubmit = () => {
    const ok = onTechLogin(creds);
    if (!ok) setLoginErr("Username atau password salah.");
  };

  const closeModal = () => {
    setShowModal(false);
    setLoginErr("");
    setCreds({ user: "", pass: "" });
  };

  return (
    <div className="landing-page page">
      {/* Topbar */}
      <nav className="topbar">
        <div className="logo">
          <div className="logo-icon"><Wifi size={18} color="#fff" /></div>
          <span className="logo-name">AlgioNet</span>
        </div>
        <div className="topbar-right">
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-chip">
          <Activity size={13} /> SISTEM PAKAR FORWARD CHAINING + CERTAINTY FACTOR
        </div>
        <h1 className="landing-title">
          Laporan Gangguan<br />
          <span className="landing-title-accent">WiFi</span>
        </h1>
        <p className="landing-subtitle">
          Identifikasi penyebab gangguan jaringan WiFi dari gejala yang dialami.
          Sistem menentukan otomatis apakah teknisi perlu datang ke lokasi atau tidak.
        </p>
        <div className="landing-actions">
          <button className="btn btn-primary" onClick={onStart}>
            <Wifi size={18} /> Laporkan Gangguan
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="container">
          <h2 className="landing-features-title">Fitur Sistem</h2>
          <div className="features-grid">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon-wrap">
                  <Icon size={20} color="var(--primary)" />
                </div>
                <div className="feature-title">{title}</div>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>

          {/* Dispatch legend */}
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { cls: "badge-self",   icon: "🟢", label: "Mandiri",  desc: "Klien selesaikan sendiri" },
              { cls: "badge-remote", icon: "🔵", label: "Remote",   desc: "Teknisi tangani dari jauh" },
              { cls: "badge-onsite", icon: "🔴", label: "Onsite",   desc: "Teknisi harus datang" },
            ].map((d) => (
              <div key={d.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
                <span style={{ fontSize: 20 }}>{d.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{d.label}</div>
                  <div className="text-muted">{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Login Modal */}
      {showModal && (
        <Modal onClose={closeModal}>
          <div style={{ marginBottom: 20 }}>
            <div className="tech-login-brand">
              <div className="logo-icon" style={{ width: 28, height: 28 }}>
                <Wrench size={14} color="#fff" />
              </div>
              <span className="tech-login-name">Login Teknisi</span>
            </div>
            <p className="text-muted" style={{ marginTop: 4 }}>Akses dashboard manajemen gangguan</p>
          </div>
          <div className="tech-login-form">
            <input className="input" placeholder="Username" value={creds.user}
              onChange={(e) => setCreds((p) => ({ ...p, user: e.target.value }))} />
            <input className="input" type="password" placeholder="Password" value={creds.pass}
              onChange={(e) => setCreds((p) => ({ ...p, pass: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            {loginErr && <p className="tech-login-error">{loginErr}</p>}
            <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={handleSubmit}>
              Masuk Dashboard
            </button>
            <p className="tech-login-hint">Demo: username <strong>teknisi</strong>, password bebas</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
