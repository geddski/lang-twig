import {ExternalTokenizer} from "@lezer/lr"

import {
  commentContent as _commentContent
} from "./parser.terms.js"

const buildTokenFromArrayEnds = (input,type,ends, breakAtNewLine) => {
  const endsData = ends.map(end => ({
    end,
    endPosition: 0
  }))
  charLoop: for (let len = 0;; len++) {
    if (input.next < 0) {
      if (len) input.acceptToken(type)
      break
    }
    if(breakAtNewLine){
      if(input.next === 10){
        // need to take the new line as part of the token or face infinite loops
        input.advance();
        input.acceptToken(type);
        break charLoop;
      }
    }
    for ( let ind=0; ind < endsData.length; ind++){
      const end = endsData[ind].end;
      const endPos = endsData[ind].endPosition;
      if (input.next == end.charCodeAt(endPos)) {
        endsData[ind].endPosition = endPos + 1;
        if (endsData[ind].endPosition == end.length) {
          if (len > (end.length - 1)) input.acceptToken(type, 1 - end.length)
          break charLoop;
        }
      } else {
        endsData[ind].endPosition = 0
      }
    }
    input.advance()
  }
}

function scanTo(type, ends, breakAtNewLine = false) {
  return new ExternalTokenizer(input => {
    buildTokenFromArrayEnds(input, type, ends, breakAtNewLine)
  })
}

export const commentContent = scanTo(_commentContent, ["{% endcomment %}"]);
