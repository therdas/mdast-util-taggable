# mdast / unist representation of a taggable node

The node is defined with the following structure:

```idl
interface Taggable <: Literal {
    type: 'taggable'
    ctx: string
    marker: string
    value: string
    url: string?
}
```

Where:
|Field|Definition|Description|Example|
|--|--|--|--|
|type|`taggable`|This is always set to be `taggable`, see [mdast Literals](https://github.com/syntax-tree/mdast/blob/main/readme.md#literal)|`'taggable'`|
|ctx|`string`|What kind of `taggable` this node is|`'mention'`, `'tag'`|
|marker|`string`|The **marker** that starts this literal `taggable`. Should be **1 character** in length|`@`, `#`|
|value|`string`|The **text** following the marker for this literal `taggable`. By default, the following characters are allowed: <br/> - Characters in the [Unicode](https://www.unicode.org/) [General Category L](https://www.unicode.org/reports/tr44/#General_Category_Values)<br/> - The following characters: </br> &nbsp;&nbsp;&nbsp; `/`, `\|`, `:`<br/> - If the option Option.rules.rule.allowEmail is set to true: </br> &nbsp;&nbsp;&nbsp; `.`, `@`<br/>&nbsp;&nbsp;In this case, periods (`.`) will _not_ terminate the taggable.|`'my_awesome_tag'`|
|url|`string`|A valid [URL](https://url.spec.whatwg.org/)|`'https://www.github.com/therdas/mdast-util-taggable'`|
