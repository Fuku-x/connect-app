export interface PortfolioProject {
  name: string;
  description?: string;
  url?: string;
  image?: string | null;
}

export interface PortfolioLink {
  name: string;
  url: string;
}

export interface PortfolioRecord {
  id?: number;
  user_id?: number;
  title: string;
  description?: string;
  skills?: string[];
  projects?: PortfolioProject[];
  links?: PortfolioLink[];
  created_at?: string;
  updated_at?: string;
}

export type PortfolioFormValues = Required<Pick<PortfolioRecord, 'title'>> & {
  description?: string;
  skills: string[];
  projects: PortfolioProject[];
  links: PortfolioLink[];
};
