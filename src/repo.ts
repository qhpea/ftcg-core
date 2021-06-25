import 'reflect-metadata';

import * as PACKAGE from "./package";

export interface DownloadStats{
    total: number;
    weekly: number;
}

export interface RepoStats {
    numPackages: number;
    numAssets: number;
    size: number;
    downloads: DownloadStats;
}
export interface PackageStats {
    packageId: PACKAGE.PackageId;
    /**
     * number
     */
    avgRating: number;
    numStars: number;
    size: number;
    downloads: DownloadStats;
}

export interface Repo {
    getPackage(ref: PACKAGE.PackageRef) : Promise<PACKAGE.Package>
    index() : Promise<PACKAGE.PackageRef[]>
    packages() : AsyncGenerator<PACKAGE.Package>
    search(query: string): AsyncGenerator<PACKAGE.PackageRef>
    share(source : PACKAGE.PackageSource): Promise<boolean>
    yank(ref: PACKAGE.PackageRef) : Promise<boolean>
    person(id: string): Promise<PACKAGE.Person>
    createScope(name: string) : Promise<boolean>
    versions(id: PACKAGE.PackageId) : Promise<PACKAGE.PackageRef[]>
    getStatistics(): Promise<RepoStats>

    download(ref : PACKAGE.PackageRef): Promise<PACKAGE.PackageSource>
    rate(id : PACKAGE.PackageId, stars: number) : Promise<void>
    star(id : PACKAGE.PackageId, value: boolean) : Promise<void>

}
