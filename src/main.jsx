/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-11 21:39:15
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-06 01:55:22
 */

//  temporary stubs required for React. These will not be required as soon as the XD environment provides setTimeout/clearTimeout
global.setTimeout = function (fn) {
  fn()
}
global.clearTimeout = function () {}

const React = require("react")
const ReactDOM = require("react-dom")
const RenameLayers = require("./RenameLayers.jsx").default
const FindReplace = require("./FindReplaceLayers.jsx").default
const NoSelection = require("./NoSelection.jsx").default

const whereTo = {
  RENAME: 0,
  FIND: 1,
  SETTINGS: 3,
}

let dialog
function showDialog(selection, to, documentRoot) {
  const where = to != whereTo.SETTINGS && selection.items.length > 0 ? to : null

  if (dialog == null) {
    dialog = document.createElement("dialog")
    switch (where) {
      case whereTo.RENAME:
        ReactDOM.render(
          <RenameLayers dialog={dialog} selection={selection} documentRoot={documentRoot} />,
          dialog
        )
        break

      case whereTo.FIND:
        ReactDOM.render(<FindReplace dialog={dialog} selection={selection} />, dialog)
        break

      case whereTo.SETTINGS:
        break

      default:
        ReactDOM.render(<NoSelection dialog={dialog} />, dialog)
        break
    }
  }

  // Clean dialog so it can be reused
  dialog.addEventListener("close", () => {
    dialog = null
  })

  return document.appendChild(dialog).showModal()
}

module.exports = {
  commands: {
    renameCommand: function (selection, documentRoot) {
      return showDialog(selection, whereTo.RENAME, documentRoot).catch((err) => {
        return
      })
    },
    findReplaceCommand: function (selection) {
      return showDialog(selection, whereTo.FIND).catch((err) => {
        return
      })
    },
  },
}
