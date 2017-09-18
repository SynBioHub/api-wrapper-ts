import { SynBioHubUser } from "./user"
import * as request from "request-promise-native"

export default class SynBioHub {
  user: SynBioHubUser
  url: string

  constructor(instanceUrl: string) {
    if (instanceUrl.slice(-1) == "/") {
      instanceUrl = instanceUrl.substr(0, instanceUrl.length - 1)
    }

    this.url = instanceUrl
  }

  public login(email: string, password: string): Promise<boolean> {
    if (email.length == 0 || password.length == 0) {
      return Promise.reject("You must provide a username and password.")
    }

    this.user = new SynBioHubUser(email, password)

    return this.authenticate()
  }

  private authenticate(): Promise<boolean> {
    let body = {
      email: this.user.email,
      password: this.user.password
    }

    return this.sendJSONRequest("/login", body).then(response => {
      if (response.status > 300 || response.body == null) {
        return false
      } else {
        this.user.token = response.body.toString()
        return true
      }
    })
  }

  private sendJSONRequest(endpoint: string, body?: object): Promise<Response> {
    let options = {
      url: this.url + endpoint,
      headers: {
        Accept: "text/plain",
        "X-authorization": this.user.token
      },
      method: method,
      body: body,
      json: true
    }

    if (!this.user.token) {
      delete options.headers["X-authorization"]
    }

    return request(options)
  }
}
