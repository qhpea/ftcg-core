import 'reflect-metadata';
import { ArrayMaxSize, ArrayUnique, isArray, IsBoolean, IsHash, IsMimeType, IsNumber, IsObject, IsOptional, IsString, isString, IsUrl, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude, plainToClass, Transform, TransformationType, TransformClassToPlain, TransformFnParams, Type } from 'class-transformer';
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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


function BiTransformer(cls: any) {
  return Transform((params: TransformFnParams) => {
    const value = params.value;
    switch (params.type) {
      case TransformationType.CLASS_TO_PLAIN:
        return cls.serializer(value)
      case TransformationType.PLAIN_TO_CLASS:
        return cls.deserializer(value)
      default:
        throw new Error("so that's when it happens");
    }
  })
}

function BiTransformerArray(cls: any) {
  return Transform((params: TransformFnParams) => {
    const values = params.value;
    if (!values) return values;
    return values.map((value: any) => {
      switch (params.type) {
        case TransformationType.CLASS_TO_PLAIN:
          return cls.serializer(value)
        case TransformationType.PLAIN_TO_CLASS:
          return cls.deserializer(value)
        default:
          throw new Error("so that's when it happens");
      }
    });

  })
}

export class File {
  @PrimaryGeneratedColumn()
  id?: string;

  @IsString()
  @Column()
  @Prop()
  path: string;


  @IsNumber()
  @Column()
  @Prop()
  size: number;
  /**
   * A sha256 of the file.
   */


  @Column()
  @Prop()
  hash: string;


  @IsMimeType()
  @Column()
  @Prop()
  conentType: string;

  constructor(path: string, size: number, hash: string, conentType: string) {
    this.path = path;
    this.size = size;
    this.hash = hash;
    this.conentType = conentType;
  }
}




export class Version {
  @IsInt()
  @Column()
  @Prop()
  major: number;

  @IsInt()
  @Column()
  @Prop()
  minor: number;

  @IsInt()
  @Column()
  @Prop()
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

export class PackageId {
  @MaxLength(32)
  @Column()
  @Prop()
  public scope: string;

  @MaxLength(32)
  @Column()
  @Prop()
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

export class Funding {
  @IsUrl()
  @Column()
  @Prop()
  public url: string;

  @MaxLength(32)
  @Column()
  @Prop()
  public kind: string;
  constructor(url: string, kind: string = "unspecified") {
    this.url = url;
    this.kind = kind;
  }



}

@Schema()
@Entity()

export class User {

  /// todo: should not be optional
  @Prop()
  @IsOptional()
  @IsUUID()
  @Prop()
  @Column()
  public id: string;
  @Prop()
  @MaxLength(32)
  @Prop()
  @Column()
  public name: string;
  @Prop()
  @IsOptional()
  @IsEmail()
  @Prop()
  @Column()
  public email?: string;
  @Prop()
  @IsOptional()
  @IsUrl()
  @Prop()
  @Column()
  public website?: string;

  @IsOptional() @ValidateNested()
  @Prop() @BiTransformer(Funding) @Column(type => Funding)
  public funding?: Funding;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}


export class PackageRef {

  @ValidateNested()
  @Prop() @BiTransformer(PackageId)  @Column(type => PackageId)
  public name: PackageId;

  public version: Version;

  @Prop() @Column()
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


export class Asset {
  @PrimaryGeneratedColumn()
  id!: string;

  @MaxLength(32)
  @Column()
  public name: string = "default";

  @MaxLength(32)
  @Column()
  public kind: string = "other";


  @IsObject()
  @Column()
  public data: Metadata = {};

  @IsObject()
  @Column()
  public info: Metadata = {};

  @ValidateNested()
  @BiTransformerArray(PackageRef)
  public dependencies: PackageRef[] = [];
}


export class Tag {

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


@Schema()
export class Package {

  @ValidateNested()
  @Prop()
  @BiTransformer(Version)
  public format: Version = new Version(1);

  @ValidateNested()
  @Prop()
  @BiTransformer(Version)
  public version: Version = new Version(0, 0, 1);


  @ValidateNested()
  @BiTransformer(PackageId)
  @Prop()
  public name: PackageId;

  @IsBoolean()
  @Prop()
  public nsfw: boolean = false;

  @MaxLength(64)
  @Prop()
  public title: string = "untitled";

  @IsString()
  @Prop()
  public thumbnail?: string;

  @IsDate()
  @Prop()
  @Type(() => Date)
  public created: Date = new Date();

  @IsDate()
  @Prop()
  @Type(() => Date)
  public updated: Date = new Date();

  @IsBoolean()
  @Prop()
  public share: boolean = true;

  @IsString() @IsOptional()
  @MaxLength(256)
  @Prop()
  public description?: string;

  @IsOptional()
  @IsUrl()
  @Prop()
  public website?: string;


  /**
   * spdx licence expression
   */
  @IsString()
  @Prop()
  public license: string = "UNLICENSED";

  @ValidateNested()
  //@BiTransformerArray(Person)
  public authors: User[] = [];

  @ValidateNested()
  @BiTransformerArray(PackageId)
  public basedOn: PackageId[] = [];

  @IsOptional()
  @ValidateNested()
  @Prop()
  @BiTransformer(Funding)
  public funding?: Funding;

  @ValidateNested()
  @ArrayMaxSize(10)
  @ArrayUnique(Tag.serializer)
  @BiTransformerArray(Tag)
  @Prop()
  public tags: Tag[] = [];

  @ValidateNested()
  @Prop()
  @BiTransformerArray(PackageId)
  public assets: Asset[] = [];

  get id() {
    return PackageRef.serializer(new PackageRef(this.name, this.version))
  }

  constructor(name: PackageId) {
    this.name = name;
  }

  //dependencies?: string[];
}

@Schema()

export class PackageSource {
  @ValidateNested()
  @Prop()
  @BiTransformer(PackageRef)
  ref: PackageRef;

  @IsUrl({ require_valid_protocol: false, require_protocol: true })
  @Prop()
  source: string;

  constructor(ref: PackageRef, source: string) {
    this.ref = ref;
    this.source = source;
  }
}

// 
// export interface PackageData {
//   
//   package: Package;

//   @jsonArrayMember(File)
//   files: File[] = []

//   tsConstructorType
// }