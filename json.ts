export type Metadata = any;

export interface Asset {
  size?: number;
  name: string;
  kind: string;
  metadata?: Metadata;
  info?: Metadata;
  files?: File[];
  dependencies?: string[]
}

export interface File {
  name: string;
  size?: number;
  hash?: string;
}

export interface Funding {
  url: string;
  kind: string;
}

export interface Person {
  name: string;
  email?: string;
  website?: string;
}

export interface Package {
  nsfw?: boolean;
  id: string;
  format: string | number;
  title: string;
  thumbnail: string;
  created: string;
  updated: string;
  share: boolean;
  assets: Asset[];
  description: string;
  website: string;
  license: string;
  author: Person;
  basedOn?: string[];
  funding: Funding;
  //dependencies?: string[];
}
