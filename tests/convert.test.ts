import { Package, PackageId, Person, Tag } from "../src/package";
import { validate } from 'class-validator';
import { classToPlain, plainToClass } from "../src";

describe("test json functionality function", () => {
    const id = new PackageId("help", "me");
    const pack = new Package(id);
    pack.thumbnail = "thumb.jpg"
    pack.authors = [new Person("4cf42413-ae7d-4382-98b6-e40ae6e06d64", "joe smo")]
    pack.tags = [new Tag("send"), new Tag("nudes")]

    it("serialize id", () => {
        expect(classToPlain(pack).name).toBe("help/me")
    });

    it("round trip transform", () => {
        const asPlain = classToPlain(pack);
        const asClass = plainToClass(asPlain)
        console.log(asPlain)
        expect(asClass).toEqual(pack);
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