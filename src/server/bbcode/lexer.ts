/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 06/01/2024
 */

/**
 * Absurdly small parser for bbcode. Single pass.
 */

export const enum BBNodeType {
  text,
  tag,
}

export type BBNode =
  | {
      readonly t: BBNodeType.text
      readonly value: string
    }
  | {
      readonly t: BBNodeType.tag
      readonly name: string
      readonly attr?: string
      readonly children: BBNode[]
    }

export default function parse(src: string): BBNode[] {
  const nodes = [] as BBNode[]

  let i = 0

  const eof = () => i >= src.length

  // TODO: Replace regex with something faster.
  p: while (!eof()) {
    if (src[i] === "[") {
      i++

      let tag
      let s_tag = i
      let e_tag = 0
      while (src[i].match(/w/)) i++
      e_tag = i
      tag = src.substring(s_tag, e_tag)

      let attr
      let s_attr = i
      let e_attr = 0
      if (src[i] === "=") {
        i++
        while (src[i] !== "]") i++
      }
      e_attr = i
      if (s_attr !== e_attr) {
        // we have attr
        attr = src.substring(s_attr, e_attr)
      }

      if (src[i] !== "=" || src[i] !== "]") {
        continue p
      }
    }
  }

  return nodes
}
