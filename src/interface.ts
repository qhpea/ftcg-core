export type Metadata = any;
export type Version = number;

export interface Asset {
  readonly name: string;
  readonly kind: string;
  readonly data: Metadata;
  readonly info: Metadata;
  readonly dependencies: PackageRef[]
}


export interface PackageData{
  readonly package: Package;
  readonly files: File[];
  readonly source: string[];
} 

export interface File {
  readonly name: string;
  readonly size: number;
  /**
   * A multihash of the file.
   */
  readonly hash: string;
}

export interface Funding {
  readonly url: string;
  readonly kind: string;
}

export interface Tag {
  readonly name: string;
}

export interface Person {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly website?: string;
  readonly funding?: Funding;
}

export interface Package {
  readonly format: Version;
  readonly version: Version;
  readonly name: PackageId;
  readonly nsfw: boolean;
  readonly title: string;
  readonly thumbnail: string;
  readonly created: Date;
  readonly updated: Date;
  readonly share: boolean;
  readonly description: string;
  readonly website?: string;
  
  /**
   * spdx licence expression
   */
  readonly license: string;
  readonly authors: Person[];
  readonly basedOn: PackageId[];
  readonly funding?: Funding;
  readonly tags: Tag[];
  readonly assets: Asset[];

  //dependencies?: string[];
}

export interface PackageId{
  readonly scope: string,
  readonly name: string,
}

export interface PackageRef extends PackageId {
  readonly version: Version;
  readonly asset?: string;
}