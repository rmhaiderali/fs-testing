import fs from "node:fs"

function s(api) {
  return (...args) =>
    new Promise((r) =>
      fs[api](...args, (err, data) =>
        r(err ? { err, data: null } : { err: null, data })
      )
    )
}

export default {
  open: s("open"),
  access: s("access"),
  writeFile: s("writeFile"),
  readFile: s("readFile"),
  appendFile: s("appendFile"),
  unlink: s("unlink"),
  stat: s("stat"),
  watchFile: s("watchFile"),
  unwatchFile: s("unwatchFile"),
}
