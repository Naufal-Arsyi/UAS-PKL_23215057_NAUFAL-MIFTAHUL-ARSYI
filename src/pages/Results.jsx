import { useMemo } from "react";
import {
  ArrowLeft, Printer, MessageSquare, Star, AlertCircle,
  RotateCcw, Wifi, MapPin, Monitor, Phone,
} from "lucide-react";
import { GEJALA } from "../data/gejala.js";
import { DISPATCH_META } from "../data/penyebab.js";
import { getMatchedGejala } from "../utils/cfEngine.js";
import "../styles/global.css";
import "../styles/results.css";

const RANK_COLORS = ["var(--primary)", "#818CF8", "var(--text-faint)"];

const DISPATCH_ICONS = {
  self:   <span style={{ fontSize: 22 }}>🟢</span>,
  remote: <Monitor size={22} color="#fff" />,
  onsite: <MapPin  size={22} color="#fff" />,
};

const DISPATCH_TITLES = {
  self:   "Klien Dapat Menangani Sendiri",
  remote: "Teknisi Akan Tangani dari Jarak Jauh",
  onsite: "Teknisi Harus Datang ke Lokasi",
};

function buildWAText(company, selected, results) {
  const top  = results[0];
  const syms = Object.keys(selected)
    .map((id) => GEJALA.find((g) => g.id === id)?.nama)
    .filter(Boolean)
    .join(", ");
  const dm = DISPATCH_META[top.dispatch];
  return encodeURIComponent(
    `Halo,\n\n` +
    `Berikut hasil analisis gangguan WiFi:\n` +
    `📶 WiFi: ${company.name || "-"}\n\n` +
    `📋 Gejala: ${syms}\n\n` +
    `🔍 Penyebab: ${top.nama}\n` +
    `📊 Certainty Factor: ${(top.cf * 100).toFixed(1)}%\n` +
    `⚡ Penanganan: ${dm.label} — ${dm.desc}\n\n` +
    `💡 Solusi: ${top.solusi}\n\n` +
    `— NetReport System`
  );
}

export default function Results({ results, selected, company, onBack, onReset }) {
  const top     = results[0];
  const waPhone = company.phone?.replace(/\D/g, "");
  const waText  = useMemo(
    () => top ? buildWAText(company, selected, results) : "",
    [company, selected, results, top]
  );

  const printDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="results-page page">
      {/* Print receipt */}
      <div className="print-receipt" aria-hidden="true">
        <p className="print-receipt-title">NetReport — Tiket Gangguan WiFi</p>
        <p style={{ textAlign: "center", marginBottom: 4 }}>Tanggal: {printDate}</p>
        <hr className="print-receipt-divider" />
        <p><strong>Nama WiFi:</strong> {company.name || "-"}</p>
        <p><strong>No. HP:</strong>     {company.phone || "-"}</p>
        <hr className="print-receipt-divider" />
        <p><strong>Gejala Dilaporkan:</strong></p>
        {Object.keys(selected).map((id) => (
          <p key={id}>• {GEJALA.find((g) => g.id === id)?.nama} (CF: {selected[id]})</p>
        ))}
        <hr className="print-receipt-divider" />
        <p><strong>Hasil Diagnosa (Top 3):</strong></p>
        {results.map((r, i) => (
          <p key={r.id}>#{i+1} {r.nama} — CF {(r.cf*100).toFixed(1)}% — {DISPATCH_META[r.dispatch].label}</p>
        ))}
        {top && (
          <>
            <hr className="print-receipt-divider" />
            <p><strong>Penanganan: {DISPATCH_META[top.dispatch].label.toUpperCase()}</strong></p>
            <p>{top.solusi}</p>
          </>
        )}
      </div>

      {/* Screen view */}
      <div className="no-print">
        <nav className="topbar">
          <button className="btn btn-ghost btn-sm" style={{ color: "#94A3B8", border: "none" }} onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="logo">
            <div className="logo-icon"><Wifi size={15} color="#fff" /></div>
            <span className="logo-name logo-name--sm">Hasil Analisis</span>
          </div>
          <div className="results-topbar-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              <Printer size={14} /> Cetak
            </button>
            {waPhone && top && (
              <a className="btn btn-wa btn-sm"
                href={`https://wa.me/${waPhone}?text=${waText}`}
                target="_blank" rel="noopener noreferrer">
                <MessageSquare size={14} /> Kirim WA
              </a>
            )}
          </div>
        </nav>

        <div className="container" style={{ paddingTop: 20, paddingBottom: 24 }}>
          {results.length === 0 ? (
            <div className="card empty-state">
              <AlertCircle size={36} className="empty-state-icon" />
              <p className="empty-state-text">
                Tidak ada penyebab yang teridentifikasi.<br />Coba pilih lebih banyak gejala.
              </p>
              <button className="btn btn-primary" onClick={onBack}>Kembali</button>
            </div>
          ) : (
            <>
              {/* ── DISPATCH DECISION BANNER ── */}
              {top && (() => {
                const dm = DISPATCH_META[top.dispatch];
                return (
                  <div className={`dispatch-banner dispatch-banner--${top.dispatch}`} role="alert">
                    <div className={`dispatch-banner-icon dispatch-banner-icon--${top.dispatch}`}>
                      {DISPATCH_ICONS[top.dispatch]}
                    </div>
                    <div>
                      <p className="dispatch-banner-eyebrow label-caps">Rekomendasi Penanganan</p>
                      <p className="dispatch-banner-title">{DISPATCH_TITLES[top.dispatch]}</p>
                      <p className="dispatch-banner-meta">{top.solusi}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Conclusion banner */}
              <div className="result-banner">
                <div className="result-banner-icon"><Star size={20} color="#fff" /></div>
                <div>
                  <p className="result-banner-label">Penyebab Utama Teridentifikasi</p>
                  <p className="result-banner-title">{top.nama}</p>
                  <p className="result-banner-meta">CF: {(top.cf * 100).toFixed(1)}% &nbsp;·&nbsp; {DISPATCH_META[top.dispatch].label}</p>
                </div>
              </div>

              {/* Company info */}
              {company.name && (
                <div className="card company-bar">
                  <span><span className="company-bar-label">WiFi:</span> <strong>{company.name}</strong></span>
                  {company.phone && <span><span className="company-bar-label">Telepon:</span> <strong>{company.phone}</strong></span>}
                </div>
              )}

              {/* Top 3 results */}
              <ol className="result-list">
                {results.map((r, i) => {
                  const matchedIds   = getMatchedGejala(r.id, selected);
                  const matchedNames = matchedIds.map((id) => GEJALA.find((g) => g.id === id)?.nama).filter(Boolean);
                  const accent       = RANK_COLORS[i] ?? "var(--text-faint)";
                  const cfPct        = (r.cf * 100).toFixed(1);
                  const dm           = DISPATCH_META[r.dispatch];

                  return (
                    <li key={r.id}>
                      <article className={`result-card${i === 0 ? " result-card--top" : ""}`}>
                        <div className="result-card-header">
                          <div className="result-card-left">
                            <div className={`result-rank${i === 0 ? " result-rank--1" : i === 1 ? " result-rank--2" : ""}`}>#{i+1}</div>
                            <div>
                              <p className="result-name">{r.nama}</p>
                              <div className="result-dispatch-row">
                                <span className={`badge badge-${r.dispatch}`}>{dm.label}</span>
                                <span className="text-muted" style={{ fontSize: 12 }}>{dm.desc}</span>
                              </div>
                            </div>
                          </div>
                          <div className="result-cf-block">
                            <p className="result-cf-value" style={{ color: accent }}>{cfPct}%</p>
                            <p className="result-cf-label">Certainty Factor</p>
                          </div>
                        </div>

                        <div className="cf-progress-track">
                          <div className="cf-progress-fill" style={{ width: `${cfPct}%`, background: accent }} />
                        </div>

                        {/* Solution */}
                        <div className="result-solution" style={{ background: dm.bg, color: dm.textColor, border: `1px solid ${dm.border}` }}>
                          <span style={{ fontWeight: 600 }}>Solusi: </span>{r.solusi}
                        </div>

                        {/* Matched gejala */}
                        {matchedNames.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <p className="result-gejala-label label-caps text-muted">Gejala yang cocok</p>
                            <ul className="result-gejala-list">
                              {matchedNames.map((n) => <li key={n} className="gejala-tag">{n}</li>)}
                            </ul>
                          </div>
                        )}
                      </article>
                    </li>
                  );
                })}
              </ol>

              <div className="results-footer">
                <button className="btn btn-ghost" onClick={onReset}>
                  <RotateCcw size={14} /> Laporan Baru
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
