import {EditorState} from "@codemirror/state";
import {syntaxTree} from "@codemirror/language";
import { describe, it, expect } from 'vitest';
import stripIndent from 'strip-indent';
import {twig} from "../dist/index.js";

interface Nodes {
  [key: number]: string;
}

const getNode = (doc: string, position: number, side: 0 | 1 | -1 = 0) => {
  let state = EditorState.create({
    doc: doc,
    extensions: [twig()]
  })
  const node = syntaxTree(state).resolveInner(position, side);
  return node;
}

const checkNodes = (doc: string, nodes: Nodes ) => {
  doc = stripIndent(`${doc}`).trim();
  const nodesFound = {};

  for (const [key, val] of Object.entries(nodes)) {
    // remove all slots except the current one
    const reg = new RegExp(String.raw`\$\[(?!${key})\d\]`, 'gm');
    let newDoc = doc.replace(reg, '');
    // get cursor position of the current slot
    const cursor = newDoc.indexOf(`$[${key}]`);
    // remove that slot too
    newDoc = newDoc.replace(`$[${key}]`, '');
    const node = getNode(newDoc, cursor);
    nodesFound[key] = node;
    // test that nodes are in the right place
    expect(node.name).toBe(val);
  }

  // return them in case the tests want to do additional checks
  return nodesFound;
}

describe("mixed language parsing", () => {

  describe("Twig in script tag", () => {
    it("works with indenting", () => {
      const doc = `
        <script>
          /fo$[0]o/
          {% comment$[1] %}
            yolo
          {% endcomment %}
        </script>
      `
      checkNodes(doc, {
        0: "RegExp",
        1: "Comment"
      });
    });

    it("works without indenting", () => {
      const doc = `
        <script>
        /flo$[0]ofy/
        {% comment$[1] %}
        yolo
        {% endcomment %}
        </script>
      `
      checkNodes(doc, {
        0: "RegExp",
        1: "Comment"
      });
    })
  })

  describe("Twig and HTML", () => {
    it("parses HTML on it's own", () => {
      const doc = `
        <div$[0]>
          <div class="extra$[1]">
          </div$[2]>
          <hr$[3]>
        </div>
      `
      checkNodes(doc, {
        0: "OpenTag",
        1: "AttributeValue",
        2: "CloseTag",
        3: "SelfClosingTag"
      });
    });

    it("parses Twig on it's own", () => {
      const doc = `
          {{ $[0]content }}
          {% if $[1]extra_content %}
            {{ extra_conte$[2]nt }}
          {% endif$[3] %}
      `
      checkNodes(doc, {
        0: "Insert",
        1: "ConditionalOpen",
        2: "DirectiveContent",
        3: "ConditionalClose",
      });
    });

    it("parses HTML mixed with Twig", () => {
      const doc = `
        <div$[0]>
          {{ $[1]content }}
          {% if $[2]extra_content %}
            <hr$[3]>
            <div class="extra$[4]">
              {{ extra_conte$[5]nt }}
            </div$[6]>
          {% endif %}
          <hr>
        </div>
      `
      checkNodes(doc, {
        0: "OpenTag",
        1: "Insert",
        2: "ConditionalOpen",
        3: "SelfClosingTag",
        4: "AttributeValue",
        5: "DirectiveContent",
        6: "CloseTag",
      });
    });
  });

});
