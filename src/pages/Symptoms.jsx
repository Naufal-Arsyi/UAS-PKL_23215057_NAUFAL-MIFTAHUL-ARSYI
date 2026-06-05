import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Search, Check, ChevronRight, Wifi, WifiOff,
  Globe, Signal, Zap, Clock, Activity, RefreshCw, Server,
  AlertCircle, Building2, Phone, User, MapPin,
} from "lucide-react";
import { fetchGejala } from "../services/ApiService.js";
import { normalizePhoneNumber } from "../utils/phoneNumber.js";
import "../styles/global.css";
import "../styles/symptoms.css";

/** Ikon per gejala */
const ICON_MAP = {
  G01: Wifi,
  G02: WifiOff,
  G03: RefreshCw,
  G04: Globe,
  G05: Signal,
  G06: AlertCircle,
  G07: Activity,
  G08: Zap,
  G09: Server,
  G10: Globe,
  G11: Activity,     // LOS indicator
  G12: Activity,     // PON indicator
  G13: Clock,        // Time-specific
  G14: AlertCircle,  // Overheating
  G15: Server,       // WAN IP issue
  G16: AlertCircle,  // Modem LED blinking
  G17: WifiOff,      // No internet despite WiFi
  G18: AlertCircle,  // IP conflict
  G19: RefreshCw,    // Frequent reconnect
  G20: Zap,          // Download slow
  G21: Zap,          // Upload slow
  G22: Globe,        // Website blocked
  G23: AlertCircle,  // Same IP across devices
  G24: Server,       // Router freeze
  G25: Signal,       // Weak coverage
  G26: Zap,          // Ping ok but browsing slow
  G27: Activity,     // Game disconnect
  G28: Globe,        // YouTube buffering
  G29: WifiOff,      // Connected but no internet
  G30: Server,       // Reboot many devices
  G31: AlertCircle,  // DHCP no IP
  G32: Clock,        // DNS slow resolve
  G33: AlertCircle,  // Loose cable
  G34: AlertCircle,  // No LAN light
  G35: RefreshCw,    // Restart after power down
  G36: Signal,       // 2.4GHz ok 5GHz missing
  G37: Signal,       // 5GHz ok 2.4GHz bad
  G38: AlertCircle,  // Disconnects in rain
  G39: AlertCircle,  // LOS red blinking
  G40: AlertCircle,  // PON blinking abnormal
  G41: Zap,          // Strong signal slow internet
  G42: Server,       // DHCP failed
  G43: Server,       // Router config not saved
  G44: RefreshCw,    // Frequent relogin
  G45: Globe,        // HTTPS website fails
  G46: Wifi,         // Ethernet ok WiFi slow
  G47: AlertCircle,  // Foreign device connected
  G48: Server,       // Router inaccessible
  G49: AlertCircle,  // Disconnects with microwave
  G50: AlertCircle,  // Ping gateway timeout
};

export default function Symptoms({
  company, setCompany,
  selected, onToggle, onSetConf,
  onBack, onAnalyze,
}) {
  const [search, setSearch] = useState("");
  const [gejalaList, setGejalaList] = useState([]);
  const [loadingGejala, setLoadingGejala] = useState(true);

  const normalizedSearch = search.trim().toLowerCase();

  useEffect(() => {
    let mounted = true;

    fetchGejala()
      .then((data) => {
        if (mounted) setGejalaList(data);
      })
      .catch((error) => {
        console.error('Gagal memuat gejala dari API:', error);
        if (mounted) setGejalaList([]);
      })
      .finally(() => {
        if (mounted) setLoadingGejala(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const CF_LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];
  const CF_LABELS = {
    0.2: 'tidak yakin',
    0.4: 'kurang yakin',
    0.6: 'cukup yakin',
    0.8: 'yakin',
    1.0: 'sangat yakin',
  };

  const selectedSymptoms = useMemo(
    () => gejalaList.filter((g) => g.id in selected),
    [gejalaList, selected]
  );

  const matchedSymptoms = useMemo(() => {
    if (!normalizedSearch) return [];

    const queryParts = normalizedSearch.split(/\s+/).filter(Boolean);

    return gejalaList.filter((g) => {
      const haystack = `${g.id} ${g.nama} ${g.deskripsi}`.toLowerCase();
      return queryParts.every((part) => haystack.includes(part));
    });
  }, [gejalaList, normalizedSearch]);

  const visibleSymptoms = useMemo(() => {
    const visible = new Map();

    selectedSymptoms.forEach((g) => visible.set(g.id, g));

    matchedSymptoms.forEach((g) => visible.set(g.id, g));

    return Array.from(visible.values());
  }, [matchedSymptoms, selectedSymptoms]);

  const hasSearchQuery = normalizedSearch.length > 0;
  const hasVisibleSymptoms = visibleSymptoms.length > 0;

  const selCount = Object.keys(selected).length;

  const statusMessage = !hasSearchQuery
    ? (selectedSymptoms.length > 0
      ? `${selectedSymptoms.length} gejala terpilih tetap ditampilkan.`
      : "Ketik kata kunci untuk menampilkan gejala yang ingin dipilih.")
    : (matchedSymptoms.length > 0
      ? (selectedSymptoms.length > 0
        ? `${matchedSymptoms.length} gejala ditemukan. Gejala terpilih tetap ditampilkan.`
        : `${matchedSymptoms.length} gejala ditemukan. Klik untuk memilih.`)
      : (selectedSymptoms.length > 0
        ? "Tidak ada gejala baru yang cocok. Gejala terpilih tetap ditampilkan."
        : "Tidak ada gejala yang cocok. Coba kata kunci lain."));

  return (
    <div className="symptoms-page page">
      {/* Topbar */}
      <nav className="topbar">
        <button className="btn btn-ghost btn-sm" style={{ color: "#94A3B8", border: "none" }}
          onClick={onBack} aria-label="Kembali">
          <ArrowLeft size={20} />
        </button>
        <div className="logo">
          <div className="logo-icon"><Wifi size={15} color="#fff" /></div>
          <span className="logo-name logo-name--sm">Laporan Gangguan</span>
        </div>
        <div className="symptoms-count" aria-live="polite">
          <span className="symptoms-count-num">{selCount}</span> gejala dipilih
        </div>
      </nav>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 16 }}>
        {/* Company / client info */}
        <div className="card company-form">
          <p className="company-form-title">Informasi Pelanggan</p>
          <div className="company-form-grid">
            <div style={{ position: "relative" }}>
              <Wifi size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              <input className="input" style={{ paddingLeft: 30 }} placeholder="Nama Pelanggan"
                value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
            </div>
            <div style={{ position: "relative" }}>
              <Phone size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              <input className="input" style={{ paddingLeft: 30 }} placeholder="No. HP (WhatsApp)"
                  value={company.phone} onChange={(e) => setCompany({ ...company, phone: normalizePhoneNumber(e.target.value) })} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input className="input search-input" placeholder="Cari gejala, misalnya lambat, LOS, DHCP..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="symptoms-status" aria-live="polite">
          {loadingGejala ? 'Memuat daftar gejala dari database...' : statusMessage}
        </div>

        {/* Symptom grid */}
        {hasVisibleSymptoms ? (
          <div className="symptom-grid" role="list">
            {visibleSymptoms.map(({ id, nama, deskripsi }) => {
              const isSel = id in selected;
              const conf  = selected[id];
              const Icon  = ICON_MAP[id] ?? Activity;

              return (
                <div key={id} role="listitem"
                  className={`symptom-card${isSel ? " symptom-card--selected" : ""}`}
                  onClick={() => onToggle(id)}>

                  <div className="symptom-card-row">
                    <div className={`symptom-checkbox${isSel ? " symptom-checkbox--checked" : ""}`} aria-hidden="true">
                      {isSel && <Check size={11} color="#fff" strokeWidth={3} />}
                    </div>
                    <div className="symptom-label-wrap">
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon size={13} color={isSel ? "var(--primary)" : "var(--text-faint)"} />
                        <span className={`symptom-name${isSel ? " symptom-name--selected" : ""}`}>{nama}</span>
                      </div>
                      <p className={`symptom-desc${isSel ? " symptom-desc--selected" : ""}`}>{deskripsi}</p>
                    </div>
                  </div>

                  {isSel && (
                    <div className="confidence-row" onClick={(e) => e.stopPropagation()}
                      role="group" aria-label={`Keyakinan untuk ${nama}`}>
                      {CF_LEVELS.map((lv) => (
                        <button key={lv} className={`cf-btn${conf === lv ? " cf-btn--active" : ""}`}
                          title={`Tingkat keyakinan: ${CF_LABELS[lv]}`}
                          aria-label={`Tingkat keyakinan ${CF_LABELS[lv]}`}
                          aria-pressed={conf === lv}
                          onClick={() => onSetConf(id, lv)}>
                          {CF_LABELS[lv]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="symptom-empty-state" aria-live="polite">
            <div className="symptom-empty-icon">
              <Search size={18} />
            </div>
            <p className="symptom-empty-title">
              {!hasSearchQuery ? "Mulai dengan pencarian" : "Gejala tidak ditemukan"}
            </p>
            <p className="symptom-empty-desc">
              {!hasSearchQuery
                ? "Semua gejala disembunyikan sampai Anda mengetik kata kunci di kolom pencarian."
                : "Ubah kata kunci untuk menampilkan gejala yang sesuai."}
            </p>
          </div>
        )}

        {/* Bottom bar */}
        <div className="card analyze-bar">
          <p className="analyze-hint">
            {selCount === 0
              ? "Belum ada gejala yang dipilih"
              : <><strong>{selCount} gejala</strong> siap dianalisis</>}
          </p>
          <button className="btn btn-primary" disabled={selCount === 0} onClick={onAnalyze}>
            Analisis <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
