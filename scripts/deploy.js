const task = require("./task")
const fs = require("fs")
const path = require("path")

module.exports = task("deploy", () => {
  let packageJSON
  try {
    packageJSON = require(path.join(process.cwd(), "package.json"))
  } catch (err) {
    error(`Error while reading the package.json file`)
    throw err
  }
  console.log(packageJSON.version)
})
