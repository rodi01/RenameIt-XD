/*
 * @Author: Rodrigo Soares
 * @Date: 2020-05-06 00:26:13
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-06 01:52:58
 */

export function hasChildLayer(items) {
  let hasChild = false

  for (let index = 0; index < items.length; index++) {
    if (items[index].children.length > 0) {
      hasChild = true
      break
    }
  }
  return hasChild
}

export function getChildLayerName(node) {
  let name = ""
  const lng = node.children.length
  if (lng > 0) {
    name = node.children.at(lng - 1).name
  }
  return name
}
