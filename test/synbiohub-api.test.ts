import SynBioHub from "../src/synbiohub-api"

/**
 * SynBioHub tests
 */
describe("SynBioHub", () => {
  it("is instantiable", () => {
    expect(new SynBioHub("https://synbiohub.org")).toBeInstanceOf(SynBioHub)
  })

  it("correctly creates URI string", () => {
    expect(new SynBioHub("https://synbiohub.org")).toHaveProperty(
      "url",
      "https://synbiohub.org"
    )
    expect(new SynBioHub("https://synbiohub.org/")).toHaveProperty(
      "url",
      "https://synbiohub.org"
    )
  })

  it("rejects bad authentication credentials", () => {
    expect.assertions(1)
    new SynBioHub("https://synbiohub.org").login("", "").catch(err => {
      expect(err).toEqual("You must provide a username and password.")
    })
  })

  it("correctly logs in valid credentials", () => {
    new SynBioHub("https://synbiohub.utah.edu")
      .login("continuous@integration.com", "continuousintegration")
      .then(result => {
        expect(result).toBeTruthy()
      })
  })

  it("correctly denies invalid credentials", () => {
    new SynBioHub("https://synbiohub.utah.edu")
      .login("continuous@integration.com", "nottherightpassword")
      .then(result => {
        expect(result).toBeFalsy()
      })
  })
})
