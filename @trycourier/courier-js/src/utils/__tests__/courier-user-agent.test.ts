import { BROWSER_USER_AGENT_KEY, CLIENT_ID_KEY, SDK_KEY, SDK_VERSION_KEY } from "../../types/socket/protocol/courier-user-agent";
import { CourierUserAgent } from "../courier-user-agent";

const MOCK_CLIENT_ID = "test-client-id";
const CALLER_SDK_NAME = "caller-sdk";
const CALLER_SDK_VERSION = "caller-version";

describe("courier-user-agent", () => {
  describe("toJsonSerializable", () => {
    describe("usage from courier-js", () => {
      it("should collect user agent, SDK name, SDK version, client ID", () => {
        const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID);

        expect(courierUserAgent.toJsonSerializable()).toEqual({
          [BROWSER_USER_AGENT_KEY]: encodeURIComponent(window.navigator.userAgent),
          [SDK_KEY]: "courier-js",
          [SDK_VERSION_KEY]: "test-version",
          [CLIENT_ID_KEY]: MOCK_CLIENT_ID,
        });
      });

      it("should produce a JSON-serializable object", () => {
        const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID);

        const json = JSON.stringify(courierUserAgent.toJsonSerializable());
        const parsed = JSON.parse(json);

        expect(parsed).toBeDefined();
      });
    });

    describe("usage from a calling SDK", () => {
      it("should override SDK name and version with caller", () => {
        const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID);
        courierUserAgent.callerSdkName = CALLER_SDK_NAME;
        courierUserAgent.callerSdkVersion = CALLER_SDK_VERSION;

        expect(courierUserAgent.toJsonSerializable()).toEqual({
          [BROWSER_USER_AGENT_KEY]: encodeURIComponent(window.navigator.userAgent),
          [SDK_KEY]: CALLER_SDK_NAME,
          [SDK_VERSION_KEY]: CALLER_SDK_VERSION,
          [CLIENT_ID_KEY]: MOCK_CLIENT_ID,
        });
      });
    });
  });

  describe("toHttpHeaderValue", () => {
    it("should format keys/values as key1=value1,key2=value2", () => {
       const courierUserAgent = new CourierUserAgent(MOCK_CLIENT_ID);
       const ua = encodeURIComponent(window.navigator.userAgent);

       expect(courierUserAgent.toHttpHeaderValue()).toEqual(`bua=${ua},sdk=courier-js,sdkv=test-version,cid=${MOCK_CLIENT_ID}`);
    });
  });
});
