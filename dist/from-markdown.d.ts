import * as unist from "unist";
import { type Extension } from "mdast-util-from-markdown";
import { Data } from "mdast";
import { Options } from "./types";
export interface InlineTaggableData {
  marker: string;
  type: string;
  url: string;
}
export interface InlineTaggableNode extends unist.Literal {
  type: "taggable";
  value: string;
  data: Data & InlineTaggableData;
}
declare module "mdast" {
  interface PhrasingContentMap {
    inlineTaggableNode: InlineTaggableNode;
  }
  interface RootContentMap {
    inlineTaggableNode: InlineTaggableNode;
  }
}
export declare const fromMarkdown: (opts?: Options) => Extension;
