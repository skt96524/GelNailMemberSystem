import { config } from "dotenv";
import populateEnv from "populate-env";

config();

export let env = {
  NODE_ENV: "development",
  DB_NAME: "",
  DB_USERNAME: "",
  DB_PASSWORD: "",
  JWT_SECRET: "",
  DB_PORT: 8100,
  POSTGRES_HOST: "",
  POSTGRES_DB: "",
  POSTGRES_USER: "",
  POSTGRES_PASSWORD: "",
  DB_HOST: "",
};

populateEnv(env, { mode: "halt" });
