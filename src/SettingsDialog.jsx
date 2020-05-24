/*
 * @Author: Rodrigo Soares
 * @Date: 2018-08-11 22:14:31
 * @Last Modified by: Rodrigo Soares
 * @Last Modified time: 2020-05-24 03:19:10
 */

import React from "react"
import { setAnalyticsEnabled, analyticsEnabled } from "./lib/GoogleAnalytics.js"
const { shell } = require("uxp")

class SettingsDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      analytics: true,
    }

    this.onAnalyticsChange = this.onAnalyticsChange.bind(this)
  }

  async setAnalytics() {
    const a = await analyticsEnabled()

    this.setState({
      analytics: a,
    })
  }

  async componentDidMount() {
    await this.setAnalytics()
  }

  async onAnalyticsChange(event) {
    this.setState({
      analytics: event.target.checked,
    })

    await setAnalyticsEnabled(event.target.checked)
  }

  websiteClick() {
    shell.openExternal("https://renameit.design/xd/")
  }

  donateClick() {
    shell.openExternal("https://www.paypal.me/rodi01/5")
  }

  twitterClick() {
    shell.openExternal("https://twitter.com/rodi01")
  }

  render() {
    return (
      <form method="dialog" style={{ width: 350 }}>
        <h1>Settings</h1>
        <hr />
        <h3 className="mt16">ANALYTICS</h3>
        <p className="mt8">Rename It uses Google Analytics to help improve the plugin.</p>
        <label className="row" style={{ alignItems: "center" }}>
          <input
            id="analytics"
            type="checkbox"
            checked={this.state.analytics}
            onChange={this.onAnalyticsChange}
          />
          <span>Enable Google Analytics</span>
        </label>
        <section className="aboutSection">
          <h3>ABOUT</h3>
          <div className="flex">
            <button uxp-variant="action" onClick={() => this.websiteClick()}>
              Website
            </button>
            <button uxp-variant="action" onClick={() => this.donateClick()}>
              Donate
            </button>
          </div>

          <p class="credits">
            Rename It is maintained by Rodrigo Soares.{" "}
            <span onClick={() => this.twitterClick()}>@rodi01</span>
          </p>
        </section>
        <footer className="mt24">
          <button type="submit" uxp-variant="cta">
            Done
          </button>
        </footer>
      </form>
    )
  }
}

export default SettingsDialog
