
import {styleTags, tags} from "@lezer/highlight"

export const twigHighlight = styleTags({
  DirectiveContent: tags.variableName,
  "if endif": tags.keyword,
})
