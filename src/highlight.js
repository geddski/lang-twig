
import {styleTags, tags} from "@lezer/highlight"

export const twigHighlight = styleTags({
  DirectiveContent: tags.variableName,
  "if endif style endstyle": tags.keyword,
  Comment: tags.comment
})
