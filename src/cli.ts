#!/usr/bin/env node

import program from "commander";

import Users from "./users";

import { createBasicClient } from "./client";
import { Credentials } from "./types";

const { version } = require("../package.json");

program
  .version(version)
  .description("Create sandbox credentials")
  .option("-x, --host <n>", "Your webhook host")
  .option("-p, --primary-key <n>", "Primary Key")
  .parse(process.argv);

const stringify = (obj: object) => JSON.stringify(obj, null, 2);

const client = createBasicClient({ subscriptionKey: program.primaryKey });
const users = new Users(client);

users
  .create(program.host)
  .then((userId: string) => {
    return users.login(userId).then((credentials: Credentials) => {
      console.log(
        "Momo Sandbox Credentials",
        stringify({
          userSecret: credentials.apiKey,
          userId
        })
      );
    });
  })
  .catch(error => {
    let message: string = stringify(error.message);

    if (error.response && error.response.data) {
      message = stringify(error.response.data);
    }

    console.log(message);
  });
