import fs from "node:fs/promises"

function s(api) {
  return (...args) =>
    new Promise(async (r) => {
      try {
        r({ err: null, data: await fs[api](...args) })
      } catch (err) {
        r({ err, data: null })
      }
    })
}

export default {
  open: s("open"),
  access: s("access"),
  writeFile: s("writeFile"),
  readFile: s("readFile"),
  appendFile: s("appendFile"),
  unlink: s("unlink"),
  stat: s("stat"),
}
