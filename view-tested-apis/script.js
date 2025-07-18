// prettier-ignore
const rows = {
  callback: {
    "fs.access":            true,
    "fs.appendFile":        true,
    "fs.chmod":             false,
    "fs.chown":             false,
    "fs.close":             false,
    "fs.copyFile":          false,
    "fs.cp":                false,
    "fs.createReadStream":  false,
    "fs.createWriteStream": false,
    "fs.exists":            false,
    "fs.fchmod":            false,
    "fs.fchown":            false,
    "fs.fdatasync":         false,
    "fs.fstat":             false,
    "fs.fsync":             false,
    "fs.ftruncate":         false,
    "fs.futimes":           false,
    "fs.glob":              false,
    "fs.lchmod":            false,
    "fs.lchown":            false,
    "fs.lutimes":           false,
    "fs.link":              false,
    "fs.lstat":             false,
    "fs.mkdir":             false,
    "fs.mkdtemp":           false,
    "fs.open":              true,
    "fs.openAsBlob":        false,
    "fs.opendir":           false,
    "fs.read":              false,
    "fs.readdir":           false,
    "fs.readFile":          true,
    "fs.readlink":          false,
    "fs.readv":             false,
    "fs.realpath":          false,
    "fs.realpath.native":   false,
    "fs.rename":            false,
    "fs.rmdir":             false,
    "fs.rm":                false,
    "fs.stat":              true,
    "fs.statfs":            false,
    "fs.symlink":           false,
    "fs.truncate":          false,
    "fs.unlink":            true,
    "fs.unwatchFile":       true,
    "fs.utimes":            false,
    "fs.watch":             false,
    "fs.watchFile":         true,
    "fs.write":             false,
    "fs.writeFile":         true,
    "fs.writev":            false,
  },
  sync: {
    "fs.accessSync":          true,
    "fs.appendFileSync":      true,
    "fs.chmodSync":           false,
    "fs.chownSync":           false,
    "fs.closeSync":           false,
    "fs.copyFileSync":        false,
    "fs.cpSync":              false,
    "fs.existsSync":          false,
    "fs.fchmodSync":          false,
    "fs.fchownSync":          false,
    "fs.fdatasyncSync":       false,
    "fs.fstatSync":           false,
    "fs.fsyncSync":           false,
    "fs.ftruncateSync":       false,
    "fs.futimesSync":         false,
    "fs.globSync":            false,
    "fs.lchmodSync":          false,
    "fs.lchownSync":          false,
    "fs.lutimesSync":         false,
    "fs.linkSync":            false,
    "fs.lstatSync":           false,
    "fs.mkdirSync":           false,
    "fs.mkdtempSync":         false,
    "fs.opendirSync":         false,
    "fs.openSync":            true,
    "fs.readdirSync":         false,
    "fs.readFileSync":        true,
    "fs.readlinkSync":        false,
    "fs.readSync":            false,
    "fs.readvSync":           false,
    "fs.realpathSync":        false,
    "fs.realpathSync.native": false,
    "fs.renameSync":          false,
    "fs.rmdirSync":           false,
    "fs.rmSync":              false,
    "fs.statSync":            true,
    "fs.statfsSync":          false,
    "fs.symlinkSync":         false,
    "fs.truncateSync":        false,
    "fs.unlinkSync":          true,
    "fs.utimesSync":          false,
    "fs.writeFileSync":       true,
    "fs.writeSync":           false,
    "fs.writevSync":          false,
  },
  promise: {
    "fs.access":     true,
    "fs.appendFile": true,
    "fs.chmod":      false,
    "fs.chown":      false,
    "fs.copyFile":   false,
    "fs.cp":         false,
    "fs.glob":       false,
    "fs.lchmod":     false,
    "fs.lchown":     false,
    "fs.lutimes":    false,
    "fs.link":       false,
    "fs.lstat":      false,
    "fs.mkdir":      false,
    "fs.mkdtemp":    false,
    "fs.open":       true,
    "fs.opendir":    false,
    "fs.readdir":    false,
    "fs.readFile":   true,
    "fs.readlink":   false,
    "fs.realpath":   false,
    "fs.rename":     false,
    "fs.rmdir":      false,
    "fs.rm":         false,
    "fs.stat":       true,
    "fs.statfs":     false,
    "fs.symlink":    false,
    "fs.truncate":   false,
    "fs.unlink":     true,
    "fs.utimes":     false,
    "fs.watch":      false,
    "fs.writeFile":  true,
  },
}

Object.keys(rows).forEach((row) => {
  const rowEle = document.createElement("div")
  rowEle.classList.add("row", row)

  const itemEle = document.createElement("pre")
  itemEle.setAttribute("c", "")
  itemEle.textContent = row[0].toUpperCase() + row.slice(1)
  rowEle.appendChild(itemEle)

  const keys = Object.keys(rows[row])
  const padMaxLen = keys.length.toString().length

  keys.forEach((item, index) => {
    const itemEle = document.createElement("pre")
    if (rows[row][item]) itemEle.setAttribute("c", "")
    itemEle.textContent = (index + 1 + "").padStart(padMaxLen) + " " + item
    rowEle.appendChild(itemEle)
  })

  document.body.appendChild(rowEle)
})
