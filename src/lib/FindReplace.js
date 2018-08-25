/*
 * @Author: Rodrigo Soares 
 * @Date: 2018-08-24 21:05:32 
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2018-08-25 16:35:26
 */

/**
 * Escape Regexp
 *
 * @param  {string} str
 * @return {string}     Escaped value
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
}

/**
 * Find and Replace layer name
 *
 * @param  {{layerName: string, findText: string, replaceWith: string, caseSensitive:boolean}} options
 * @return {string}         The renamed layer
 */
export function findReplace(options) {
  const str = String(options.findText)
  let reg = options.caseSensitive
    ? new RegExp(escapeRegExp(str), "g")
    : new RegExp(escapeRegExp(str), "gi")

  return options.layerName.replace(reg, options.replaceWith)
}

/**
 * Match string for preview
 *
 * @param {{layerName: string, findText: string, replaceWith: string, caseSensitive:boolean}} options
 * @returns {boolean}
 */
export function matchString(options) {
  if (options.findText.length <= 0) return false
  let str = String(options.findText)
  let layerName = options.layerName
  if (!options.caseSensitive) {
    str = str.toLowerCase()
    layerName = layerName.toLowerCase()
  }

  return layerName.includes(str)
}
