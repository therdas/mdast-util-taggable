import { defaultOptions, Options } from "./types";
import { Handlers, Unsafe } from "mdast-util-to-markdown";
declare module "mdast-util-to-markdown" {
  interface ConstructNameMap {
    taggable: "taggable";
    taggableData: "taggableData";
  }
}
export { Options, defaultOptions };
export declare function toMarkdown(opts?: Options): {
  handlers: Partial<Handlers>;
  unsafe: Unsafe[];
};
