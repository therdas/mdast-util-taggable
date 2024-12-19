# mdast-util-gfm-strikethrough

[mdast][] extensions to parse and serialize generalized taggables like #tag and @user.

## Contents

- [What is this?](#what-is-this)
- [When to use this](#when-to-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [`toMarkdown()`](#toMarkdown)
  - [`fromMarkdown()`](#fromMarkdown)
- [HTML](#html)
- [Syntax](#syntax)
- [Syntax tree](#syntax-tree)
  - [Nodes](#nodes)
- [Types](#types)
- [Compatibility](#compatibility)
- [Related](#related)
- [License](#license)

## What is this?

This package contains extensions that add support for custom mentions and tags into `micromark`.
It can be configured to parse tags of the following sort:

```md
#tag @user $page #page/subpage
```

These extensions plug into
`mdast-util-from-markdown` (to support parsing
strikethrough in markdown into a syntax tree) and
`mdast-util-to-markdown` (to support serializing
strikethrough in syntax trees to markdown).

## When to use this

You can use these extensions when you are working with
`mdast-util-from-markdown` and `mdast-util-to-markdown` already.

When working with `mdast-util-from-markdown`, you must combine this package
with [`micromark-extension-taggable`](https://github.com/therdas/micromark-extension-taggable).

When you don’t need a syntax tree, you can use [`micromark`](https://github.com/micromark/micromark)
directly with `micromark-extension-taggable`.

All these packages are used [`remark-taggable`](https://github.com/therdas/remark-taggable), which
focusses on making it easier to transform content by abstracting these
internals away.

This utility does not handle how markdown is turned to HTML.

## Install

In Node.js (version 16+), install with [npm][]:

```sh
npm install mdast-util-gfm-strikethrough
```

## Use

Say our document string contains:

```markdown
_Emphasis_, **importance**, and ~~strikethrough~~.
```

…and our file `example.ts` looks as follows:

```js
import { fromMarkdown } from "mdast-util-from-markdown";
import { syntax } from "micromark-extension-taggable";
import { fromMarkdown as ft, toMarkdown as tt } from "mdast-util-taggable";
import { toMarkdown } from "mdast-util-to-markdown";

const doc =
  "# We can now add tags and mentions!\nHi there @user! Hope you're enjoying your #visit.";

const tree = fromMarkdown(doc, {
  extensions: [syntax()],
  mdastExtensions: [ft()],
});

console.log(tree, tree.children[1]);

const out = toMarkdown(tree, { extensions: [tt()] });

console.log(out);
```

Now, running `tsx example.ts` yields:

```md
{
type: 'root',
children: [
{
type: 'heading',
depth: 1,
children: [Array],
position: [Object]
},
{ type: 'paragraph', children: [Array], position: [Object] }
],
position: {
start: { line: 1, column: 1, offset: 0 },
end: { line: 2, column: 50, offset: 85 }
}
} {
type: 'paragraph',
children: [
{ type: 'text', value: 'Hi there ', position: [Object] },
{
type: 'taggable',
value: 'user',
data: [Object],
position: [Object]
},
{
type: 'text',
value: "! Hope you're enjoying your ",
position: [Object]
},
{
type: 'taggable',
value: 'visit',
data: [Object],
position: [Object]
},
{ type: 'text', value: '.', position: [Object] }
],
position: {
start: { line: 2, column: 1, offset: 36 },
end: { line: 2, column: 50, offset: 85 }
}
}

# We can now add tags and mentions!

Hi there @user! Hope you're enjoying your #visit.
```

## API

This package exports the identifiers
`fromMarkdown` and
`toMarkdown`.
There is no default export.

### `fromMarkdown()`

Create an extension for `mdast-util-from-markdown`
to enable parsing of taggables.

###### Returns

Extension for `mdast-util-from-markdown`.

### `toMarkdown()`

Create an extension for `mdast-util-to-markdown`to
enable parsing ASTs corresponding to taggables into markdown

###### Returns

Extension for `mdast-util-to-markdown`.

## Syntax

See [Syntax in `micromark-extension-taggable`](https://github.com/therdas/micromark-extension-taggable)

## Syntax tree

The following interfaces are added to **mdast** by this utility.

### Nodes

#### `InlineTaggable`

```idl
interface InlineTaggable <: Inline {
  type: 'taggable'
  data: InlineTaggableData
  value: string
}

interfaace InlineTaggableData <: Data {
  marker: string
  type: string
  url: string
}
```

**1InlineTaggable** represents an inline taggable node. _All_ taggables are considered as being of this type - their presentation is modified according to **`InlineTaggableData`** values

For example, the following markdown:

```markdown
#hey
```

Yields:

```js
{
  type: 'taggable',
  value: 'hey',
  data: { type: 'tag', marker: '#', url: '/tags/hey/' },
}
```

With the default configuration options.

### Content model

## Types

This package is fully typed with [TypeScript][https://www.typescriptlang.org/].
It does not export additional types.

The `InlineTaggableNode` and `InlineTaggableData` types of mdast node are extended for `@types/mdast`.

## Compatibility

Compatibility can vary from release to release, but in general it should be assumed that this package only works with the latest versions of `remark`, `micromark` and related packages.

## Related

- [`remark-taggable`](https://github.com/therdas/remark-taggable)
  — remark plugin to support GFM
- [`micromark-extension-taggable`](https://github.com/therdas/micromark-extension-taggable)
  — micromark extension to parse GFM strikethrough

## License

MIT © [Rahul Das](https://www.github.com/therdas)
