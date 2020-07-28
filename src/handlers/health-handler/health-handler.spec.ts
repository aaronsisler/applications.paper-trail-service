import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const mockHealth = { returned: "value" };
const mockResponse = { statusCode: 200, body: mockHealth };

jest.mock("../../services/health-service", () => {
  return { healthService: () => mockHealth };
});

jest.mock("../../utils/response-body-builder", () => {
  return { responseBodyBuilder: jest.fn(() => "body-built-response") };
});

describe("health handler", () => {
  let callback: Function;

  beforeEach(() => {
    callback = jest.fn();
    handler(undefined, undefined, callback);
  });

  it("should call response body builder with correct arguments", () => {
    expect(responseBodyBuilder).toHaveBeenCalledWith(mockResponse);
  });

  it("should envoke callback with correct arguments", () => {
    expect(callback).toHaveBeenCalledWith(null, "body-built-response");
  });
});