/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const storage = require("uxp").storage
const fs = storage.localFileSystem
const filename = "renameit-settings.json"

class storageHelper {
  /**
   * Creates a data file if none was previously existent.
   * @return {Promise<storage.File>} The data file
   * @private
   */
  static async init() {
    let dataFolder = await fs.getDataFolder()
    try {
      const file = await dataFolder.getEntry(filename)
      if (file) {
        // noinspection JSValidateTypes
        return file
      } else {
        throw new Error(`${filename} was not a file.`)
      }
    } catch (error) {
      console.log("Creating file")
      const file = await dataFolder.createEntry(filename, {
        type: storage.types.file,
        overwrite: true,
      })
      if (file.isFile) {
        await file.write("{}", { append: false })
        // noinspection JSValidateTypes
        return file
      } else {
        throw new Error(`${filename} was not a file.`)
      }
    }
  }

  /**
   * Retrieves a value from storage. Saves default value if none is set.
   * @param {string} key The identifier
   * @param {*} defaultValue The default value. Gets saved and returned if no value was previously set for the speciefied key.
   * @return {Promise<*>} The value retrieved from storage. If none is saved, the `defaultValue` is returned.
   */
  static async get(key, defaultValue) {
    console.log("In Get")

    const dataFile = await this.init()
    let object = JSON.parse((await dataFile.read({ format: storage.formats.utf8 })).toString())
    if (object[key] === undefined) {
      await this.set(key, defaultValue)
      return defaultValue
    } else {
      return object[key]
    }
  }

  /**
   * Saves a certain key-value-pair to the storage.
   * @param {string} key The identifier
   * @param {*} value
   * @return {Promise<void>}
   */
  static async set(key, value) {
    const dataFile = await this.init()
    let object = JSON.parse((await dataFile.read({ format: storage.formats.utf8 })).toString())
    object[key] = value
    return await dataFile.write(JSON.stringify(object), {
      append: false,
      format: storage.formats.utf8,
    })
  }
}

module.exports = storageHelper
