import fs from "node:fs"

fs.watchFile(import.meta.dirname + "/watchFileTest.js/", () => {})

fs.unwatchFile(import.meta.dirname + "/watchFileTest.js")
