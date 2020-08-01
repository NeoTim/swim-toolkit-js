const ux = [
  {
    id: "theme",
    name: "@swim/theme",
    targets: [
      {
        id: "main",
      },
      {
        id: "test",
        deps: ["theme"],
      },
    ],
  },
  {
    id: "button",
    name: "@swim/button",
    targets: [
      {
        id: "main",
        deps: ["theme"],
      },
    ],
  },
  {
    id: "popover",
    name: "@swim/popover",
    targets: [
      {
        id: "main",
        deps: ["theme"],
      },
    ],
  },
  {
    id: "drawer",
    name: "@swim/drawer",
    targets: [
      {
        id: "main",
        deps: ["theme"],
      },
    ],
  },
  {
    id: "menu",
    name: "@swim/menu",
    targets: [
      {
        id: "main",
        deps: ["theme", "button"],
      },
    ],
  },
  {
    id: "tree",
    name: "@swim/tree",
    targets: [
      {
        id: "main",
        deps: ["theme", "button"],
      },
    ],
  },
  {
    id: "ux",
    name: "@swim/ux",
    title: "Swim User Experience Framework",
    umbrella: true,
    targets: [
      {
        id: "main",
        deps: ["theme", "button", "popover", "drawer", "menu", "tree"],
      },
    ],
  },
];

export default {
  version: "3.10.2",
  projects: ux,
};
