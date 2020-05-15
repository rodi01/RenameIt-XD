/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-11 21:39:15
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-13 02:39:23
 */

//  temporary stubs required for React. These will not be required as soon as the XD environment provides setTimeout/clearTimeout
global.setTimeout = function (fn) {
  fn()
}
global.clearTimeout = function () {}

const React = require("react")
const ReactDOM = require("react-dom")
const { shell } = require("uxp")
const analyticsFirstRun = require("./lib/GoogleAnalytics.js").analyticsFirstRun
const RenameLayers = require("./RenameLayers.jsx").default
const FindReplace = require("./FindReplaceLayers.jsx").default
const NoSelection = require("./NoSelection.jsx").default
const AnalyticsDialog = require("./AnalyticsDialog.jsx").default
const SettingsDialog = require("./SettingsDialog.jsx").default

const whereTo = {
  RENAME: 0,
  FIND: 1,
  SETTINGS: 3,
}

let dialog
async function showDialog(selection, to, documentRoot) {
  const firstRun = await analyticsFirstRun()

  let where = to
  if (to !== whereTo.SETTINGS && selection.items.length <= 0) {
    where = null
  }

  if (dialog == null) {
    dialog = document.createElement("dialog")
    let whereDialog
    switch (where) {
      case whereTo.RENAME:
        whereDialog = (
          <RenameLayers dialog={dialog} selection={selection} documentRoot={documentRoot} />
        )
        break

      case whereTo.FIND:
        whereDialog = <FindReplace dialog={dialog} selection={selection} />
        break

      case whereTo.SETTINGS:
        whereDialog = <SettingsDialog dialog={dialog} />
        break

      default:
        whereDialog = <NoSelection dialog={dialog} />
        break
    }

    if (firstRun) {
      ReactDOM.render(<AnalyticsDialog dialog={dialog} nextDialog={whereDialog} />, dialog)
    } else {
      ReactDOM.render(whereDialog, dialog)
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
    settingsCommand: function (selection) {
      return showDialog(selection, whereTo.SETTINGS).catch((err) => {
        return
      })
    },
    donateCommand: function () {
      shell.openExternal("https://www.paypal.me/rodi01/5")
    },
  },
}
