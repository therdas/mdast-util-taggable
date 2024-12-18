export interface Options {
  classes: Array<string>;
  rules: Array<Rules>;
  allowEmail?: boolean;
}

export interface Rules {
  marker: string;
  type: string;
  toUrl: (arg: string) => string;
  classes: Array<string>;
}

export const defaultOptions: Options = {
  classes: ["micromark-taggable"],
  rules: [
    {
      marker: "#",
      type: "tag",
      toUrl: (val) => `/tags/${val}`,
      classes: ["tag"],
    },
    {
      marker: "@",
      type: "mention",
      toUrl: (val) => `/users/${val}`,
      classes: ["mention"],
    },
  ],
  allowEmail: false,
};
