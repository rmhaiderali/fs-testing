// import ansiToHtmlCustom from "./ansi-to-html.js"
import { AnsiUp } from "https://cdn.jsdelivr.net/npm/ansi_up@6.0.2/+esm"

const ansi_up = new AnsiUp()
ansi_up.use_classes = true

let { os, runtime } = Object.fromEntries(
  new URLSearchParams(location.search).entries()
)

function combine(sep) {
  return os + sep + runtime
}

const options = {
  windows: ["node", "deno", "bun"],
  ubuntu: ["node", "deno", "bun"],
  android: ["node"],
  freebsd: ["node", "deno"],
}

const osInputs = [...document.querySelectorAll("[name=os]")]
const runtimeInputs = [...document.querySelectorAll("[name=runtime]")]
const terminal = document.querySelector(".terminal")

async function updateDOM() {
  terminal.innerHTML = "\n Loading"

  const osKeys = Object.keys(options)
  if (!osKeys.includes(os)) os = osKeys[0]

  const runtimeKeys = options[os]
  if (!runtimeKeys.includes(runtime)) runtime = runtimeKeys[0]

  for (const r of runtimeInputs) {
    r.disabled = !runtimeKeys.includes(r.id)
  }

  window[os].checked = true
  window[runtime].checked = true

  const result = await fetch("../results/" + combine("_") + ".txt")
  const text = await result.text()
  document.body.setAttribute("class", combine(" "))
  terminal.innerHTML = result.ok
    ? ansi_up.ansi_to_html(text)
    : "\n " + result.statusText
}

function updateURL(replace) {
  const params = new URLSearchParams()
  params.append("os", os)
  params.append("runtime", runtime)
  history[replace ? "replaceState" : "pushState"](
    { os, runtime },
    "",
    "?" + params
  )
}

window.addEventListener("popstate", ({ state }) => {
  os = state.os
  runtime = state.runtime
  updateDOM()
})

updateDOM()
updateURL(true)

for (const o of osInputs) {
  o.onchange = () => {
    os = o.id
    updateDOM()
    updateURL()
  }
}

for (const r of runtimeInputs) {
  r.onchange = () => {
    runtime = r.id
    updateDOM()
    updateURL()
  }
}
