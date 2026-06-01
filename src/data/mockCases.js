/**
 * Contoh data laporan gangguan WiFi untuk tampilan dashboard teknisi.
 * Di produksi, data ini berasal dari API/database backend.
 *
 * @type {{
 *   id: string;
 *   company: string;
 *   phone: string;
 *   date: string;
 *   symptoms: string[];
 *   diagnosis: string;
 *   diagnosisId: string;
 *   dispatch: "self" | "remote" | "onsite";
 *   deadline: string;
 *   status: "pending" | "in_progress" | "done";
 * }[]}
 */
export const MOCK_CASES = [
  {
    id: "NR-2026-001",
    company: "WiFi Main Office",
    phone: "081234567890",
    date: "2026-05-25",
    symptoms: ["G01", "G08", "G03"],
    diagnosis: "Bandwidth penuh / overload pengguna",
    diagnosisId: "P01",
    dispatch: "self",
    deadline: "Bisa ditangani segera",
    status: "pending",
  },
  {
    id: "NR-2026-002",
    company: "WiFi Branch Office",
    phone: "082345678901",
    date: "2026-05-24",
    symptoms: ["G06", "G04"],
    diagnosis: "Gangguan dari ISP",
    diagnosisId: "P02",
    dispatch: "remote",
    deadline: "1–2 jam (eskalasi ISP)",
    status: "in_progress",
  },
  {
    id: "NR-2026-003",
    company: "WiFi Server Room",
    phone: "083456789012",
    date: "2026-05-23",
    symptoms: ["G02", "G05"],
    diagnosis: "Access Point rusak",
    diagnosisId: "P04",
    dispatch: "onsite",
    deadline: "Kunjungan hari ini",
    status: "in_progress",
  },
  {
    id: "NR-2026-004",
    company: "WiFi Kampus",
    phone: "084567890123",
    date: "2026-05-22",
    symptoms: ["G04", "G10"],
    diagnosis: "DNS bermasalah",
    diagnosisId: "P09",
    dispatch: "self",
    deadline: "Selesai",
    status: "done",
  },
  {
    id: "NR-2026-005",
    company: "WiFi Rumah Sakit",
    phone: "085678901234",
    date: "2026-05-25",
    symptoms: ["G02", "G06"],
    diagnosis: "Kabel LAN putus / longgar",
    diagnosisId: "P05",
    dispatch: "onsite",
    deadline: "Prioritas tinggi — max 4 jam",
    status: "pending",
  },
];
