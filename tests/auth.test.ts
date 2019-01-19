import { expect } from "chai";

import { createBasicAuthToken } from "../src/auth";

describe("Auth", function() {
  describe("getTokenRefresher", function() {
    // ...
  });

  describe("authorizeCollections", function() {
    // ...
  });

  describe("createBasicAuthToken", function() {
    it("encodes id and secret in base64", function() {
      expect(
        createBasicAuthToken({
          subscriptionKey: "test",
          userId: "id",
          userSecret: "secret"
        })
      ).to.equal(Buffer.from("id:secret").toString("base64"));
    });
  });
});
