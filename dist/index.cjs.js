'use strict';

const defaultOptions = {
    classes: ["micromark-taggable"],
    rules: [
        {
            marker: "#",
            type: "tag",
            toUrl: (val) => `/tags/${val}`,
            classes: ["tag"],
        },
        {
            marker: "@",
            type: "mention",
            toUrl: (val) => `/users/${val}`,
            classes: ["mention"],
        },
    ],
    allowEmail: false,
};

function top(stack) {
    return stack.at(-1);
}
const fromMarkdown = function (opts = defaultOptions) {
    if (!opts.allowEmail)
        opts.allowEmail = false;
    const typeMap = new Map(opts.rules.map((elem) => [elem.marker, elem.type]));
    const funcMap = new Map(opts.rules.map((elem) => [elem.marker, elem.toUrl]));
    const enterInlineTaggable = function (token) {
        this.enter({
            type: "taggable",
            //@ts-expect-error: known invalid item - will be populated on parse
            value: null,
            data: {
                marker: null,
                type: null,
                url: null,
            },
        }, token);
    };
    const exitInlineTaggableMarker = function (token) {
        const marker = this.sliceSerialize(token);
        const currentNode = top(this.stack);
        currentNode.data.marker = marker;
        currentNode.data.type = typeMap.get(marker); //Guaranteed to exist
    };
    const exitInlineTaggableValue = function (token) {
        const node = top(this.stack);
        const value = this.sliceSerialize(token);
        node.value = value;
        node.data.url = funcMap.get(node.data.marker)(value); //Guaranteed to exist
    };
    const exitInlineTaggable = function (token) {
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

function toMarkdown(opts = defaultOptions) {
    if (!opts.allowEmail)
        opts.allowEmail = false;
    const unsafe = opts.rules.flatMap((val) => {
        return {
            character: val.marker,
            inConstruct: ["taggable"],
        };
    });
    const handler = (node, _, context) => {
        const exit = context.enter("taggable");
        const str = node.data.marker + node.value;
        exit();
        return str;
    };
    return {
        unsafe: unsafe,
        handlers: {
            taggable: handler,
        },
    };
}

exports.defaultOptions = defaultOptions;
exports.fromMarkdown = fromMarkdown;
exports.toMarkdown = toMarkdown;
//# sourceMappingURL=index.cjs.js.map
