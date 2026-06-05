import { useEffect, useState } from "react";
import {
  LogOut, CheckCircle, X, Clock, MessageSquare,
  Send, Wifi, MapPin, Monitor,
} from "lucide-react";
import Modal from "../components/Modal.jsx";
import { fetchGejala } from "../services/ApiService.js";
import "../styles/global.css";
import "../styles/technician.css";

const STATUS_META = {
  pending:     { cls: "badge-pending",     label: "Antrian"      },
  in_progress: { cls: "badge-in-progress", label: "Dalam Proses" },
  done:        { cls: "badge-done",        label: "Selesai"      },
};

const DISPATCH_META = {
  self: {
    label: "Mandiri",
    desc: "Klien dapat menangani sendiri",
  },
  remote: {
    label: "Remote",
    desc: "Teknisi tangani dari jarak jauh",
  },
  onsite: {
    label: "Onsite",
    desc: "Teknisi harus datang ke lokasi",
  },
};

const DISPATCH_ICONS = {
  self:   <span style={{ fontSize: 16 }}>🟢</span>,
  remote: <Monitor size={14} color="#fff" />,
  onsite: <MapPin  size={14} color="#fff" />,
};

function buildUpdateMsg(c) {
  if (c.status === "in_progress") {
    return (
      `Halo, gangguan WiFi di ${c.company} sedang dalam penanganan kami. ` +
      `Estimasi selesai: ${c.deadline}. ` +
      `Penyebab teridentifikasi: ${c.diagnosis}. Kami akan segera memberikan update. — NetReport`
    );
  }
  return (
    `Halo, gangguan WiFi di ${c.company} telah selesai ditangani. ` +
    `Mohon lakukan pengecekan dari sisi Anda. Hubungi kami jika masih ada masalah. — NetReport`
  );
}

export default function Technician({ cases, onCaseUpdate, onLogout }) {
  const [activeCase,  setActiveCase]  = useState(null);
  const [showWaModal, setShowWaModal] = useState(false);
  const [waSent,      setWaSent]      = useState(false);
  const [waProgress,  setWaProgress]  = useState("");
  const [gejalaMap,   setGejalaMap]   = useState({});

  const stats = {
    pending:     cases.filter((c) => c.status === "pending").length,
    in_progress: cases.filter((c) => c.status === "in_progress").length,
    done:        cases.filter((c) => c.status === "done").length,
  };

  useEffect(() => {
    let mounted = true;

    fetchGejala()
      .then((data) => {
        if (!mounted) return;
        const map = Object.fromEntries((data || []).map((item) => [item.id, item]));
        setGejalaMap(map);
      })
      .catch((error) => {
        console.error("Gagal memuat gejala untuk technician view:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const openDetail = (c) => { setActiveCase(c); setWaSent(false); setWaProgress(""); };

  const accept = (id, status) => {
    onCaseUpdate(id, status);
    setActiveCase((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const sendQontak = () => {
    setWaProgress("Menghubungi Qontak API...");
    setTimeout(() => setWaProgress("Mengirim pesan..."), 900);
    setTimeout(() => { setWaProgress(""); setWaSent(true); }, 1800);
  };

  return (
    <div className="tech-page page">
      {/* Topbar */}
      <nav className="topbar">
        <div className="logo">
          <div className="logo-icon"><Wifi size={15} color="#fff" /></div>
          <span className="logo-name logo-name--sm">Dashboard Teknisi</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-outline btn-sm" onClick={onLogout}>
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 24 }}>
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Antrian Masuk</p>
            <p className="stat-value stat-value--pending">{stats.pending}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Dalam Penanganan</p>
            <p className="stat-value stat-value--in-progress">{stats.in_progress}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Selesai</p>
            <p className="stat-value stat-value--done">{stats.done}</p>
          </div>
        </div>

        <div className={`cases-layout${activeCase ? " cases-layout--split" : ""}`}>
          {/* Cases list */}
          <section>
            <p className="cases-column-title">Daftar Tiket Gangguan WiFi</p>
            <ul className="cases-list">
              {cases.map((c) => {
                const sm = STATUS_META[c.status];
                const dm = DISPATCH_META[c.dispatch];
                return (
                  <li key={c.id}>
                    <article
                      className={`case-card${activeCase?.id === c.id ? " case-card--active" : ""}`}
                      onClick={() => openDetail(c)}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && openDetail(c)}
                    >
                      <div className="case-card-top">
                        <div>
                          <p className="case-company">{c.company}</p>
                          <p className="case-meta">{c.id} · {c.date}</p>
                        </div>
                        <div className="case-badges">
                          <span className={`badge badge-${c.dispatch}`}>{dm.label}</span>
                          <span className={`badge ${sm.cls}`}>{sm.label}</span>
                        </div>
                      </div>
                      <div className="case-tags">
                        {c.symptoms.slice(0, 3).map((sid) => (
                          <span key={sid} className="case-tag">
                            {gejalaMap[sid]?.nama || sid}
                          </span>
                        ))}
                        {c.symptoms.length > 3 && (
                          <span className="case-tag-more">+{c.symptoms.length - 3}</span>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Detail panel */}
          {activeCase && (() => {
            const dm = DISPATCH_META[activeCase.dispatch];
            return (
              <aside className="detail-panel">
                <div className="detail-header">
                  <div>
                    <p className="detail-company">{activeCase.company}</p>
                    <p className="detail-contact">
                      {activeCase.phone} · {activeCase.date}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`badge ${STATUS_META[activeCase.status].cls}`}>
                      {STATUS_META[activeCase.status].label}
                    </span>
                    <button className="detail-close" onClick={() => setActiveCase(null)}>
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Dispatch recommendation */}
                <div className={`detail-dispatch detail-dispatch--${activeCase.dispatch}`}>
                  <div className="detail-dispatch-header">
                    <div className="detail-dispatch-icon">{DISPATCH_ICONS[activeCase.dispatch]}</div>
                    <p className="detail-dispatch-label">{dm.label} — {dm.desc}</p>
                  </div>
                  <p className="detail-dispatch-solusi">
                    {activeCase.solusi || dm.desc}
                  </p>
                </div>

                {/* Diagnosis */}
                <div className="detail-diagnosis">
                  <p className="label-caps detail-diagnosis-label">Penyebab Teridentifikasi</p>
                  <p className="detail-diagnosis-name">{activeCase.diagnosis}</p>
                  <p className="detail-diagnosis-id">{activeCase.diagnosisId}</p>
                </div>

                {/* Symptoms */}
                <div className="detail-section">
                  <p className="label-caps detail-section-label text-muted">Gejala yang Dilaporkan</p>
                  <div className="detail-tags">
                    {activeCase.symptoms.map((sid) => (
                      <span key={sid} className="detail-tag">
                        {gejalaMap[sid]?.nama || sid}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div className="detail-deadline">
                  <Clock size={16} color="var(--info-text)" style={{ flexShrink: 0 }} />
                  <div>
                    <p className="label-caps detail-deadline-label">Estimasi Penanganan</p>
                    <p className="detail-deadline-value">{activeCase.deadline}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="detail-actions">
                  {activeCase.status === "pending" && (
                    <>
                      {activeCase.dispatch === "onsite" ? (
                        <button className="btn-onsite" onClick={() => accept(activeCase.id, "in_progress")}>
                          <MapPin size={16} /> Jadwalkan Kunjungan Onsite
                        </button>
                      ) : (
                        <button className="btn-remote" onClick={() => accept(activeCase.id, "in_progress")}>
                          <Monitor size={16} /> Mulai Penanganan Remote
                        </button>
                      )}
                    </>
                  )}
                  {activeCase.status === "in_progress" && (
                    <button className="btn btn-green" onClick={() => accept(activeCase.id, "done")}>
                      <CheckCircle size={16} /> Tandai Selesai
                    </button>
                  )}
                  {activeCase.status !== "done" && (
                    <button className="btn-wa-block btn"
                      onClick={() => { setShowWaModal(true); setWaSent(false); setWaProgress(""); }}>
                      <MessageSquare size={16} /> Kirim Update WhatsApp
                    </button>
                  )}
                </div>
              </aside>
            );
          })()}
        </div>
      </div>

      {/* Qontak WA Modal */}
      {showWaModal && activeCase && (
        <Modal onClose={() => setShowWaModal(false)}>
          <p className="qontak-modal-title">Kirim Update via Qontak</p>
          <p className="qontak-modal-sub">WhatsApp Business API · {activeCase.phone}</p>

          <div className="qontak-preview">
            <p className="label-caps qontak-preview-label">Pratinjau Pesan</p>
            <p className="qontak-preview-text">{buildUpdateMsg(activeCase)}</p>
          </div>

          <div className="qontak-api">
            <p className="qontak-api-title">POST /v1/broadcasts/whatsapp/direct</p>
            <pre className="qontak-api-code">{JSON.stringify({
              channel_integration_id: "wa_channel_id",
              to: activeCase.phone,
              type: "template",
              message_template_id: "update_gangguan_wifi",
              body: { params: [activeCase.diagnosis, activeCase.deadline] },
            }, null, 2)}</pre>
          </div>

          {waSent ? (
            <div className="qontak-success">
              <CheckCircle size={24} color="#16A34A" style={{ margin: "0 auto" }} />
              <p className="qontak-success-text">Pesan berhasil dikirim!</p>
            </div>
          ) : (
            <button className="btn btn-wa-block" disabled={!!waProgress}
              style={{ opacity: waProgress ? 0.7 : 1 }} onClick={sendQontak}>
              <Send size={15} /> {waProgress || "Kirim via Qontak"}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
