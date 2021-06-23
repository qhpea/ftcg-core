export interface RGB {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}

export interface RGBA extends RGB {
    readonly a: number;
}

export enum Colorspace {
    sRGB = "sRGB",
    Linear = "Linear",
    NonColor = "NonColor"
}

export enum Channel {
    R, G, B, A, RGB, RGBA
}

export enum NormalStyle {
    DirectX, OpenGl
}

export interface Texture {
    readonly texture: string;
    readonly channel: Channel;
    readonly colorspace: Colorspace;
    readonly factor: number[];

}

export enum MaterialMethod {
    Photography,
    Synthetic
}

export interface TexturePackageInfo {
    readonly dimensions: number[];
    readonly method?: MaterialMethod;
}


export interface TextureAssetInfo {
    readonly size: number[];
}

export interface TexturePbrData {
    readonly color: Texture;
    readonly emissive: Texture;

    readonly normal: Texture;
    readonly occlusion: Texture;
    readonly roughness: Texture;
    readonly metallic: Texture;
    readonly height?: Texture;
}