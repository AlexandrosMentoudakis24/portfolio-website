import { getPortfolio as getPortfolioFromDB } from "./models/portfolio";
import { getResumeStatus as getResumeStatusFromDB } from "./models/resume";

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
 * database directly. If the database is unreachable the call throws so the page
 * can show an "under construction" state instead of rendering stale data.
 */
export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const doc = await getPortfolioFromDB();
    if (!doc) {
      throw new Error("No portfolio found in database");
    }
    const { _id, __v, createdAt, updatedAt, ...rest } = doc as Record<
      string,
      unknown
    > & { _id: unknown; __v?: number; };
    return {
      ...(rest as Omit<PortfolioData, "year" | "deployDate">),
      year: new Date().getFullYear(),
      deployDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  } catch (err) {
    throw err;
  }
}

export type ResumeStatus = {
  exists: boolean;
  filename: string | null;
  url: string | null;
};

/**
 * Reports whether a downloadable résumé PDF has been uploaded to the database.
 * Returns the download URL for the public site to link to it directly.
 */
export async function getResumeStatus(): Promise<ResumeStatus> {
  try {
    const data = await getResumeStatusFromDB();
    return {
      exists: data.exists,
      filename: data.filename,
      url: data.exists ? "/api/resume" : null,
    };
  } catch {
    return { exists: false, filename: null, url: null };
  }
}