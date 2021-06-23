import { isString } from 'class-validator';
import * as JSCHEMA from './json';
import * as PACKAGE from './package';

export class Version {
  static fromJson(vs: string) {
    if (!vs) return undefined;
    const vp = vs.split('.');
    const v = new Version(
      parseInt(vp[0]) || 0,
      parseInt(vp[1]) || 0,
      parseInt(vp[2]) || 0,
    );
    return v;
  }

  /**
   * semver version
   */
  constructor(
    public major: number = 1,
    public minor: number = 0,
    public patch: number = 0,
  ) { }

  toString() {
    return this.major;
    //return `${this.major}.${this.minor~}.${this.patch}`;
  }

  toJson() {
    return this.toString();
  }
}

export class PackageRef {
  static fromJson(id: string) {
    if (!id) return undefined;
    const versionAndRest = id.split('@');
    const version = Version.fromJson(versionAndRest[1]);

    const parts = versionAndRest[0].split('/');
    const pid = new PackageRef(parts[0], parts[1], version, parts[2]);
    return pid;
  }

  constructor(
    public scope: string,
    public name: string,
    public version?: Version,
    public part?: string,
  ) { }

  toJson() {
    let acc = `${this.scope}/${this.name}`;
    if (this.part)
      acc = `${acc}/${this.part}`
    if (this.version)
      acc = `${acc}@${this.version.toJson()}`
    return acc;
  }
}

export class Funding implements JSCHEMA.Funding {
  constructor(public url: string, public kind: string) { }

  static fromJson(id: any) {
    if (!id) return undefined;
    return new Funding(id.url, id.kind);
  }

  toJson() {
    return this;
  }
}

export class Author {
  static fromJson(author: any): Author {
    return new Author(
      author.name,
      author.email,
      author.website,
      author.role,
      Funding.fromJson(author.funding)
    )
  }
  constructor(
    public name: string,
    public email?: string,
    public website?: string,
    public role?: string[],
    public funding?: Funding,
  ) { }
  toJson() {
    return this;
  }
}

export class PackageMeta {
  package: Package;
  sources: string;
}

export class Package {
  id: PackageRef;
  title: string;
  thumbnail: string;
  created: Date;
  updated?: Date;
  share: boolean;
  nsfw: boolean;
  description?: string;
  website: string;
  license: string;
  authors: Author[];
  assets: Asset[] = [];

  funding: Funding;
  basedOn: PackageRef[];
  tags: string[];

  static fromJson(o: any) {
    // SCHEMA.Package
    const pack = new Package();
    pack.id = PackageRef.fromJson(o.id);
    //pack.id.version = undefined;
    pack.title = o.title;
    pack.thumbnail = o.thumbnail;
    pack.created = new Date(o.created);
    if (o.updated) pack.updated = new Date(o.updated);
    pack.share = o.share || false;
    pack.nsfw = o.nsfw || false;
    pack.description = o.description;
    pack.website = o.website;
    pack.license = o.license;

    pack.authors = [Author.fromJson(o.author)];
    pack.assets = o.assets.map(Asset.fromJson);
    pack.funding = Funding.fromJson(o.funding);
    pack.basedOn = o.basedOn ? o.basedOn.map(PackageRef.fromJson) : [];
    pack.tags = o.tags || [];
    return pack;
  }

  toYaml() {
    return {
      format: new Version(1).toJson(),
      version: this.id.version.toJson(),
      name: `${this.id.scope}/${this.id.name}`,
      title: this.title,
      thumbnail: this.thumbnail,
      created: this.created.toISOString(),
      updated: this.updated.toISOString(),
      share: this.share,
      nsfw: this.nsfw,
      description: this.description,
      website: this.website,
      license: this.license,
      authors: this.authors.map(x=>x.toJson()),
      basedOn: this.basedOn.map(x=>x.toJson()),
      funding: this.funding,
      tags: this.tags,
      assets: this.assets.map(x=>x.toYaml())
    };
  }

  toJson(): JSCHEMA.Package {
    return {
      id: this.id.toJson(),
      format: new Version(1).toJson(),
      title: this.title,
      thumbnail: this.thumbnail,
      created: this.created.toISOString(),
      updated: this.updated.toISOString(),
      share: this.share,
      nsfw: this.nsfw,
      assets: this.assets.map(a => a.toJson()),
      description: this.description,
      website: this.website,
      license: this.license,
      author: this.authors[0].toJson(),
      basedOn: this.basedOn.map(x=>x.toJson()),
      funding: this.funding.toJson()
    };
  }
}

export class File implements JSCHEMA.File {
  constructor(
    public name: string,
    public size?: number,
    public hash?: string,
    public mime?: string,
  ) { }

  /**
   * from json
   */
  static fromJson(from) {
    if (isString(from)) {
      return new File(from);
    }
    const file = new File(from.name, from.size, from.hash);
    return file;
  }

  toJson() {
    return this;
  }
}

export enum WellKnownAssetKinds {
  ImageJpeg = 'image/jpeg',
}

export class Asset {
  constructor(
    public name: string,
    public kind: string,
    public info: any,
    public size: number,
    public files: File[]
  ) { }
  toJson(): JSCHEMA.Asset {
    return {
      name: this.name,
      kind: this.kind,
      info: this.info,
      size: this.size,
      files: this.files ? this.files.map(x => x.toJson()) : undefined
    };
  }
  toYaml(): JSCHEMA.Asset {
    delete this.info.kind;
    return {
      name: this.name,
      kind: this.kind,
      info: this.info,
    };
  }
  static fromJson(_stuff: JSCHEMA.Asset) {
    return new Asset(
      _stuff.name,
      _stuff.kind,
      _stuff.info || _stuff.metadata,
      _stuff.size,
      _stuff.files ? _stuff.files.map(File.fromJson) : undefined
    );
  }
}
