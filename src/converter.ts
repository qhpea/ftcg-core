import * as CLASSES from "./classes";
import * as INTERFACE from "./interface";

import { TypedJSON } from 'typedjson';

const serializer = new TypedJSON(CLASSES.Package);

export function parse(params: any): INTERFACE.Package {
    let res = serializer.parse(params);
    if (!res)
        throw new Error("package does not follow schema");

    return res;
}

export function serialize(value: INTERFACE.Package) {
    return serializer.toPlainJson(value);
}