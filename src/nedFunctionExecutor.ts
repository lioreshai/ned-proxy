import {Request, Response} from 'express';
import {NedFunctionConfig} from './loadConfig';
import {Logger} from 'tslog';
import * as http from 'http';

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
  }
}