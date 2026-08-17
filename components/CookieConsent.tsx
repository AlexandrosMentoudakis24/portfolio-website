"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "cookie_consent";
const CONSENT_MAX_AGE_DAYS = 365;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )(" + name + ")=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    expires +
    "; path=/; SameSite=Lax" +
    (typeof location !== "undefined" && location.protocol === "https:"
      ? "; Secure"
      : "");
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (getCookie(CONSENT_COOKIE) !== null) return;

    const handler = () => {
      setBootComplete(true);
      setShow(true);
    };
    if (document.getElementById("boot")?.classList.contains("hidden")) {
      handler();
    } else {
      window.addEventListener("boot-complete", handler, { once: true });
    }
    return () => {
      window.removeEventListener("boot-complete", handler);
    };
  }, []);

  async function recordConsent() {
    if (!SERVER_URL) return;
    try {
      await fetch(`${SERVER_URL}/api/visitor`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          consent: "accepted",
          ts: new Date().toISOString(),
        }),
      });
    } catch {
      // Best-effort: don't block the UX if the endpoint is unreachable.
    }
  }

  function accept() {
    setCookie(CONSENT_COOKIE, "accepted", CONSENT_MAX_AGE_DAYS);
    void recordConsent();
    setShow(false);
  }

  function decline() {
    setCookie(CONSENT_COOKIE, "declined", CONSENT_MAX_AGE_DAYS);
    setShow(false);
  }

  if (!show) return null;

  return (
    <>
      <div
        role="dialog"
        aria-live="polite"
        style={{
          position: "fixed",
          zIndex: 1000,
          bottom: "1.5rem",
          right: "1.5rem",
          maxWidth: "400px",
          width: "calc(100% - 3rem)",
        }}
      >
        <div
          style={{
            border: "1px solid var(--border)",
            background: "var(--panel-2)",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--font-body, system-ui)",
            color: "var(--text)",
            fontSize: "0.85rem",
            lineHeight: 1.45,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ flex: "1 1 220px", minWidth: 0 }}>
            We use cookies to record consent and basic visitor info (IP, browser, language).
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--teal)",
                textDecoration: "underline",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "inherit",
                padding: 0,
                marginLeft: "0.25rem",
              }}
            >
              Learn more
            </button>
          </span>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flex: "0 0 auto",
            }}
          >
            <button
              type="button"
              onClick={decline}
              style={{
                padding: "0.4rem 0.875rem",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                background: "transparent",
                color: "var(--text-muted)",
                fontFamily: "inherit",
                fontSize: "inherit",
                cursor: "pointer",
              }}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              style={{
                padding: "0.4rem 0.875rem",
                border: "1px solid var(--teal)",
                borderRadius: "4px",
                background: "var(--teal)",
                color: "#0a0a0a",
                fontFamily: "inherit",
                fontSize: "inherit",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          style={{
            position: "fixed",
            zIndex: 1100,
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            background: "rgba(10, 14, 23, 0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              border: "1px solid var(--border)",
              background: "var(--panel-2)",
              borderRadius: "8px",
              padding: "1.5rem",
              fontFamily: "var(--font-body, system-ui)",
              color: "var(--text)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                id="cookie-modal-title"
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                Cookie & Data Collection Details
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                  cursor: "pointer",
                  padding: "0 0.25rem",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p style={{ margin: "0 0 1rem", color: "var(--text-muted)" }}>
              When you click <strong>Accept</strong>, we record a consent event
              with the following information:
            </p>

            <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text)" }}>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>IP address</strong> (from <code>x-forwarded-for</code> or
                direct connection)
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>User Agent</strong> (browser, OS, device info)
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Accept-Language</strong> header (preferred languages)
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Referrer path</strong> (the page you were on)
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                <strong>Timestamp</strong> of consent (ISO 8601)
              </li>
            </ul>

            <p style={{ margin: "1rem 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              This data is stored in our backend database and is only accessible to
              site administrators. It is used solely to understand visitor consent
              patterns. No personal identifiers beyond what your browser sends
              automatically are collected. Declining stores a local cookie only —
              no network request is made.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
