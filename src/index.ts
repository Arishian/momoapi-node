import { AxiosInstance } from "axios";

import Collections from "./collections";

import { authorizeCollections } from "./auth";
import { createOAuthClient } from "./client";

import { Config, GlobalConfig, ProductConfig } from "./types";

export = function(globalConfig: GlobalConfig) {
  return {
    Collections(productConfig: ProductConfig) {
      const config: Config = { ...globalConfig, ...productConfig };
      const client: AxiosInstance = createOAuthClient(
        config,
        authorizeCollections
      );
      return new Collections(client);
    }
  };
};
