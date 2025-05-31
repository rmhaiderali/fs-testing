import fs from "node:fs"

fs.watchFile(import.meta.dirname + "/unwatchFileTest.js", () => {})

fs.unwatchFile(import.meta.dirname + "/unwatchFileTest.js/")
