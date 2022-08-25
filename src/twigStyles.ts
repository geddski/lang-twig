import {HighlightStyle, syntaxHighlighting} from "@codemirror/language"
import {tags} from "@lezer/highlight"

const twigHighLight = HighlightStyle.define([
  {tag: tags.variableName, color: "#5e10fd"},
  {tag: tags.keyword, color: "#388cd5"},
  {tag: tags.comment, color: "#435c8e"},
])

export const twigHighLightStyle = syntaxHighlighting(twigHighLight);
