const colors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "cyan",
  "white",
]

function ansiToHtml(string) {
  return string.replaceAll(
    /\x1B\[((?:3|4|9|10)[0-7])m(.*?)\x1B\[(?:39|49)m/g,
    (match, code, text) => {
      const is_bg = (code > 39 && code < 48) || (code > 99 && code < 108)
      const is_bright = (code > 89 && code < 98) || (code > 99 && code < 108)

      const class_slices = ["ansi", colors[code % 10], is_bg ? "bg" : "fg"]
      if (is_bright) class_slices.splice(1, 0, "bright")

      const class_name = class_slices.join("-")

      return "<span class=" + class_name + ">" + text + "</span>"
    }
  )
}

export default ansiToHtml
