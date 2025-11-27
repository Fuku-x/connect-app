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

export interface PortfolioUser {
  id: number;
  name: string;
  profile_image?: string | null;
  department?: string | null;
}

export interface PortfolioRecord {
  id?: number;
  user_id?: number;
  title: string;
  description?: string;
  skills?: string[];
  projects?: PortfolioProject[];
  links?: PortfolioLink[];
  is_public?: boolean;
  thumbnail_path?: string | null;
  thumbnail_url?: string | null;
  gallery_images?: string[];
  gallery_image_urls?: string[];
  github_url?: string | null;
  external_url?: string | null;
  user?: PortfolioUser;
  created_at?: string;
  updated_at?: string;
}

export type PortfolioFormValues = {
  title: string;
  description?: string;
  skills: string[];
  projects: PortfolioProject[];
  links: PortfolioLink[];
  is_public: boolean;
  thumbnail_path?: string | null;
  gallery_images: string[];
  github_url?: string;
  external_url?: string;
};

export interface PortfolioMediaUpload {
  path: string;
  url: string;
}
