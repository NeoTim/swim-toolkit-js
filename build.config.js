const core = [
  {
    id: "util",
    name: "@swim/util",
    path: "../swim-system-js/swim-core-js/@swim/util",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["util", "codec", "unit"],
      },
    ],
  },
  {
    id: "codec",
    name: "@swim/codec",
    path: "../swim-system-js/swim-core-js/@swim/codec",
    targets: [
      {
        id: "main",
        deps: ["util"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit"],
      },
    ],
  },
  {
    id: "args",
    name: "@swim/args",
    path: "../swim-system-js/swim-core-js/@swim/args",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "args"],
      },
    ],
  },
  {
    id: "build",
    name: "@swim/build",
    path: "../swim-system-js/swim-core-js/@swim/build",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "args"],
      },
    ],
  },
  {
    id: "unit",
    name: "@swim/unit",
    path: "../swim-system-js/swim-core-js/@swim/unit",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
    ],
  },
  {
    id: "collections",
    name: "@swim/collections",
    path: "../swim-system-js/swim-core-js/@swim/collections",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "collections"],
      },
    ],
  },
  {
    id: "structure",
    name: "@swim/structure",
    path: "../swim-system-js/swim-core-js/@swim/structure",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure"],
      },
    ],
  },
  {
    id: "recon",
    name: "@swim/recon",
    path: "../swim-system-js/swim-core-js/@swim/recon",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "recon"],
      },
    ],
  },
  {
    id: "streamlet",
    name: "@swim/streamlet",
    path: "../swim-system-js/swim-core-js/@swim/streamlet",
    targets: [
      {
        id: "main",
        deps: ["util", "collections"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "collections", "streamlet"],
      },
    ],
  },
  {
    id: "dataflow",
    name: "@swim/dataflow",
    path: "../swim-system-js/swim-core-js/@swim/dataflow",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "collections", "structure", "streamlet", "dataflow"],
      },
    ],
  },
  {
    id: "math",
    name: "@swim/math",
    path: "../swim-system-js/swim-core-js/@swim/math",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "math"],
      },
    ],
  },
  {
    id: "time",
    name: "@swim/time",
    path: "../swim-system-js/swim-core-js/@swim/time",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "time"],
      },
    ],
  },
  {
    id: "uri",
    name: "@swim/uri",
    path: "../swim-system-js/swim-core-js/@swim/uri",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "uri"],
      },
    ],
  },
  {
    id: "core",
    name: "@swim/core",
    path: "../swim-system-js/swim-core-js/@swim/core",
    title: "Swim Core Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "dataflow", "recon", "math", "time", "uri"],
      },
    ],
  },
];

const mesh = [
  {
    id: "warp",
    name: "@swim/warp",
    path: "../swim-system-js/swim-mesh-js/@swim/warp",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "recon", "uri"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "recon", "uri", "warp"],
      },
    ],
  },
  {
    id: "client",
    name: "@swim/client",
    path: "../swim-system-js/swim-mesh-js/@swim/client",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "warp"],
      },
      {
        id: "test",
        deps: ["util", "codec", "collections", "unit", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
      },
    ],
  },
  {
    id: "cli",
    name: "@swim/cli",
    path: "../swim-system-js/swim-mesh-js/@swim/cli",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "args", "collections", "structure", "streamlet", "dataflow", "recon", "uri", "warp", "client"],
      },
    ],
  },
  {
    id: "mesh",
    name: "@swim/mesh",
    path: "../swim-system-js/swim-mesh-js/@swim/mesh",
    title: "Swim Mesh Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["warp", "client"],
      },
    ],
  },
];

const ui = [
  {
    id: "angle",
    name: "@swim/angle",
    path: "../swim-system-js/swim-ui-js/@swim/angle",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "angle"],
      },
    ],
  },
  {
    id: "length",
    name: "@swim/length",
    path: "../swim-system-js/swim-ui-js/@swim/length",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "length"],
      },
    ],
  },
  {
    id: "color",
    name: "@swim/color",
    path: "../swim-system-js/swim-ui-js/@swim/color",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "angle"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "angle", "color"],
      },
    ],
  },
  {
    id: "font",
    name: "@swim/font",
    path: "../swim-system-js/swim-ui-js/@swim/font",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "length"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "length", "font"],
      },
    ],
  },
  {
    id: "transform",
    name: "@swim/transform",
    path: "../swim-system-js/swim-ui-js/@swim/transform",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "math", "angle", "length"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "math", "angle", "length", "transform"],
      },
    ],
  },
  {
    id: "interpolate",
    name: "@swim/interpolate",
    path: "../swim-system-js/swim-ui-js/@swim/interpolate",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "math", "time", "angle", "length", "color", "transform"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "math", "time", "angle", "length", "color", "transform", "interpolate"],
      },
    ],
  },
  {
    id: "scale",
    name: "@swim/scale",
    path: "../swim-system-js/swim-ui-js/@swim/scale",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "math", "time", "angle", "length", "color", "transform", "interpolate"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "math", "time", "angle", "length", "color", "transform", "interpolate", "scale"],
      },
    ],
  },
  {
    id: "transition",
    name: "@swim/transition",
    path: "../swim-system-js/swim-ui-js/@swim/transition",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "math", "time", "angle", "length", "color", "transform", "interpolate"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "math", "time", "angle", "length", "color", "transform", "interpolate", "transition"],
      },
    ],
  },
  {
    id: "animate",
    name: "@swim/animate",
    path: "../swim-system-js/swim-ui-js/@swim/animate",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "transform", "interpolate", "transition"],
      },
    ],
  },
  {
    id: "dom",
    name: "@swim/dom",
    path: "../swim-system-js/swim-ui-js/@swim/dom",
    targets: [
      {
        id: "main",
      },
    ],
  },
  {
    id: "style",
    name: "@swim/style",
    path: "../swim-system-js/swim-ui-js/@swim/style",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "structure", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "style"],
      },
    ],
  },
  {
    id: "render",
    name: "@swim/render",
    path: "../swim-system-js/swim-ui-js/@swim/render",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "structure", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "style"],
      },
    ],
  },
  {
    id: "constraint",
    name: "@swim/constraint",
    path: "../swim-system-js/swim-ui-js/@swim/constraint",
    targets: [
      {
        id: "main",
        deps: ["util", "codec"],
      },
      {
        id: "test",
        deps: ["util", "codec", "unit", "constraint"],
      },
    ],
  },
  {
    id: "view",
    name: "@swim/view",
    path: "../swim-system-js/swim-ui-js/@swim/view",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint"],
      },
    ],
  },
  {
    id: "shape",
    name: "@swim/shape",
    path: "../swim-system-js/swim-ui-js/@swim/shape",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view"],
      },
    ],
  },
  {
    id: "typeset",
    name: "@swim/typeset",
    path: "../swim-system-js/swim-ui-js/@swim/typeset",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view"],
      },
    ],
  },
  {
    id: "gesture",
    name: "@swim/gesture",
    path: "../swim-system-js/swim-ui-js/@swim/gesture",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view"],
      },
    ],
  },
  {
    id: "ui",
    name: "@swim/ui",
    path: "../swim-system-js/swim-ui-js/@swim/ui",
    title: "Swim UI Toolkit",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset", "gesture"],
      },
    ],
  },
];

const ux = [
  {
    id: "gauge",
    name: "@swim/gauge",
    path: "../swim-system-js/swim-ux-js/@swim/gauge",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset"],
      },
    ],
  },
  {
    id: "pie",
    name: "@swim/pie",
    path: "../swim-system-js/swim-ux-js/@swim/pie",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset"],
      },
    ],
  },
  {
    id: "chart",
    name: "@swim/chart",
    path: "../swim-system-js/swim-ux-js/@swim/chart",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset", "gesture"],
      },
    ],
  },
  {
    id: "map",
    name: "@swim/map",
    path: "../swim-system-js/swim-ux-js/@swim/map",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset"],
      },
    ],
  },
  {
    id: "mapbox",
    name: "@swim/mapbox",
    path: "../swim-system-js/swim-ux-js/@swim/mapbox",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset", "map"],
      },
    ],
  },
  {
    id: "ux",
    name: "@swim/ux",
    path: "../swim-system-js/swim-ux-js/@swim/ux",
    title: "Swim UI Widgets",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["gauge", "pie", "chart", "map", "mapbox"],
      },
    ],
  },
];

const web = [
  {
    id: "website",
    name: "@swim/website",
    path: "../swim-system-js/swim-web-js/@swim/website",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "uri", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset"],
      },
    ],
  },
  {
    id: "webapp",
    name: "@swim/webapp",
    path: "../swim-system-js/swim-web-js/@swim/webapp",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "math", "time", "uri", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset"],
      },
    ],
  },
  {
    id: "web",
    name: "@swim/web",
    path: "../swim-system-js/swim-web-js/@swim/web",
    title: "Swim Web Application Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["website", "webapp"],
      },
    ],
  },
];

const system = [
  {
    id: "system",
    name: "@swim/system",
    path: "../swim-system-js/@swim/system",
    title: "Swim System Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["core", "mesh", "ui", "ux", "web"],
      },
    ],
  },
];

const gui = [
  {
    id: "indicator",
    name: "@swim/indicator",
    path: "swim-gui-js/@swim/indicator",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "dataflow", "recon", "math", "time", "uri", "warp", "client", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset", "gesture"],
      },
    ],
  },
  {
    id: "widget",
    name: "@swim/widget",
    path: "swim-gui-js/@swim/widget",
    targets: [
      {
        id: "main",
        deps: ["util", "codec", "collections", "structure", "streamlet", "dataflow", "recon", "math", "time", "uri", "warp", "client", "angle", "length", "color", "font", "transform", "interpolate", "scale", "transition", "animate", "dom", "style", "render", "constraint", "view", "shape", "typeset", "gesture", "gauge", "pie", "chart", "map", "mapbox"],
      },
    ],
  },
  {
    id: "gui",
    name: "@swim/gui",
    path: "swim-gui-js/@swim/gui",
    title: "Swim Graphical User Interface Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["indicator", "widget"],
      },
    ],
  },
];

const toolkit = [
  {
    id: "toolkit",
    name: "@swim/toolkit",
    title: "Swim Toolkit",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["gui"],
      },
    ],
  },
];

export default {
  version: "3.10.1",
  projects: core.concat(mesh).concat(ui).concat(ux).concat(web).concat(system).concat(gui).concat(toolkit),
  gaID: "UA-79441805-2",
};
