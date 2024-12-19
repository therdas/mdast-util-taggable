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

function checkIfNodeExists(root: Root) {
  let contains: boolean = false;
  visit(root, "taggable", () => {
    contains = true;
  });
  return contains;
}

describe("mdast-util-taggable", () => {
  describe("from-markdown", () => {
    const testRes: InlineTaggableNode = {
      type: "taggable",
      value: "tagged",
      data: {
        type: "tag",
        url: "/tags/tagged",
        marker: "#",
      },
    };

    const testUsr: InlineTaggableNode = {
      type: "taggable",
      value: "userd",
      data: {
        type: "mention",
        url: "/users/userd",
        marker: "@",
      },
    };

    test("parses a taggable properly", () => {
      expect(
        checkIfContainsNode(
          testRes,
          fromMarkdown("#tagged", {
            extensions: [syntax()],
            mdastExtensions: [FMD(defaultOptions)],
          }),
        ),
      ).toBeTruthy();
    });

    test("parses a different taggable properly", () => {
      expect(
        checkIfContainsNode(
          testUsr,
          fromMarkdown("@userd", {
            extensions: [syntax()],
            mdastExtensions: [FMD(defaultOptions)],
          }),
        ),
      ).toBeTruthy();
    });

    test("parses other taggable properly", () => {
      testRes.value = "panko";
      testRes.data = { type: "mention", marker: "@", url: "/users/panko" };
      expect(
        checkIfContainsNode(
          testRes,
          fromMarkdown("@panko", {
            extensions: [syntax()],
            mdastExtensions: [FMD(defaultOptions)],
          }),
        ),
      ).toBeTruthy();
    });

    test("does not parse a non-taggable properly", () => {
      expect(
        checkIfNodeExists(
          fromMarkdown("$noddatag", {
            extensions: [syntax()],
            mdastExtensions: [FMD(defaultOptions)],
          }),
        ),
      ).toBeFalsy();
    });

    test("does not parse a incomplete taggable properly", () => {
      expect(
        checkIfNodeExists(
          fromMarkdown("# taggedey", {
            extensions: [syntax()],
            mdastExtensions: [FMD(defaultOptions)],
          }),
        ),
      ).toBeFalsy();
    });

    test("does not parse a incomplete taggable properly", () => {
      expect(
        checkIfNodeExists(
          fromMarkdown("@ usery", {
            extensions: [syntax()],
            mdastExtensions: [FMD(defaultOptions)],
          }),
        ),
      ).toBeFalsy();
    });
  });
});
