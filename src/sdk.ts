import 'reflect-metadata';

import * as INTERFACE from "./package";

interface Repo {
    getPackage(ref: INTERFACE.PackageRef) : Promise<INTERFACE.Package>
    index() : Promise<INTERFACE.PackageRef[]>
    packages() : AsyncGenerator<INTERFACE.Package>
    search(query: string): AsyncGenerator<INTERFACE.PackageRef>
    share(source : INTERFACE.PackageSource): Promise<boolean>
    yank(ref: INTERFACE.PackageRef) : Promise<boolean>
    person(id: string): Promise<INTERFACE.Person>
    createScope(name: string) : Promise<boolean>
}
