import { AxiosInstance } from "axios";
import uuid from "uuid/v4";

import { createBasicClient } from "./client";

export interface Credentials {
  apiKey: string;
}
export interface Subscription {
  baseUrl?: string;
  subscriptionKey: string;
}

export default class Users {
  private client: AxiosInstance;

  constructor(config: Subscription) {
    this.client = createBasicClient(config);
  }

  public create(host: string): Promise<string> {
    const userId: string = uuid();
    return this.client
      .post(
        "/v1_0/apiuser",
        { providerCallbackHost: host },
        {
          headers: {
            "X-Reference-Id": userId
          }
        }
      )
      .then(() => userId);
  }

  public login(userId: string): Promise<Credentials> {
    return this.client
      .post<Credentials>(`v1_0/apiuser/${userId}/apikey`)
      .then(response => response.data);
  }
}