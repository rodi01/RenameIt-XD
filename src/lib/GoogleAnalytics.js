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

async function analyticsEnabled() {
  return await storageHelper.get(kAnalyticsEnabled, true)
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

  //   if (options && options.makeRequest) {
  //     return options.makeRequest(url)
  //   }
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

  // if (options && options.debug) {
  //   var request = NSURLRequest.requestWithURL(url)
  //   var responsePtr = MOPointer.alloc().init()
  //   var errorPtr = MOPointer.alloc().init()

  //   var data = NSURLConnection.sendSynchronousRequest_returningResponse_error(
  //     request,
  //     responsePtr,
  //     errorPtr
  //   )
  //   return data
  //     ? NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
  //     : errorPtr.value()
  // }

  //   NSURLSession.sharedSession().dataTaskWithURL(url).resume()
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

  // return makeRequest(url, options)
  // console.log(url)

  return makeRequest(url, options)

  // if (options && options.debug) {
  //   var request = makeRequest(url, options)

  //   var data = NSURLConnection.sendSynchronousRequest_returningResponse_error(
  //     request,
  //     responsePtr,
  //     errorPtr
  //   )
  //   return data
  //     ? NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
  //     : errorPtr.value()
  // } else {
  //   return makeRequest(url, options)
  // }
}

// https://www.google-analytics.com/collect?v=1&tid=UA-104184459-2&ds=Adobe%20XD%2028.8.12.1&cid=eca19045-bd4f-3474-ae02-0cbce06ee574&t=pageview&an=Rename%20it&aid=com.renameit.design&av=1.1.2&dp=%2Frename&z=f75aea2b-b843-3924-9025-644c84b1c6c9
// https://www.google-analytics.com/collect?v=1&tid=UA-104184459-2&ds=Adobe XD 28.8.12.1&cid=eca19045-bd4f-3474-ae02-0cbce06ee574&t=pageview&an=Rename it&aid=com.renameit.design&av=1.1.2&dp=/rename&z=f75aea2b-b843-3924-9025-644c84b1c6c9

// tid = UA-104184459-2
// ds = Adobe XD 28.8.12.1
// cid = eca19045-bd4f-3474-ae02-0cbce06ee574
// t = pageview
// an = Rename it
// aid = com.renameit.design
// av = 1.1.2
// dp = /rename
// z = f75aea2b-b843-3924-9025-644c84b1c6c9
