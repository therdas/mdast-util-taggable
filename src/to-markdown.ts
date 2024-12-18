import { InlineTaggableNode } from "./from-markdown";
import { defaultOptions, Options } from "./types";
import { Handle, Handlers, State, Unsafe, Options as Opts, ConstructName } from "mdast-util-to-markdown";
import * as unist from "unist";

declare module "mdast-util-to-markdown" {
  interface ConstructNameMap {
    taggable: "taggable";
    taggableData: "taggableData";
  }
}

export { Options, defaultOptions };

export function toMarkdown(opts: Options = defaultOptions): {
  handlers: Partial<Handlers>,
  unsafe: Unsafe[]
} {
  if (!opts.allowEmail) opts.allowEmail = false;

  const unsafe: Unsafe[] = opts.rules.flatMap((val) => {
    return {
      character: val.marker,
      inConstruct: [ 'taggable' as ConstructName ],
    };
  });

  const handler: Handle = (
    node: InlineTaggableNode,
    _: unist.Parent | null | undefined,
    context: State,
  ) => {
    const exit = context.enter("taggable");
    const str = node.data.marker + node.value;
    exit();
    return str;
  };

  return {
    unsafe: unsafe,
    handlers: {
      taggable: handler as unknown as Handle,
    },
  };
}
