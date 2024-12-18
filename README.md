# mdast-util-gfm-strikethrough

[mdast][] extensions to parse and serialize generalized taggables like #tag and @user.

## Contents

*   [What is this?](#what-is-this)
*   [When to use this](#when-to-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`gfmStrikethroughFromMarkdown()`](#gfmstrikethroughfrommarkdown)
    *   [`gfmStrikethroughToMarkdown()`](#gfmstrikethroughtomarkdown)
*   [HTML](#html)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
    *   [Nodes](#nodes)
    *   [Content model](#content-model)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Related](#related)
*   [License](#license)

## What is this?

This package contains extensions that add support for custom mentions and tags into [`micromark`][micromark].
It can be configured to parse tags of the following sort:

```md
#tag @user $page #page/subpage
```
These extensions plug into
[`mdast-util-from-markdown`][mdast-util-from-markdown] (to support parsing
strikethrough in markdown into a syntax tree) and
[`mdast-util-to-markdown`][mdast-util-to-markdown] (to support serializing
strikethrough in syntax trees to markdown).

## When to use this

You can use these extensions when you are working with
`mdast-util-from-markdown` and `mdast-util-to-markdown` already.

When working with `mdast-util-from-markdown`, you must combine this package
with [`micromark-extension-taggable`](https://github.com/therdas/micromark-extension-taggable).

When you don’t need a syntax tree, you can use [`micromark`](https://github.com/micromark/micromark)
directly with `micromark-extension-gfm-strikethrough`.

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

Say our document `example.md` contains:

```markdown
*Emphasis*, **importance**, and ~~strikethrough~~.
```

…and our module `example.js` looks as follows:

```js
import fs from 'node:fs/promises'
import {gfmStrikethrough} from 'micromark-extension-gfm-strikethrough'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmStrikethroughFromMarkdown, gfmStrikethroughToMarkdown} from 'mdast-util-gfm-strikethrough'
import {toMarkdown} from 'mdast-util-to-markdown'

const doc = await fs.readFile('example.md')

const tree = fromMarkdown(doc, {
  extensions: [gfmStrikethrough()],
  mdastExtensions: [gfmStrikethroughFromMarkdown()]
})

console.log(tree)

const out = toMarkdown(tree, {extensions: [gfmStrikethroughToMarkdown()]})

console.log(out)
```

Now, running `node example` yields:

```js
{
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {type: 'emphasis', children: [{type: 'text', value: 'Emphasis'}]},
        {type: 'text', value: ', '},
        {type: 'strong', children: [{type: 'text', value: 'importance'}]},
        {type: 'text', value: ', and '},
        {type: 'delete', children: [{type: 'text', value: 'strikethrough'}]},
        {type: 'text', value: '.'}
      ]
    }
  ]
}
```

```markdown
*Emphasis*, **importance**, and ~~strikethrough~~.
```

## API

This package exports the identifiers
[`gfmStrikethroughFromMarkdown`][api-gfm-strikethrough-from-markdown] and
[`gfmStrikethroughToMarkdown`][api-gfm-strikethrough-to-markdown].
There is no default export.

### `gfmStrikethroughFromMarkdown()`

Create an extension for [`mdast-util-from-markdown`][mdast-util-from-markdown]
to enable GFM strikethrough in markdown.

###### Returns

Extension for `mdast-util-from-markdown` to enable GFM strikethrough
([`FromMarkdownExtension`][from-markdown-extension]).

### `gfmStrikethroughToMarkdown()`

Create an extension for [`mdast-util-to-markdown`][mdast-util-to-markdown] to
enable GFM strikethrough in markdown.

###### Returns

Extension for `mdast-util-to-markdown` to enable GFM strikethrough
([`ToMarkdownExtension`][to-markdown-extension]).

## HTML

This utility does not handle how markdown is turned to HTML.
That’s done by [`mdast-util-to-hast`][mdast-util-to-hast].
If you want a different element, you should configure that utility.

## Syntax

See [Syntax in `micromark-extension-gfm-strikethrough`][syntax].

## Syntax tree

The following interfaces are added to **[mdast][]** by this utility.

### Nodes

#### `Delete`

```idl
interface Delete <: Parent {
  type: 'delete'
  children: [TransparentContent]
}
```

**Delete** (**[Parent][dfn-parent]**) represents contents that are no longer
accurate or no longer relevant.

**Delete** can be used where **[phrasing][dfn-phrasing-content]**
content is expected.
Its content model is **[transparent][dfn-transparent-content]** content.

For example, the following markdown:

```markdown
~~alpha~~
```

Yields:

```js
{
  type: 'delete',
  children: [{type: 'text', value: 'alpha'}]
}
```

### Content model

#### `PhrasingContent` (GFM strikethrough)

```idl
type PhrasingContentGfm = Delete | PhrasingContent
```

## Types

This package is fully typed with [TypeScript][].
It does not export additional types.

The `Delete` type of the mdast node is exposed from `@types/mdast`.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`mdast-util-gfm-strikethrough@^2`, compatible with Node.js 16.

This utility works with `mdast-util-from-markdown` version 2+ and
`mdast-util-to-markdown` version 2+.

## Related

*   [`remark-taggable`](https://github.com/therdas/remark-taggable)
    — remark plugin to support GFM
*   [`micromark-extension-taggable`](https://github.com/therdas/micromark-extension-taggable)
    — micromark extension to parse GFM strikethrough

## License

[MIT][license] © [Rahul Das](https://www.github.com/therdas)