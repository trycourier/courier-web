import { CLIENT_ID_KEY, SDK_KEY, SDK_VERSION_KEY } from "../../types/courier-user-agent";
import { CourierUserAgent } from "../courier-user-agent";

const MOCK_CLIENT_ID = "test-client-id";
const CLIENT_SDK_NAME = "my-client-sdk";
const CLIENT_SDK_VERSION = "client-version-1.1.1";

describe("courier-user-agent", () => {
  describe("toJsonSerializable", () => {
    describe("usage from courier-js", () => {
      it("should collect user agent, SDK name, SDK version, client ID", () => {
        const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID, CLIENT_SDK_NAME, CLIENT_SDK_VERSION);

        expect(courierUserAgent.getUserAgentInfo()).toEqual({
          [SDK_KEY]: CLIENT_SDK_NAME,
          [SDK_VERSION_KEY]: CLIENT_SDK_VERSION,
          [CLIENT_ID_KEY]: MOCK_CLIENT_ID,
        });
      });

      it("should produce a JSON-serializable object", () => {
        const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID, CLIENT_SDK_NAME, CLIENT_SDK_VERSION);

        const json = JSON.stringify(courierUserAgent.getUserAgentInfo());
        const parsed = JSON.parse(json);

        expect(parsed).toBeDefined();
      });
    });
  });

  describe("toHttpHeaderValue", () => {
    it("should format keys/values as key1=value1,key2=value2", () => {
       const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID, CLIENT_SDK_NAME, CLIENT_SDK_VERSION);

       expect(courierUserAgent.toHttpHeaderValue()).toEqual(`sdk=${CLIENT_SDK_NAME},sdkv=${CLIENT_SDK_VERSION},cid=${MOCK_CLIENT_ID}`);
    });
  });
});
