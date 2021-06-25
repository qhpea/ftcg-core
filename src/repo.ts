import 'reflect-metadata';

import * as PACKAGE from "./package";

interface DownloadStats{
    total: number;
    weekly: number;
}

interface RepoStats {
    numPackages: number;
    numAssets: number;
    size: number;
    downloads: DownloadStats;
}
interface PackageStats {
    packageId: PACKAGE.PackageId;
    /**
     * number
     */
    avgRating: number;
    numStars: number;
    size: number;
    downloads: DownloadStats;
}

interface Repo {
    getPackage(ref: PACKAGE.PackageRef) : Promise<PACKAGE.Package>
    index() : Promise<PACKAGE.PackageRef[]>
    packages() : AsyncGenerator<PACKAGE.Package>
    search(query: string): AsyncGenerator<PACKAGE.PackageRef>
    share(source : PACKAGE.PackageSource): Promise<boolean>
    yank(ref: PACKAGE.PackageRef) : Promise<boolean>
    person(id: string): Promise<PACKAGE.Person>
    createScope(name: string) : Promise<boolean>
    versions(id: PACKAGE.PackageId) : Promise<PACKAGE.PackageRef[]>
    getRepoStatistics(): Promise<RepoStats>

    download(ref : PACKAGE.PackageRef): Promise<PACKAGE.PackageSource>
    rate(id : PACKAGE.PackageId, stars: number) : Promise<void>
    star(id : PACKAGE.PackageId, value: boolean) : Promise<void>

}
