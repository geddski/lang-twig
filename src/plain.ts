import {EditorView} from "@codemirror/view";
// @ts-ignore
import { twig, twigHighLightStyle } from "../dist/index";
// @ts-ignore
import example from '../examples/stops.twig?raw';

new EditorView({
  doc: example,
  parent: document.body,
  extensions: [twig(), twigHighLightStyle]
});
