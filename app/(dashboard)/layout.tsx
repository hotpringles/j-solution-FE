"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",        icon: "⬡", label: "Overview" },
  { href: "/assets",  icon: "🔍", label: "Asset Discovery" },
  { href: "/risk",    icon: "⚠", label: "Risk Analysis" },
  { href: "/reports", icon: "✦", label: "AI Reports" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-base)", overflow: "hidden" }}>
      {/* === SIDEBAR === */}
      <aside style={{
        width: 224,
        minWidth: 224,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #00C7A9, #00a88e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: "#0d1117",
            }}>⬡</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: 0.5 }}>
                Security Assistant
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 1 }}>Risk Mangagement.</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, color: "var(--text-muted)", padding: "6px 10px 4px", textTransform: "uppercase" }}>
            Menu
          </div>
          {NAV_ITEMS.map(({ href, icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-hover)" : "transparent",
                borderLeft: active ? "2px solid var(--accent-cyan)" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom / Status */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
          {/* Scan status pill */}
          <div style={{
            background: "rgba(82,196,26,0.08)",
            border: "1px solid rgba(82,196,26,0.2)",
            borderRadius: 8,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "var(--risk-low)",
              boxShadow: "0 0 0 2px rgba(82,196,26,0.3)",
              animation: "pulse-glow 2s infinite",
            }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Scanner Online</span>
          </div>

          <button onClick={handleLogout} style={{
            width: "100%",
            padding: "8px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text-muted)",
            fontSize: 12,
            cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--risk-critical)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,77,79,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* === MAIN === */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{
          height: 56,
          minHeight: 56,
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Last scan: <span style={{ color: "var(--text-secondary)" }}>2026-03-27 18:30 KST</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              padding: "4px 12px",
              background: "rgba(255,77,79,0.1)",
              border: "1px solid rgba(255,77,79,0.25)",
              borderRadius: 999,
              fontSize: 12,
              color: "var(--risk-critical)",
              fontWeight: 600,
              animation: "pulse-glow 2.5s infinite",
            }}>
              ● 8 Critical
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #00C7A9, #00a88e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>A</div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
