import * as CLASSES from "./package";

import { TypedJSON } from 'typedjson';
import * as ClassTransformer from "class-transformer";


export function plainToClass(params: object): CLASSES.Package {
    let res = ClassTransformer.plainToClass(CLASSES.Package, params);
    if (!res)
        throw new Error("package does not follow schema");

    return res;
}

export function classToPlain(value: CLASSES.Package) {
    return ClassTransformer.classToPlain(value);
}