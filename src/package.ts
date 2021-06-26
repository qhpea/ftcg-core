import 'reflect-metadata';
import { jsonObject, jsonArrayMember, jsonMember, TypedJSON } from 'typedjson';
import { ArrayMaxSize, ArrayUnique, isArray, IsBoolean, IsHash, IsMimeType, IsNumber, IsObject, IsOptional, IsString, isString, IsUrl, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsDate,
  Min,
  Max,
} from 'class-validator';

export type Metadata = any;


@jsonObject
export class File {
  @IsString()
  @jsonMember
  path: string;

  @jsonMember
  @IsNumber()
  size: number;
  /**
   * A sha256 of the file.
   */

  @jsonMember
  @IsHash("sha256")
  hashSha256: string;

  @jsonMember
  @IsMimeType()
  conentType: string;

  constructor(path: string, size: number, hash: string, conentType: string) {
    this.path = path;
    this.size = size;
    this.hashSha256 = hash;
    this.conentType = conentType;
  }
}



@jsonObject
export class Version {
  @IsInt()
  @jsonMember
  major: number;

  @IsInt()
  @jsonMember
  minor: number;

  @IsInt()
  @jsonMember
  patch: number;

  constructor(major = 0, minor = 0, patch = 0) {
    this.major = major || 0;
    this.minor = minor || 0;
    this.patch = patch || 0;
  }

  static deserializer(json: any) {
    if (isString(json)) {
      const parts = json.split('.').map(parseInt);
      return new Version(parts[0], parts[1], parts[2]);
    }
    if (isArray(json)) {
      return new Version(json[0], json[1], json[2]);
    }
    throw new Error("invalid version");
  }

  static serializer(value: Version | undefined | null) {
    return value ? `${value.major}.${value.minor}.${value.patch}` : value;
  }

}

TypedJSON.mapType(Version, Version)


@jsonObject
export class PackageId {
  @MaxLength(32)
  @jsonMember
  public scope: string;

  @MaxLength(32)
  @jsonMember
  public name: string;

  constructor(
    scope: string, name: string
  ) {
    this.scope = scope;
    this.name = name;
  }

  static deserializer(json: any) {
    if (isString(json)) {
      const parts = json.split('/');
      return new PackageId(parts[0], parts[1]);
    }
    throw new Error("invalid package id");
  }

  static serializer(value: PackageId | undefined | null) {
    return value ? `${value.scope}/${value.name}` : value;
  }
}

TypedJSON.mapType(PackageId, PackageId)

@jsonObject
export class Funding {
  @IsUrl()
  @jsonMember
  public url: string;

  @MaxLength(32)
  @jsonMember
  public kind: string;
  constructor(url: string, kind: string = "unspecified") {
    this.url = url;
    this.kind = kind;
  }



}

@Schema()
@jsonObject
export class Person {

  /// todo: should not be optional
  @Prop()
  @IsOptional()
  @IsUUID()
  @jsonMember @Prop()
  public id: string;
  @Prop()
  @MaxLength(32)
  @jsonMember @Prop()
  public name: string;
  @Prop()
  @IsOptional()
  @IsEmail()
  @jsonMember @Prop()
  public email?: string;
  @Prop()
  @IsOptional()
  @IsUrl()
  @jsonMember @Prop()
  public website?: string;
  @Prop()
  @IsOptional()
  @ValidateNested()
  @jsonMember @Prop()
  public funding?: Funding;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@jsonObject
export class PackageRef {
  @jsonMember
  public name: PackageId;
  @jsonMember
  public version: Version;
  @jsonMember
  public asset?: string;

  constructor(name: PackageId, version: Version, asset?: string) {
    this.name = name;
    this.version = version;
    this.asset = asset;
  }

  static deserializer(json: any) {
    if (isString(json)) {
      const parts = json.split('@');
      let id = PackageId.deserializer(parts[0]);
      const versionAsset = parts[1].split('#')
      const version = Version.deserializer(versionAsset[0]);
      const asset = versionAsset[1];
      return new PackageRef(new PackageId(id.scope, id.name), version, asset);
    }
    throw new Error("invalid package id");
  }

  static serializer(value: PackageRef | undefined | null): string {
    if (!value)
      return <string><any>value;
    let out = `${PackageId.serializer(value.name)}@${Version.serializer(value.version)}`;
    if (value.asset)
      out = `${out}#${value.asset}`
    return out;
  }
}
TypedJSON.mapType(PackageRef, PackageRef)

@jsonObject
export class Asset {
  @MaxLength(32)
  @jsonMember
  public name: string = "default";

  @MaxLength(32)
  @jsonMember
  public kind: string = "other";


  @IsObject()
  @jsonMember
  public data: Metadata = {};

  @IsObject()
  @jsonMember
  public info: Metadata = {};

  @ValidateNested()
  @jsonArrayMember(PackageRef)
  public dependencies: PackageRef[] = [];
}

@jsonObject
export class Tag {
  @jsonMember
  public id: string;
  constructor(name: string) {
    this.id = name;
  }

  static deserializer(json: any) {
    return new Tag(json);
  }

  static serializer(value: Tag | undefined | null) {
    return value ? value.id : value;
  }
}

TypedJSON.mapType(Tag, Tag)

@Schema()
@jsonObject({ onDeserialized: "onDeserialized" })
export class Package {

  @ValidateNested()
  @jsonMember @Prop()
  public format: Version = new Version(1);

  @ValidateNested()
  @jsonMember @Prop()
  public version: Version = new Version();


  @ValidateNested()
  @jsonMember @Prop()
  public name: PackageId;

  @IsBoolean()
  @jsonMember @Prop()
  public nsfw: boolean = false;

  @MaxLength(64)
  @jsonMember @Prop()
  public title: string = "untitled";

  @IsString()
  @jsonMember @Prop()
  public thumbnail?: string;

  @IsDate()
  @jsonMember @Prop()
  public created: Date = new Date();

  @IsDate()
  @jsonMember @Prop()
  public updated: Date = new Date();

  @IsBoolean()
  @jsonMember @Prop()
  public share: boolean = true;

  @IsString()  @IsOptional()
  @MaxLength(256)
  @jsonMember @Prop()
  public description?: string;

  @IsOptional()
  @IsUrl()
  @jsonMember @Prop()
  public website?: string;


  /**
   * spdx licence expression
   */
  @IsString()
  @jsonMember @Prop()
  public license: string = "UNLICENSED";

  @ValidateNested()
  @jsonArrayMember(Person) @Prop()
  public authors: Person[] = [];

  @ValidateNested()
  @jsonArrayMember(PackageId) @Prop()
  public basedOn: PackageId[] = [];

  @IsOptional()
  @ValidateNested()
  @jsonMember @Prop()
  public funding?: Funding;

  @ValidateNested()
  @ArrayMaxSize(10)
  @ArrayUnique(Tag.serializer)
  @jsonArrayMember(Tag) @Prop()
  public tags: Tag[] = [];

  @ValidateNested()
  @jsonArrayMember(Asset) @Prop()
  public assets: Asset[] = [];
  
  @Prop()
  id!: string;

  constructor(name: PackageId) {
    this.name = name;
    this.onDeserialized();
  }

  onDeserialized() {
    const id = PackageRef.serializer(new PackageRef(this.name, this.version));
    this.id = id;
  }
  //dependencies?: string[];
}

@Schema()
@jsonObject
export class PackageSource {
  @ValidateNested()
  @jsonMember @Prop()
  ref: PackageRef;

  @IsUrl({ require_valid_protocol: false, require_protocol: true })
  @jsonMember @Prop()
  source: string;

  constructor(ref: PackageRef, source: string) {
    this.ref = ref;
    this.source = source;
  }
}

// @jsonObject
// export interface PackageData {
//   @jsonMember
//   package: Package;

//   @jsonArrayMember(File)
//   files: File[] = []

//   tsConstructorType
// }