import boxen from "boxen"
import format from "./format.js"
import widestLine from "widest-line"

export default function (items, options = {}) {
  const text = items
    .map((item) => format("\"")(item, { colors: true, depth: null }))
    .join("\n")
    .replace(/\r\n|\r/g, "\n")

  return boxen(text, {
    padding: { left: 1, right: 1 },
    width: widestLine(text) + 4,
    ...options,
  })
}
