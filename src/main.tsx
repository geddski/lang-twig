import './index.css'
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import stripIndent from 'strip-indent';
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import {css} from "@codemirror/lang-css";

// @ts-ignore
import { twig, twigHighLightStyle } from "../dist/index";

let startingCode = stripIndent(`
<div>
  {{ content }}
  {% if extra_content %}
    <hr>
    <div class="extra">
      {{ extra_content }}
    </div>
    <style>
      .hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: {{ settings.rows }};
        background: purple;
      }
    </style>
  {% endif %}

  {% style %}
    .section {
      outline: 1px solid #192879;
      background: {{ settings.primary.bg }};
      font-size: 3rem;
      {% if extra_content %}
      font-size: 2.5rem;
      {% endif %}
    }
  {% endstyle %}

  <script>
    const isMixed = true;
    console.log("isMixed", isMixed);
  </script>

  <hr>
</div>
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
          // css(),
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
