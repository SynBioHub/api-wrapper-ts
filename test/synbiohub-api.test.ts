import SynBioHub from "../src/synbiohub-api"

/**
 * SynBioHub tests
 */
describe("SynBioHub", () => {
  it("is instantiable", () => {
    expect(new SynBioHub("https://synbiohub.org")).toBeInstanceOf(SynBioHub)
  })

  it("correctly creates URI string", () => {
    expect(new SynBioHub("https://synbiohub.org")).toHaveProperty("url", "https://synbiohub.org")
    expect(new SynBioHub("https://synbiohub.org/")).toHaveProperty("url", "https://synbiohub.org")
  })

  // Authentication
  it("rejects bad authentication credentials", () => {
    return expect(new SynBioHub("https://synbiohub.org").login("", "")).rejects.toEqual(
      "You must provide a username and password."
    )
  })

  it("correctly logs in valid credentials", () => {
    let synbiohub = new SynBioHub("https://synbiohub.utah.edu")

    return expect(
      synbiohub.login("continuous@integration.com", "continuousintegration")
    ).resolves.toBeTruthy()
  })

  it("correctly denies invalid credentials", () => {
    return expect(
      new SynBioHub("https://synbiohub.utah.edu").login(
        "continuous@integration.com",
        "nottherightpassword"
      )
    ).resolves.toBeFalsy()
  })

  // Root Collections
  it("retrieves root collections", () => {
    let synbiohub = new SynBioHub("https://synbiohub.utah.edu")

    synbiohub
      .login("continuous@integration.com", "continuousintegration")
      .then(success => {
        if (success) {
          return synbiohub.getRootCollections()
        } else {
          fail()
        }
      })
      .then(collections => {
        console.log(collections)
      })
  })
})
