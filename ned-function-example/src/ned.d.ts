import http from 'http';

interface NedFunctionExecutionPayload {
    executionId: string;
    method: string;
    headers: http.IncomingHttpHeaders;
    body: string;
    url: string;
    hostname: string;
    path: string
  }