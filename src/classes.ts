import 'reflect-metadata';
import { jsonObject, jsonArrayMember, jsonMember, TypedJSON } from 'typedjson';
import { isString } from 'class-validator';
import * as PACKAGE from "./package";


export type Metadata = any;
export type Version = number;

@jsonObject
export class PackageId implements PACKAGE.PackageId {
    @jsonMember
    public scope: string;
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
export class Funding implements PACKAGE.Funding {
    @jsonMember
    public url: string;
    @jsonMember
    public kind: string;
    constructor(url: string, kind: string = "unspecified") {
        this.url = url;
        this.kind = kind;
    }



}

@jsonObject
export class Person implements PACKAGE.Person {
    @jsonMember
    public id: string;
    @jsonMember
    public name: string;
    @jsonMember
    public email?: string;
    @jsonMember
    public website?: string;
    @jsonMember
    public funding?: Funding;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

@jsonObject
export class PackageRef implements PACKAGE.PackageRef {
    @jsonMember
    public scope: string;
    @jsonMember
    public name: string;
    @jsonMember
    public version: Version;
    @jsonMember
    public asset?: string;

    constructor(scope: string, name: string, version: Version, asset?: string) {
        this.scope = scope;
        this.name = name;
        this.version = version;
        this.asset = asset;
    }

    static deserializer(json: any) {
        if (isString(json)) {
            const parts = json.split('@');
            let id = PackageId.deserializer(parts[0]);
            const versionAsset = parts[1].split('#')
            const version = parseInt(versionAsset[0]) || 0;
            const asset = versionAsset[1];
            return new PackageRef(id.scope, id.name, version, asset);
        }
        throw new Error("invalid package id");
    }

    static serializer(value: PackageRef | undefined | null) {
        if (!value)
            return value;
        let out = `${value.scope}/${value.name}@${value.version}`;
        if (value.asset)
            out = `${out}#${value.asset}`
        return out;
    }
}
TypedJSON.mapType(PackageRef, PackageRef)

@jsonObject
export class Asset implements PACKAGE.Asset {
    @jsonMember
    public name: string = "default";

    @jsonMember
    public kind: string = "other";

    @jsonMember
    public data: Metadata;
    @jsonMember
    public info: Metadata;

    @jsonArrayMember(PackageRef)
    public dependencies: PackageRef[] = [];
}

@jsonObject
export class Tag implements PACKAGE.Tag {
    @jsonMember
    public name: string;
    constructor(name: string) {
        this.name = name;
    }

    static deserializer(json: any) {
        return new Tag(json);
    }

    static serializer(value: Tag | undefined | null) {
        return value ? value.name : value;
    }
}

TypedJSON.mapType(Tag, Tag)

@jsonObject
export class Package implements PACKAGE.Package {

    @jsonMember
    public format: Version = 1;
    @jsonMember

    public version: Version = 0;
    @jsonMember
    public name: PackageId;
    @jsonMember
    public nsfw: boolean = false;
    @jsonMember
    public title: string = "untitled";

    @jsonMember
    public thumbnail: string = "https://ftcg.com/missing.svg";

    @jsonMember
    public created: Date = new Date();

    @jsonMember
    public updated: Date = new Date();

    @jsonMember
    public share: boolean = true;
    @jsonMember
    public description: string = "For the common good!";
    @jsonMember
    public website?: string;


    /**
     * spdx licence expression
     */
    @jsonMember
    public license: string = "UNLICENSED";

    @jsonArrayMember(Person)
    public authors: Person[] = [];

    @jsonArrayMember(PackageId)
    public basedOn: PackageId[] = [];

    @jsonMember
    public funding?: Funding;

    @jsonArrayMember(Tag)
    public tags: Tag[] = [];

    @jsonArrayMember(Asset)
    public assets: Asset[] = [];

    constructor(name: PackageId) {
        this.name = name;

    }
    //dependencies?: string[];
}