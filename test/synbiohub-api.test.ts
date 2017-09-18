import SynBioHub from "../src/synbiohub-api"

/**
 * SynBioHub tests
 */
describe("SynBioHub test", () => {
  it("SynBioHub is instantiable", () => {
    expect(new SynBioHub("https://synbiohub.org")).toBeInstanceOf(SynBioHub)
  })

  it("SynBioHub correctly creates URI string", () => {
    expect(new SynBioHub("https://synbiohub.org")).toHaveProperty(
      "url",
      "https://synbiohub.org"
    )
    expect(new SynBioHub("https://synbiohub.org/")).toHaveProperty(
      "url",
      "https://synbiohub.org"
    )
  })
})
