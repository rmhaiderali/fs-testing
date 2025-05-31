import fs from "node:fs"
import os from "node:os"
import util from "node:util"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import child_process from "node:child_process"
import { getOSInfo } from "get-os-info"
import Bluebird from "bluebird"
import pc from "picocolors"

if (process.env.OS === "Windows_NT" && !process.env.MSYSTEM) {
  console.log("Run this script in POSIX-like environment e.g. Git Bash")
  process.exit(1)
}

const exec = util.promisify(child_process.exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
process.chdir(__dirname)

const start = Date.now()

function ResolveTasksConcurrently(tasks, concurrency) {
  return Bluebird.map(tasks, (task) => task(), { concurrency })
}

const runtimes = [
  ["node", "node"],
  ["deno", "deno -A"],
  ["bun", "bun"],
]

getOSInfo().then(async (info) => {
  const osname = info?.name.toLocaleLowerCase() || os.platform()

  const tasks = []
  for (let [runtime, cmd] of runtimes) {
    const file = "results/" + osname + "_" + runtime + ".txt"

    const finalCmd =
      (os.platform() === "win32" ? "" : "FORCE_COLOR=true ") +
      (cmd + " tests/index.js")

    tasks.push(async () => {
      try {
        const { stdout } = await exec(finalCmd)
        fs.writeFileSync(file, stdout)
        console.log(pc.green("success: ") + finalCmd)
      } catch (e) {
        console.log(pc.red("error: ") + e.message.trim())
      }
    })
  }

  await ResolveTasksConcurrently(tasks, Infinity)
  const end = Date.now()
  const time = (end - start) / 1000
  const color = time < 30 ? "green" : time < 60 ? "yellow" : "red"
  console.log("Completed in " + pc[color](time) + " seconds")
})
