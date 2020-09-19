import {Logger} from 'tslog';
const logger: Logger = new Logger({ name: "loadConfig" });

type NedFunctionConfigMethod = "get" | "post" | "put" | "patch" | "delete";

export interface NedFunctionConfig {
  route: string;
  method: NedFunctionConfigMethod;
  image: string;
}

class MalformedNedFunctionConfigError extends Error {
  constructor(...args: any) {
      super(...args)
      Error.captureStackTrace(this, MalformedNedFunctionConfigError)
  }
}

function isNedFunctionConfigMethod(method: NedFunctionConfigMethod) {
    return ["get", "post", "put", "patch", "delete"].includes(method);
}

function isNedFunctionConfig(nedFunctionConfig: NedFunctionConfig) {
   return typeof nedFunctionConfig.route === "string"
    && isNedFunctionConfigMethod(nedFunctionConfig.method)
    && typeof nedFunctionConfig.image === "string"
}

export function loadNedFunctionsConfig():NedFunctionConfig[] {
  let nedFunctionsConfig: NedFunctionConfig[];
  try {
    nedFunctionsConfig = JSON.parse(process.env.NED_FUNCTIONS_JSON_STRING);
  }catch (err) {
    logger.error("couldn't parse ned function config from env variable, reading from file")
    nedFunctionsConfig = require("../ned.functions.json");
  }
  nedFunctionsConfig.forEach((config:NedFunctionConfig) => {
    if(!isNedFunctionConfig(config)) {
      throw new MalformedNedFunctionConfigError("user-provided ned function config is malformed")
    } 
  })
  return nedFunctionsConfig;
}