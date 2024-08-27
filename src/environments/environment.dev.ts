import { Utils } from "../utils/Utils";
import { Environment } from "./environment";

Utils.dotenvConfigs();

export const DevEnvironment: Environment = {
  db_uri: process.env.DEV_DB_URI,
  sendgrid:{
      api_key: process.env.DEV_SENDGRID_API_KEY,
      email_from: process.env.DEV_SENDGRID_SENDER_EMAIL
  },
  gmail_auth:{
      user: process.env.DEV_GMAIL_USER,
      pass: process.env.DEV_GMAIL_PASS
  },
  jwt_secret_key: process.env.DEV_JWT_SECRET_KEY
};