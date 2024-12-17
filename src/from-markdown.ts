import * as unist from "unist";
import { type Token } from "micromark-util-types";
import {
  type Extension,
  type CompileContext,
  type Handle,
} from "mdast-util-from-markdown";
import { Data } from "mdast";
import { Options, defaultOptions, Rules } from "./types";

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

function top<T>(stack: T[]) {
  return stack.at(-1);
}

export const fromMarkdown = function (
  opts: Options = defaultOptions,
): Extension {
  if (!opts.allowEmail) opts.allowEmail = false;

  const typeMap = new Map(
    opts.rules.map((elem: Rules) => [elem.marker, elem.type]),
  );
  const funcMap = new Map(
    opts.rules.map((elem: Rules) => [elem.marker, elem.toUrl]),
  );

  const enterInlineTaggable: Handle = function (
    this: CompileContext,
    token: Token,
  ) {
    this.enter(
      {
        type: "taggable",

        //@ts-expect-error: known invalid item - will be populated on parse
        value: null,
        data: {
          marker: null,
          type: null,
          url: null,
        },
      },
      token,
    );
  };

  const exitInlineTaggableMarker: Handle = function (
    this: CompileContext,
    token: Token,
  ) {
    const marker = this.sliceSerialize(token);
    const currentNode = top(this.stack) as InlineTaggableNode;
    currentNode.data.marker = marker;
    currentNode.data.type = typeMap.get(marker)!; //Guaranteed to exist
  };

  const exitInlineTaggableValue: Handle = function (
    this: CompileContext,
    token: Token,
  ) {
    const node: InlineTaggableNode = top(this.stack) as InlineTaggableNode;
    const value = this.sliceSerialize(token);
    node.value = value;
    node.data.url = funcMap.get(node.data.marker)!(value); //Guaranteed to exist
  };

  const exitInlineTaggable: Handle = function (
    this: CompileContext,
    token: Token,
  ) {
    this.exit(token);
  };

  return {
    enter: {
      taggable: enterInlineTaggable,
    },
    exit: {
      taggableMarker: exitInlineTaggableMarker,
      taggableValue: exitInlineTaggableValue,
      taggable: exitInlineTaggable,
    },
  };
};
