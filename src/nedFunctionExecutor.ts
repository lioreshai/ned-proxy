import {Request, Response} from 'express';
import {NedFunctionConfig} from './loadConfig';
import {Logger} from 'tslog';
import * as http from 'http';
import zlib from 'zlib';
import util from 'util';
import fs from 'fs';
import {v4 as uuid} from 'uuid';

const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);
const readFile = util.promisify(fs.readFile);

const logger: Logger = new Logger({ name: "nedFunctionExecutor" });
const dockerOrg = process.env.NED_DOCKER_ORG;

interface NedFunctionExecutionPayload {
  executionId: string;
  method: string;
  headers: http.IncomingHttpHeaders;
  body: string;
  url: string;
  hostname: string;
  path: string
}

export function nedFunctionExecutor(config:NedFunctionConfig) {
  logger.info(`mounting executor for "${config.image}" - ${config.method}:"${config.route}"`);
  //TODO: sanitize/validate dockerImage param
  const dockerImage = config.image;
  return async function nedFunctionExecutionHandler(req: Request,res: Response) {
    const executionId = uuid();
    const payloadFileName = `payload-${executionId}.gz`;
    const resultFileName = `result-${executionId}`;
    logger.info(`executionId:${executionId} starting...`);
    const executionPayload: NedFunctionExecutionPayload = {
      executionId,
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
      url: req.url,
      hostname: req.hostname,
      path: req.path,
    };
    const buffer = Buffer.from(JSON.stringify(executionPayload));
    const zipped = zlib.gzipSync(buffer);
    await Promise.all([writeFile(payloadFileName, zipped),writeFile(resultFileName,"")]);
    const { stdout, stderr } = await exec(`cat ${payloadFileName} | docker run -v ${resultFileName}:/${resultFileName} -i --rm ${dockerOrg}/ned-${dockerImage}`);
    logger.info(`executionId:${executionId} - STDOUT:`, stdout);
    logger.info(`executionId:${executionId} - STDERR:`, stderr);
    res.send(await readFile(resultFileName));
    await Promise.all([unlinkFile(payloadFileName),unlinkFile(resultFileName)]);
    logger.info(`executionId:${executionId} finished.`);
  }
}