import express from "express";
import { DATABASE_TABLE_TRANSACTIONS } from "../config";
// import { DATABASE_TABLE_TRANSACTIONS } from "../config";
import { transactions } from "../mocks/transactions";
import { userDetails } from "../mocks/user-details";
import { KeyValuePair } from "../models/key-value-pair";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { AuthService } from "../services/auth-service";
import { DatabaseService } from "../services/database-service";
import { HealthService } from "../services/health-service";
import { TransactionService } from "../services/transaction-service";
import { UserService } from "../services/user-service";

const app = express();
const port = process.env.PORT || "9001";
const userId = "10138920241180382903";

const authService: AuthService = new AuthService();
const databaseService = new DatabaseService();
const transactionService = new TransactionService();
const userService = new UserService();

app.get("/test-user", async (req, res) => {
  const userIdKey = new KeyValuePair("userId", userId);

  try {
    const newUser = new User({ ...userDetails, userId });

    await userService.createUser(newUser);

    return res.status(200).json("Worked");
  } catch (error) {
    return res.status(500).json("Failure");
  }
});

app.get("/test-trans", async (req, res) => {
  const transactionId = "789";
  const userIdKey = new KeyValuePair("userId", userId);
  const transIdKey = new KeyValuePair("transactionId", transactionId);

  try {
    const [transaction] = transactions;
    transaction.transactionId = transactionId;

    await transactionService.createTransaction(userId, transaction);

    return res.status(200).json("Worked");
  } catch (error) {
    return res.status(500).json("Failure");
  }
});

app.get("/health", (_req, res) => {
  const body = new HealthService().getHealth();

  return res.status(200).json(body);
});

app.get("/user", async (req, res) => {
  try {
    const user: User = await userService.getUser(userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(204).send();
  }
});

app.get("/transactions", async (req, res) => {
  const transactions: Transaction[] = await transactionService.getTransactions(
    userId
  );

  return res.status(200).json(transactions);
});

app.get("/auth", async (req, res) => {
  let authId: string;
  try {
    authId = await authService.getAuthId(req);
    return res.status(200).json(authId);
  } catch (error) {
    return res.status(401).send();
  }
});

app
  .listen(port, () => {
    console.log(`Server is listening on ${port}`);
  })
  .on("error", (e) => {
    console.error("Error happened: ", e.message);
  });
