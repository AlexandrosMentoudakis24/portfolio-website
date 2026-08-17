export type Readout = {
  label: string;
  value: string;
  valueClass?: "teal" | "amber" | "";
};

export type AboutFact = {
  label: string;
  value: string;
};

export type Skill = {
  name: string;
  years: string;
  fill: number;
};

export type SkillGroup = {
  title: string;
  skills: Skill[];
};

export type Experience = {
  hash: string;
  date: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  name: string;
  description: string;
  metrics: ProjectMetric[];
  tags: string[];
  repoUrl: string;
  liveUrl: string;
};

export type Social = {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "email";
};

export type NavItem = {
  label: string;
  href: string;
  num: string;
};

export type PortfolioData = {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  statusText: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroAccent: string;
  heroSub: string;
  readouts: Readout[];
  aboutParagraphs: string[];
  aboutFacts: AboutFact[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  contactTitle: string;
  contactCommand: string;
  socials: Social[];
  buildTag: string;
  nav: NavItem[];
  year: number;
  deployDate: string;
};

/**
 * Data source for the public site. Fetches the live portfolio from the
 * portfolio server. If the server is unreachable the call throws so the page
 * can show an "under construction" state instead of rendering stale data.
 */
export async function getPortfolio(): Promise<PortfolioData> {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${SERVER_URL}/api/portfolio`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`Portfolio API responded ${res.status}`);
    }
    const data = (await res.json()) as Partial<PortfolioData>;
    return {
      ...(data as PortfolioData),
      year: data.year ?? new Date().getFullYear(),
      deployDate:
        data.deployDate ??
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export type ResumeStatus = {
  exists: boolean;
  filename: string | null;
  url: string | null;
};

/**
 * Reports whether a downloadable résumé PDF has been uploaded to the server.
 * Returns the absolute download URL (same server that serves the API) so the
 * public site can link to it directly.
 */
export async function getResumeStatus(): Promise<ResumeStatus> {
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${SERVER_URL}/api/resume/status`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { exists: false, filename: null, url: null };
    const data = (await res.json()) as {
      exists: boolean;
      filename: string | null;
    };
    return {
      exists: data.exists,
      filename: data.filename,
      url: data.exists ? `${SERVER_URL}/api/resume` : null,
    };
  } catch {
    clearTimeout(timeout);
    return { exists: false, filename: null, url: null };
  }
}