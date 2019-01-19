import moment from "moment";

import { createBasicClient } from "./client";

import { Config } from "./types";
import { AccessToken } from "./types";

export interface OAuthCredentials {
  accessToken: string;
  expires: Date;
}

export type TokenRefresher = () => Promise<OAuthCredentials>;

export type Authorizer = (config: Config) => Promise<AccessToken>;

export default function getTokenRefresher(
  authorize: Authorizer,
  config: Config
): TokenRefresher {
  let credentials: OAuthCredentials;
  return () => {
    if (isExpired(credentials)) {
      return authorize(config)
        .then(getCredentials)
        .then(freshCredentials => {
          credentials = freshCredentials;
          return credentials;
        });
    }

    return Promise.resolve(credentials);
  };
}

export const authorizeCollections: Authorizer = function(
  config: Config
): Promise<AccessToken> {
  const basicAuthToken: string = createBasicAuthToken(config);
  return createBasicClient(config)
    .post<AccessToken>("/colection/token/", null, {
      headers: {
        Authorization: `Basic ${basicAuthToken}`
      }
    })
    .then(response => response.data);
};

export function createBasicAuthToken(config: Config): string {
  return Buffer.from(`${config.userId}:${config.userSecret}`).toString(
    "base64"
  );
}

function isExpired(credentials: OAuthCredentials): boolean {
  if (!credentials || !credentials.expires) {
    return true;
  }

  return moment().isAfter(credentials.expires);
}

function getCredentials(accessToken: AccessToken): OAuthCredentials {
  const { access_token, expires_in } = accessToken;
  return {
    accessToken: access_token,
    expires: moment()
      .add(expires_in, "seconds")
      .toDate()
  };
}
