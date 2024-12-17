import { test, describe } from "@jest/globals";
import { fromMarkdown as FMD, InlineTaggableNode } from "./from-markdown";
import { syntax } from "micromark-extension-taggable";
import { expect } from "@jest/globals";
import { visit } from "unist-util-visit";

import { defaultOptions } from "./index";
import { fromMarkdown } from "mdast-util-from-markdown";
import { Root } from "mdast";

function checkIfContainsNode(node: InlineTaggableNode, root: Root) {
  let contains: boolean = false;
  visit(root, "taggable", (compare: InlineTaggableNode) => {
    contains =
      contains ||
      (node.type === compare.type &&
        node.value === compare.value &&
        node.data.marker === compare.data.marker &&
        node.data.type === compare.data.type &&
        node.data.url === compare.data.url);
  });
  return contains;
}

describe("mdast-util-taggable", () => {
  describe("from-markdown", () => {
    test("parses a taggable properly", () => {
      const res = fromMarkdown("#tagged", {
        extensions: [...syntax()],
        mdastExtensions: [FMD(defaultOptions)],
      });

      expect(
        checkIfContainsNode(
          {
            type: "taggable",
            value: "tagged",
            data: {
              type: "tag",
              url: "/tags/tagged",
              marker: "#",
            },
          },
          res,
        ),
      ).toBeTruthy();
    });
  });
});
