import './index.css'
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import stripIndent from 'strip-indent';
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

// @ts-ignore
import { twig, twigHighLightStyle } from "../dist/index";
// import example from '../examples/mixed1.twig?raw';
// import example from '../examples/mixed2.twig?raw';
// import example from '../examples/mixed3.twig?raw';
import example from '../examples/stops.twig?raw';

let startingCode = stripIndent(`
  ${example}
`).trim();

function Example() {
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    let view = new EditorView({
      state: EditorState.create({
        doc: startingCode,
        extensions: [
          basicSetup,
          twig(),
          twigHighLightStyle,
          oneDark
        ]
      }),
      parent: viewRef.current
    });

    view.focus();
  }, []);

  return <div ref={viewRef} />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Example />
)
