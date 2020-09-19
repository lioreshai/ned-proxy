import express from 'express';
import bodyParser from 'body-parser';
import {loadNedFunctionsConfig, NedFunctionConfig} from './loadConfig';
import {nedFunctionExecutor} from './nedFunctionExecutor';
import {Logger} from 'tslog';

const logger: Logger = new Logger({ name: "httpApi" });
const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

function mountNedFunction(nedFunctionConfig:NedFunctionConfig){
  app[nedFunctionConfig.method](nedFunctionConfig.route, nedFunctionExecutor(nedFunctionConfig))
}

const nedFunctionConfig = loadNedFunctionsConfig();
nedFunctionConfig.forEach(mountNedFunction);
app.listen(80, () => {
  logger.info(`ned-proxy listenssing on port 80`);
} );