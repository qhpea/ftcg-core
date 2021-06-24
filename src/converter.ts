import * as CLASSES from "./package";

import { TypedJSON } from 'typedjson';

const serializer = new TypedJSON(CLASSES.Package);

export function parse(params: any): CLASSES.Package {
    let res = serializer.parse(params);
    if (!res)
        throw new Error("package does not follow schema");

    return res;
}

export function serialize(value: CLASSES.Package) {
    return serializer.toPlainJson(value);
}