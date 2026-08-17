"use client";

import { useEffect } from "react";

export default function SiteInteractions() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------------- BOOT SEQUENCE ---------------- */
    const bootEl = document.getElementById("boot");
    const logEl = document.getElementById("boot-log");
    const lines = [
      { t: "$ initializing portfolio environment", ok: false },
      { t: "$ loading profile: alex-mentoudakis.dev", ok: false },
      { t: "  ✓ resolved identity, skills, history", ok: true },
      { t: "$ mounting sections [about, stack, experience, projects, contact]", ok: false },
      { t: "  ✓ 5 sections mounted", ok: true },
      { t: "$ status: ready — welcome", ok: true },
    ];

    function runBoot() {
      if (!bootEl || !logEl) return;
      const boot = bootEl;
      const log = logEl;
      if (reduceMotion) {
        boot.classList.add("hidden");
        return;
      }
      let i = 0;
      function next() {
        if (i >= lines.length) {
          setTimeout(() => {
            boot.classList.add("hidden");
            window.dispatchEvent(new Event("boot-complete"));
          }, 420);
          return;
        }
        const l = document.createElement("div");
        l.className = "line" + (lines[i].ok ? " ok" : "");
        l.textContent = lines[i].t;
        log.appendChild(l);
        i++;
        setTimeout(next, 260);
      }
      setTimeout(next, 200);
    }
    runBoot();

    /* ---------------- STATUS BAR: uptime + ping ---------------- */
    const startTime = Date.now();
    const uptimeEl = document.getElementById("uptime");
    const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
    function tickUptime() {
      if (!uptimeEl) return;
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(diff / 3600),
        m = Math.floor((diff % 3600) / 60),
        s = diff % 60;
      uptimeEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
    }
    const uptimeTimer = setInterval(tickUptime, 1000);
    tickUptime();

    const pingEl = document.getElementById("ping");
    function tickPing() {
      if (!pingEl) return;
      pingEl.textContent = "" + (14 + Math.floor(Math.random() * 22));
    }
    const pingTimer = setInterval(tickPing, 3500);
    tickPing();

    /* ---------------- HEADER scroll state ---------------- */
    const header = document.getElementById("siteheader");
    function onScrollHeader() {
      if (!header) return;
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScrollHeader);
    onScrollHeader();

    /* ---------------- MOBILE MENU ---------------- */
    const toggle = document.getElementById("menu-toggle");
    const mmenu = document.getElementById("mobile-menu");
    function onToggle() {
      if (mmenu) mmenu.classList.toggle("open");
    }
    if (toggle) toggle.addEventListener("click", onToggle);
    if (mmenu) {
      mmenu.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => mmenu.classList.remove("open"));
      });
    }

    /* ---------------- NAV active link on scroll ---------------- */
    const navLinks = document.querySelectorAll<HTMLAnchorElement>("[data-nav]");
    const sections = ["about", "skills", "experience", "projects", "contact"]
      .map((id) => document.getElementById(id));
    function updateActiveNav() {
      const pos = window.scrollY + 140;
      let current: string | null = null;
      sections.forEach((sec) => {
        if (sec && sec.offsetTop <= pos) current = sec.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle(
          "active",
          a.getAttribute("href") === "#" + current
        );
      });
    }
    window.addEventListener("scroll", updateActiveNav);
    updateActiveNav();

    /* ---------------- SCROLL REVEAL ---------------- */
    const revealEls = document.querySelectorAll(".reveal, .stagger");
    if (reduceMotion) {
      revealEls.forEach((el) => {
        el.classList.add("in");
      });
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => {
        io.observe(el);
      });
    } else {
      revealEls.forEach((el) => {
        el.classList.add("in");
      });
    }

    /* ---------------- SKILL BAR FILL on scroll into view ---------------- */
    const bars = document.querySelectorAll<HTMLElement>(".bar-fill");
    if ("IntersectionObserver" in window) {
      const barIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              el.style.width = el.getAttribute("data-fill") + "%";
              barIo.unobserve(el);
            }
          });
        },
        { threshold: 0.4 }
      );
      bars.forEach((b) => {
        barIo.observe(b);
      });
    } else {
      bars.forEach((b) => {
        b.style.width = b.getAttribute("data-fill") + "%";
      });
    }

    /* ---------------- PROJECT CARD glow follows cursor ---------------- */
    const cards = document.querySelectorAll<HTMLElement>(".project-card");
    const cardHandlers: Array<(e: MouseEvent) => void> = [];
    cards.forEach((card) => {
      const handler = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty(
          "--mx",
          ((e.clientX - r.left) / r.width) * 100 + "%"
        );
        card.style.setProperty(
          "--my",
          ((e.clientY - r.top) / r.height) * 100 + "%"
        );
      };
      card.addEventListener("mousemove", handler);
      cardHandlers.push(handler);
    });

    return () => {
      clearInterval(uptimeTimer);
      clearInterval(pingTimer);
      window.removeEventListener("scroll", onScrollHeader);
      window.removeEventListener("scroll", updateActiveNav);
      if (toggle) toggle.removeEventListener("click", onToggle);
      cards.forEach((card, idx) => {
        card.removeEventListener("mousemove", cardHandlers[idx]);
      });
    };
  }, []);

  return null;
}
