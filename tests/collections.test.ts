import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from "chai";

import Collections from "../src/collections";

import { createMockClient } from "./mock";

import { PaymentRequest } from "../src/types";

describe("Collections", function() {
  let collections: Collections;
  let mockAdapter: MockAdapter;
  let mockClient: AxiosInstance;

  beforeEach(() => {
    [mockClient, mockAdapter] = createMockClient();
    collections = new Collections(mockClient);
  });

  describe("requestToPay", function() {
    it("makes the correct request", function() {
      const request: PaymentRequest = {
        amount: "50",
        currency: "EUR",
        externalId: "123456",
        payer: {
          partyIdType: "MSISDN",
          partyId: "256774290781"
        },
        payerMessage: "testing",
        payeeNote: "hello",
        callbackUrl: "callback url"
      };
      return collections.requestToPay(request).then(() => {
        expect(mockAdapter.history.post).to.have.lengthOf(1);
        expect(mockAdapter.history.post[0].url).to.eq(
          "/colection/v1_0/requesttopay"
        );
        expect(mockAdapter.history.post[0].data).to.eq(JSON.stringify(request));
        expect(mockAdapter.history.post[0].headers["X-Reference-Id"]).to.be.a(
          "string"
        );
        expect(mockAdapter.history.post[0].headers["X-Callback-Url"]).to.eq(
          "callback url"
        );
      });
    });
  });

  describe("getTransactionStatus", function() {
    it("makes the correct request", function() {
      return collections.getTransactionStatus("reference").then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/colection/v1_0/requesttopay/reference"
        );
      });
    });
  });

  describe("getAccountBalance", function() {
    it("makes the correct request", function() {
      return collections.getAccountBalance().then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/colection/v1_0/account/balance"
        );
      });
    });
  });

  describe("getPayerStatus", function() {
    it("makes the correct request", function() {
      return collections.getPayerStatus("0772000000", "MSISDN").then(() => {
        expect(mockAdapter.history.get).to.have.lengthOf(1);
        expect(mockAdapter.history.get[0].url).to.eq(
          "/collection/v1_0/accountholder/MSISDN/0772000000/active"
        );
      });
    });
  });
});
