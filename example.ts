import { fromMarkdown } from "mdast-util-from-markdown";
import { syntax } from "micromark-extension-taggable";
import { fromMarkdown as ft, toMarkdown as tt } from "./src";
import { toMarkdown } from "mdast-util-to-markdown";

const doc =
  "# We can now add tags and mentions!\nHi there @user! Hope you're enjoying your #visit.";

const tree = fromMarkdown(doc, {
  extensions: [syntax()],
  mdastExtensions: [ft()],
});

console.log(tree);

const out = toMarkdown(tree, { extensions: [tt()] });

console.log(out);
