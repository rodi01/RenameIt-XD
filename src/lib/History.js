/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-09-02 15:18:16 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-09-06 23:00:31
 */
const StorageHelper = require("./storage.js")

const MAX_HISTORY = 5
const RENAME_HISTORY_KEY = "RenameHistory"
const FIND_HISTORY_KEY = "FindHistory"
const REPLACE_HISTORY_KEY = "ReplaceHistory"

class History extends StorageHelper {
  constructor(currentKey) {
    super()
    this.settings = null
    this.currentKey = currentKey
  }

  static get RENAME_HISTORY_KEY() {
    return RENAME_HISTORY_KEY
  }

  getCurrentKey() {
    return this.currentKey
  }

  /**
   *  Creates arrays of max history and checks if value exists
   * @param {String} value
   * @param {Array} arr
   * @returns {Array}
   * @private
   */
  static createArr(value, arr) {
    console.log("value", value)
    console.log("arr", arr)
    console.log("max", MAX_HISTORY)

    const pos = arr.indexOf(value)
    if (pos !== -1) arr.splice(pos, 1)
    arr.unshift(value)
    const newArr = arr.filter((entry) => entry.trim() !== "")
    if (newArr.length <= MAX_HISTORY) {
      return newArr
    }

    return newArr.slice(0, MAX_HISTORY)
  }

  async getHistory() {
    if (this.settings === null) {
      console.log("Getting Settings")
      this.settings = await History.get(this.currentKey, [])
    }

    console.log("new settings", this.settings)

    return this.settings
  }
}

module.exports = History
