import { SynBioHubUser } from "./user"
import { Collection } from "./collection"
import axios, { AxiosRequestConfig, AxiosPromise } from "axios"

export default class SynBioHub {
  user: SynBioHubUser
  url: string

  constructor(instanceUrl: string) {
    if (instanceUrl.slice(-1) === "/") {
      instanceUrl = instanceUrl.substr(0, instanceUrl.length - 1)
    }

    this.url = instanceUrl
  }

  public getRootCollections(): Promise<Array<string>> {
    return this.sendGetRequest("/rootCollections").then(response => {
      return response.data.map((collection: Collection) => {
        return collection.uri
      })
    })
  }

  public login(email: string, password: string): Promise<boolean> {
    if (email.length === 0 || password.length === 0) {
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

    return this.sendJSONRequest("/login", body)
      .then(response => {
        if (response == null || response.status > 300) {
          return false
        } else {
          this.user.token = response.toString()
          return true
        }
      })
      .catch(problem => {
        if (
          problem.response.data &&
          problem.response.data === "Your password was not recognized."
        ) {
          return false // This is to cope with an incorrect SBH response, SBH issue #557
        } else {
          throw problem
        }
      })
  }

  private sendGetRequest(endpoint: string): AxiosPromise {
    let options = {
      url: this.url + endpoint,
      method: "get",
      headers: {
        Accept: "text/plain",
        "X-authorization": this.user.token
      }
    }

    if (!this.user.token) {
      delete options.headers["X-authorization"]
    }

    return axios.request(options)
  }

  private sendJSONRequest(endpoint: string, body?: object): AxiosPromise {
    let options = {
      url: this.url + endpoint,
      method: "post",
      headers: {
        Accept: "text/plain",
        "X-Authorization": this.user.token,
        "Content-Type": "application/json"
      },

      data: body
    }

    if (!this.user.token) {
      delete options.headers["X-Authorization"]
    }

    return axios.request(options)
  }
}
