import {Request, Response} from 'express';
import {NedFunctionConfig} from './loadConfig';
import {Logger} from 'tslog';
import * as http from 'http';
import zlib from 'zlib';
import util from 'util';
import fs from 'fs';

const exec = util.promisify(require('child_process').exec);
const logger: Logger = new Logger({ name: "nedFunctionExecutor" });

interface NedFunctionExecutionPayload {
  method: string;
  headers: http.IncomingHttpHeaders;
  body: string;
  url: string;
  hostname: string;
  path: string
}

export function nedFunctionExecutor(config:NedFunctionConfig) {
  logger.info(`loading executor for "${config.image}" with method ${config.method} on route: "${config.route}"`)
  const dockerImage = config.image;
  return async function nedFunctionExecutionHandler(req: Request,res: Response) {
    const executionPayload: NedFunctionExecutionPayload = {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
      url: req.url,
      hostname: req.hostname,
      path: req.path,
    };
    const buffer = Buffer.from(JSON.stringify(executionPayload));
    const zipped = zlib.gzipSync(buffer);
    fs.writeFile('payload.gz', zipped, async function (err) {
      if (err) return console.log(err);
      const { stdout, stderr } = await exec(`cat payload.gz | docker run -i --rm ${config.image} gunzip`);
      res.send(stdout);
    });
  }
}