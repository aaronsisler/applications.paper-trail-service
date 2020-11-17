import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HandlerResponse } from "../../models/handler-response";
import { User } from "../../models/user";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { AuthService } from "../../services/auth-service";
import { UserService } from "../../services/user-service";
import { errorLogger } from "../../utils/error-logger";

const userGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  let authId: string;

  try {
    const authService = new AuthService();
    authId = await authService.getAuthId(event);
  } catch (error) {
    errorLogger("Handler/UserGet", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 401,
      body: "Unauthorized"
    });

    callback(null, response);
    return;
  }

  try {
    const userService = new UserService();
    const user: User = await userService.getUser(authId);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 200,
      body: user
    });

    callback(null, response);
  } catch (error) {
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 204,
      body: undefined
    });

    callback(null, response);
  }
};

export { userGet };
