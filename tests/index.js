import os from "node:os"
import fs from "node:fs"
import { exec } from "node:child_process"

import Table from "cli-table"
import pico from "picocolors"
import { getOSInfo } from "get-os-info"

import boxen from "../utils/boxen.js"
import format from "../utils/format.js"

import c from "./type/callback.js"
import s from "./type/sync.js"
import p from "./type/promise.js"

if (process.env.OS === "Windows_NT" && !process.env.MSYSTEM) {
  console.log("Run this script in POSIX-like environment e.g. Git Bash")
  process.exit(2)
}

let runtime = "unknown"
if (typeof global !== "undefined") runtime = "node"
if (typeof Deno !== "undefined") runtime = "deno"
if (typeof Bun !== "undefined") runtime = "bun"

if (runtime === "unknown") {
  console.log("Unable to detect runtime")
  process.exit(2)
}

const debug = false
const dir = import.meta.dirname + "/"

function toFuncParams(func, ...params) {
  return (
    pico.blueBright(func) +
    pico.white("(") +
    format("\"")(params, { colors: true }).slice(2, -2) +
    pico.white(")")
  )
}

const testFile = dir + runtime + ".txt"
const testFileSlash = testFile + "/"

// prettier-ignore
const tests = [
  ["writeFile",  testFileSlash, "1"],
  ["readFile",   testFileSlash     ],
  ["open",       testFileSlash     ],
  ["access",     testFileSlash     ],
  ["appendFile", testFileSlash, "2"],
  ["stat",       testFileSlash     ],
  ["unlink",     testFileSlash     ],
]

async function run(fn, api, [method, ...args]) {
  // prepare
  if (method === "unlink") {
    const res = await c.writeFile(testFile, "3")
    if (debug && res.err)
      console.log(boxen([res.err], { title: fn, borderColor: "red" }))
  }

  const res = await api[method](...args)

  // cleanup
  if (method === "unlink") {
    const res = await c.unlink(testFile)
    if (debug && res.err)
      console.log(boxen([res.err], { title: fn, borderColor: "red" }))
  }

  if (method === "open" && !res.err) {
    try {
      api === p ? await res.data.close() : fs.closeSync(res.data)
    } catch (err) {
      if (debug)
        console.log(boxen([res.err], { title: fn, borderColor: "red" }))
    }
  }

  return res.err instanceof Error ? pico.green("ERR") : pico.red("OK")
}

const rows = [["Method", "Callback", "Sync", "Promise"]]

for (const t of tests) {
  const fn = toFuncParams(...t.map((e) => e.replace(dir, "")))
  rows.push([fn, await run(fn, c, t), await run(fn, s, t), await run(fn, p, t)])
}

function getStatusByCode(code) {
  switch (code) {
    case 0:
      return pico.red("YES")
    case 124:
      return pico.green("NO")
    default:
      return pico.yellow("UNKNOWN")
  }
}

const runtimeCmd = { node: "node", deno: "deno -A", bun: "bun" }[runtime]

const watchExitCode = await new Promise((resolve) => {
  exec(
    // prettier-ignore
    "timeout 3s " + runtimeCmd + " " + dir + "watchFileTest.js",
    (e) => {
      const code = e?.code || 0
      if (debug && code !== 0 && code !== 124)
        console.log(boxen([e], { title: "watchFileTest", borderColor: "red" }))
      resolve(code)
    }
  )
})

rows.push([
  // prettier-ignore
  toFuncParams("watchFile", "a.txt/") + " === " + toFuncParams("watchFile", "a.txt"),
  getStatusByCode(watchExitCode),
])

const unwatchExitCode = await new Promise((resolve) => {
  exec(
    // prettier-ignore
    "timeout 3s " + runtimeCmd + " " + dir + "unwatchFileTest.js",
    (e) => {
      const code = e?.code || 0
      if (debug && code !== 0 && code !== 124)
        console.log(
          boxen([e], { title: "unwatchFileTest", borderColor: "red" })
        )
      resolve(code)
    }
  )
})

rows.push([
  // prettier-ignore
  toFuncParams("unwatchFile", "a.txt/") + " === " + toFuncParams("unwatchFile", "a.txt"),
  getStatusByCode(unwatchExitCode),
])

let version = "unknown"
if (runtime === "node") version = process.versions.node
else if (runtime === "deno") version = Deno.version.deno
else if (runtime === "bun") version = Bun.version

const osinfo = (await getOSInfo()) || {
  name: os.platform(),
  version: os.release(),
}

console.log()
console.log(" OS:", osinfo.name.toLocaleLowerCase(), osinfo.version)
console.log(" Runtime:", runtime, version)
console.log()

console.log(new Table({ rows }).toString())
