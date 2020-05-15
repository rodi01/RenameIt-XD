// '{
//   "hitParsingResult": [ {
//     "valid": true,
//     "parserMessage": [ ],
//     "hit": "/debug/collect?v=1&tid=UA-104184459-2&ds=Sketch 65.1&cid=1D6660A9-A102-4ED3-976B-09AB4E043D40&t=pageview&an=Rename-It&aid=com.taptap.ninja.rename-it&av=4.5.2&dp=/rename&z=2B65B629-6B4C-4F83-952D-0587E94936DF"
//      v1
//      tid = UA-104184459-2
//      sd = Sketch 65.1
//      cid = 1D6660A9-A102-4ED3-976B-09AB4E043D40
//      t = pageview
//      an = Rename-It
//      aid = com.taptap.ninja.rename-it
//      av = 4.5.2
//      dp = /rename
//      z = 2B65B629-6B4C-4F83-952D-0587E94936DF
//
//   } ],
//   "parserMessage": [ {
//     "messageType": "INFO",
//     "description": "Found 1 hit in the request."
//   } ]
// }
import application from "application"
import storageHelper from "xd-storage-helper"
import { v3 as uuidv3 } from "uuid"

const manifest = require("../../manifest.json")
const kUUIDKey = "google.analytics.uuid"
const kAnalyticsEnabled = "analytics.enabled"
const kAnalyticsFirstRun = "analytics.first.run"
const UUDID_key = "218c9690-9112-11ea-bb37-0242ac130002"
const source = `Adobe XD ${application.version}`
const trackingId = "UA-104184459-2"

async function getUUID() {
  let uuid = await storageHelper.get(kUUIDKey, null)
  if (!uuid) {
    uuid = uuidv3(String(Date.now()), UUDID_key)
    await storageHelper.set(kUUIDKey, uuid)
  }

  return uuid
}

export async function analyticsEnabled() {
  return await storageHelper.get(kAnalyticsEnabled, true)
}

export async function setAnalyticsEnabled(value) {
  await storageHelper.set(kAnalyticsEnabled, value)
}

export async function analyticsFirstRun() {
  return await storageHelper.get(kAnalyticsFirstRun, true)
}

export async function setAnalyticsFirstRun() {
  await storageHelper.set(kAnalyticsFirstRun, false)
}

function jsonToQueryString(json) {
  return Object.keys(json)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
    })
    .join("&")
}

function makeRequest(url, options) {
  if (!url) {
    return
  }

  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.onload = () => {
      if (req.status === 200) {
        try {
          resolve(req.response)
        } catch (err) {
          reject("Couldnt parse response. ${err.message}, ${req.response}")
        }
      } else {
        reject("Request had an error: ${req.status}")
      }
    }
    req.open("GET", url, true)
    req.send()
  })
}

export async function track(hitType, props, options) {
  const isAnalyticsEnabled = await analyticsEnabled()

  if (!isAnalyticsEnabled) {
    // the user didn't enable sharing analytics
    return "the user didn't enable sharing analytics"
  }

  const payload = {
    v: 1,
    tid: trackingId,
    ds: source,
    cid: await getUUID(),
    t: hitType,
  }

  payload.an = manifest.name
  payload.aid = "com.renameit.design"
  payload.av = manifest.version

  if (props) {
    Object.keys(props).forEach(function (key) {
      payload[key] = props[key]
    })
  }

  const url = `https://www.google-analytics.com/${
    options && options.debug ? "debug/" : ""
  }collect?${jsonToQueryString(payload)}&z=${Date.now()}`

  if (options && options.debug) {
    console.log("DEBUG: Analytics")
    console.log(payload)
    console.log(`url: ${url}`)
  }

  return makeRequest(url, options)
}
