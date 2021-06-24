import { Package, PackageId, Tag } from "../src/package";
import { jsonObject, jsonMember, TypedJSON } from 'typedjson';
import { validate } from 'class-validator';

describe("test json functionality function", () => {
    const serializer = new TypedJSON(Package);

    const id = new PackageId("help", "me");
    const pack = new Package(id);
    pack.tags = [new Tag("send"), new Tag("nudes")]

    it("serialize id", () => {
        const serializer = new TypedJSON(PackageId);

        expect(serializer.toPlainJson(id)).toBe("help/me")
    });
    it("parse id", () => {
        const serializer = new TypedJSON(PackageId);

        expect(serializer.parse(JSON.stringify("help/me"))).toEqual(id)
    });

    // it("serialize package", () => {
    //     expect(serializer.toPlainJson(pack)).toBe("help/me")
    // });
    it("round trip json", () => {
        expect(serializer.parse(serializer.stringify(pack))).toEqual(pack)
    });
    it("round trip jobj", () => {
        expect(serializer.parse(serializer.toPlainJson(pack))).toEqual(pack)
    });

    it("validate fail", async () => {
        const errors = await validate(new Package(new PackageId("tothickforlifeuwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutothickforlifeuwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutothickforlifeuwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutothickforlifeuwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu", "me")));
        expect(errors).not.toHaveLength(0);
    });

    it("validate win", async () => {
        const errors = await validate(pack);
        expect(errors).toHaveLength(0);
    });
});