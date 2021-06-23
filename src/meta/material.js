"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialMethod = exports.NormalStyle = exports.Channel = exports.Colorspace = void 0;
var Colorspace;
(function (Colorspace) {
    Colorspace["sRGB"] = "sRGB";
    Colorspace["Linear"] = "Linear";
    Colorspace["NonColor"] = "NonColor";
})(Colorspace = exports.Colorspace || (exports.Colorspace = {}));
var Channel;
(function (Channel) {
    Channel[Channel["R"] = 0] = "R";
    Channel[Channel["G"] = 1] = "G";
    Channel[Channel["B"] = 2] = "B";
    Channel[Channel["A"] = 3] = "A";
    Channel[Channel["RGB"] = 4] = "RGB";
    Channel[Channel["RGBA"] = 5] = "RGBA";
})(Channel = exports.Channel || (exports.Channel = {}));
var NormalStyle;
(function (NormalStyle) {
    NormalStyle[NormalStyle["DirectX"] = 0] = "DirectX";
    NormalStyle[NormalStyle["OpenGl"] = 1] = "OpenGl";
})(NormalStyle = exports.NormalStyle || (exports.NormalStyle = {}));
var MaterialMethod;
(function (MaterialMethod) {
    MaterialMethod[MaterialMethod["Photography"] = 0] = "Photography";
    MaterialMethod[MaterialMethod["Synthetic"] = 1] = "Synthetic";
})(MaterialMethod = exports.MaterialMethod || (exports.MaterialMethod = {}));
