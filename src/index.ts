import {parser as twigParser} from "./syntax.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside} from "@codemirror/language"
import {parseMixed} from "@lezer/common"

import {htmlLanguage} from "@codemirror/lang-html"
import {cssLanguage} from "@codemirror/lang-css"
export {twigHighLightStyle} from './twigStyles';

const mixedTwigParser = twigParser.configure({
  props: [
    // Add basic folding/indent metadata
    foldNodeProp.add({Conditional: foldInside}),
    indentNodeProp.add({Conditional: cx => {
      let closed = /^\s*\{% endif/.test(cx.textAfter)
      return cx.lineIndent(cx.node.from) + (closed ? 0 : cx.unit)
    }})
  ],
  wrap: parseMixed(node => {
    if (node.type.name === "Style"){
      return {
        parser: cssLanguage.parser,
        overlay: node => node.type.name == "Text"
      }
    }

    if (!node.type.isTop){
      // console.log('returning null', node.name);
      return null;
    }

    return {
      parser: htmlLanguage.parser,
      overlay: node => node.type.name == "Text"
    }
  })
})

export const twigLanguage = LRLanguage.define({parser: mixedTwigParser})

export function twig() {
  return new LanguageSupport(twigLanguage)
}
