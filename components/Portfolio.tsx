import type { PortfolioData, ResumeStatus } from "@/lib/portfolio";
import SiteInteractions from "./SiteInteractions";
import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
  ExternalLinkIcon,
  MailIcon,
  MenuIcon,
} from "./icons";

function SocialIcon({ icon }: { icon: "github" | "linkedin" | "email"; }) {
  if (icon === "github") return <GitHubIcon />;
  if (icon === "linkedin") return <LinkedInIcon />;
  return <EmailIcon />;
}

export default function Portfolio({
  data,
  resume,
}: {
  data: PortfolioData;
  resume: ResumeStatus;
}) {
  return (
    <>
      {/* BOOT SEQUENCE */}
      <div id="boot">
        <div id="boot-panel">
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div id="boot-log"></div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div id="topbar">
        <div className="container">
          <div className="status-live">
            <span>
              <span className="pulse-dot"></span>available for hire
            </span>
            <span className="sep hide-sm">/</span>
            <span className="hide-sm">
              uptime <span id="uptime">00:00:00</span>
            </span>
          </div>
          <div>
            build <span id="buildtag">{data.buildTag}</span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <header id="siteheader">
        <div className="container">
          <nav>
            <a href="#hero" className="logo">
              <span className="bracket">&lt;</span>
              {data.firstName} {data.lastName}
              <span className="bracket">/&gt;</span>
            </a>
            <div className="navlinks" id="navlinks">
              {data.nav.map((item) => (
                <a key={item.href} href={item.href} data-nav>
                  <span className="num">{item.num}</span>
                  {item.label}
                </a>
              ))}
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {resume.exists ? (
                <a
                  href={resume.url!}
                  className="btn"
                  id="desktop-resume"
                  download={resume.filename ?? "resume.pdf"}
                >
                  Résumé
                </a>
              ) : null}
              <button id="menu-toggle" type="button" aria-label="Toggle menu">
                <MenuIcon />
              </button>
            </div>
          </nav>
        </div>
      </header>
      <div id="mobile-menu">
        {data.nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.num} · {item.label}
          </a>
        ))}
      </div>

      <main>
        {/* HERO */}
        <section id="hero">
          <div className="container">
            <div className="eyebrow reveal">
              <span className="pulse-dot"></span>
              {data.heroEyebrow}
            </div>
            <h1 className="hero-name reveal">
              {data.heroHeadline}
              <span className="accent">{data.heroAccent}</span>
              <br />
              From Schema to Production.
            </h1>
            <p className="hero-sub reveal">{data.heroSub}</p>
            <div className="hero-actions reveal">
              <a href={`mailto:${data.email}`} className="btn btn-solid">
                <MailIcon />
                Get in touch
              </a>
              <a href="#projects" className="btn">
                View projects →
              </a>
              {resume.exists ? (
                <a href={resume.url!} className="btn" download={resume.filename ?? "resume.pdf"}>
                  Download résumé ↓
                </a>
              ) : null}
            </div>

            <div className="readouts reveal">
              {data.readouts.map((r) => (
                <div className="readout" key={r.label}>
                  <div className="rlabel">{r.label}</div>
                  <div
                    className={
                      "rval" +
                      (r.valueClass === "teal"
                        ? " teal"
                        : r.valueClass === "amber"
                          ? " amber"
                          : "")
                    }
                  >
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="container">
            <div className="section-head">
              <span className="section-tag mono">01 · About</span>
              <div className="section-line"></div>
            </div>
            <div className="about-grid">
              <div className="reveal">
                {data.aboutParagraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="about-facts reveal">
                {data.aboutFacts.map((f) => (
                  <div className="fact" key={f.label}>
                    <span>{f.label}</span>
                    <span>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="container">
            <div className="section-head">
              <span className="section-tag mono">02 · Stack</span>
              <div className="section-line"></div>
            </div>
            <div className="skills-grid">
              {data.skillGroups.map((group) => (
                <div className="skill-group reveal" key={group.title}>
                  <h3>{group.title}</h3>
                  {group.skills.map((s) => (
                    <div className="skill-row" key={s.name}>
                      <div className="skill-row-top">
                        <span>{s.name}</span>
                        <span className="yrs">{s.years}</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" data-fill={s.fill}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="container">
            <div className="section-head">
              <span className="section-tag mono">03 · Experience</span>
              <div className="section-line"></div>
            </div>
            <div className="timeline">
              {data.experience.map((exp) => (
                <div className="commit reveal" key={exp.hash}>
                  <div className="commit-top">
                    <span className="commit-hash">{exp.hash}</span>
                    <span className="commit-date">{exp.date}</span>
                  </div>
                  <div className="commit-role">
                    {exp.role}{" "}
                    <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                      @
                    </span>{" "}
                    <span className="commit-co">{exp.company}</span>
                  </div>
                  <p className="commit-desc">{exp.description}</p>
                  <div className="commit-tags">
                    {exp.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <div className="container">
            <div className="section-head">
              <span className="section-tag mono">04 · Projects</span>
              <div className="section-line"></div>
            </div>
            <div className="projects-grid">
              {data.projects.map((p) => (
                <div className="project-card reveal" key={p.name}>
                  <div className="project-top">
                    <div className="project-name">{p.name}</div>
                    <div className="project-links">
                      {p.repoUrl && p.repoUrl !== "#" ? (
                        <a
                          href={p.repoUrl}
                          className="icon-link"
                          aria-label={`${p.name} source on GitHub`}
                        >
                          <GitHubIcon />
                        </a>
                      ) : null}
                      {p.liveUrl && p.liveUrl !== "#" ? (
                        <a
                          href={p.liveUrl}
                          className="icon-link"
                          aria-label={`${p.name} live site`}
                        >
                          <ExternalLinkIcon />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <p className="project-desc">{p.description}</p>
                  <div className="project-metrics">
                    {p.metrics.map((m) => (
                      <div className="metric" key={m.label}>
                        <div className="mval">{m.value}</div>
                        <div className="mlabel">{m.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="container">
            <div className="section-head">
              <span className="section-tag mono">05 · Contact</span>
              <div className="section-line"></div>
            </div>
            <div className="contact-panel reveal">
              <div className="terminal-head">
                <span></span>
                <span></span>
                <span></span>
                <span className="file">~/{data.firstName.toLowerCase()}-{data.lastName.toLowerCase()}/contact.sh</span>
              </div>
              <div className="terminal-body">
                <div className="line1">
                  <span className="cmd">$</span> {data.contactCommand}
                </div>
                <h3 className="contact-title">{data.contactTitle}</h3>
                <div className="contact-actions">
                  <a
                    href={`mailto:${data.email}`}
                    className="btn btn-solid"
                  >
                    {data.email}
                  </a>
                  {resume.exists ? (
                    <a
                      href={resume.url!}
                      className="btn"
                      download={resume.filename ?? "resume.pdf"}
                    >
                      Download résumé ↓
                    </a>
                  ) : null}
                </div>
                <div className="contact-socials">
                  {data.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-chip"
                    >
                      <SocialIcon icon={s.icon} />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <span>
            © {data.year} {data.name}.
          </span>
          <span id="footer-build">
            last deployed <span id="deploy-date">{data.deployDate}</span>
          </span>
        </div>
      </footer>

      <SiteInteractions />
    </>
  );
}
