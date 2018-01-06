import SynBioHub from "../src/synbiohub-api"
import fs from "fs"

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

  it("correctly rejects empty credentials", () => {
    return expect(new SynBioHub("https://synbiohub.utah.edu").login("", "")).rejects.toEqual(
      "You must provide a username and password."
    )
  })

  // Root Collections
  it("retrieves root collections", () => {
    let synbiohub = new SynBioHub("https://synbiohub.utah.edu")

    return expect(
      synbiohub.login("continuous@integration.com", "continuousintegration").then(success => {
        if (success) {
          return synbiohub.getRootCollections().then(collections => {
            return (
              collections.indexOf(
                "https://synbiohub.utah.edu/user/continuous/CanaryCollection/CanaryCollection_collection/1"
              ) !== -1
            )
          })
        } else {
          fail()
        }
      })
    ).resolves.toBeTruthy()
  })

  // SBOL Retrieval
  it("retrieves proper SBOL", () => {
    let synbiohub = new SynBioHub("https://synbiohub.utah.edu")

    return expect(
      synbiohub.login("continuous@integration.com", "continuousintegration").then(success => {
        if (success) {
          return synbiohub.getSBOL(
            "https://synbiohub.utah.edu/user/continuous/SmallFile/NC_000913/1/"
          )
        } else {
          fail()
        }
      })
    ).resolves.toEqual(fs.readFileSync("test/resources/sbol.rdf").toString())
  })

  // GenkBank Retrieval
  it("retrieves proper GenBank", () => {
    let synbiohub = new SynBioHub("https://synbiohub.utah.edu")

    return expect(
      synbiohub.login("continuous@integration.com", "continuousintegration").then(success => {
        if (success) {
          return synbiohub.getGenBank(
            "https://synbiohub.utah.edu/user/continuous/SmallFile/NC_000913/1/"
          )
        } else {
          fail()
        }
      })
    ).resolves.toEqual(fs.readFileSync("test/resources/genbank.gb").toString())
  })

  // FASTA Retrieval
  it("retrieves proper FASTA", () => {
    let synbiohub = new SynBioHub("https://synbiohub.utah.edu")

    return expect(
      synbiohub.login("continuous@integration.com", "continuousintegration").then(success => {
        if (success) {
          return synbiohub.getFASTA(
            "https://synbiohub.utah.edu/user/continuous/SmallFile/NC_000913/1/"
          )
        } else {
          fail()
        }
      })
    ).resolves.toEqual(fs.readFileSync("test/resources/fasta.fasta").toString())
  })
})
