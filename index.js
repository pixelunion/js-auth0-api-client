const axios = require("axios");
const moment = require("moment");

const DEFAULT_TOKEN_LIFE = 23 * 60 * 60 * 1000; // 23 hours

let access_token = null;
let updated_at = null;

let config = {
  api_identifier: null,
  auth0_domain: null,
  auth0_client_id: null,
  auth0_client_secret: null,
  token_life: DEFAULT_TOKEN_LIFE
};

function initAccessToken(c) {
  config = { ...config, ...c };
}

function fetchToken() {
  return axios.post({
    url: "https://" + config.auth0_domain + "/oauth/token",
    data: {
      client_id: config.auth0_client_id,
      client_secret: config.auth0_client_secret,
      audience: config.api_identifier,
      grant_type: "client_credentials"
    },
    headers: {
      Accept: "application/json"
    }
  });
}

async function getAccessToken() {
  if (accessTokenIsCurrent()) {
    return access_token;
  } else {
    const response = await fetchToken();
    access_token = response.data.access_token;
    updated_at = moment();
    return access_token;
  }
}

function accessTokenIsCurrent() {
  if (!access_token || !expiry_time) {
    return false;
  }

  const expiry_time = moment().add(config.token_life, "milliseconds");
  if (updated_at.isBefore(expiry_time)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  initAccessToken,
  getAccessToken
};
