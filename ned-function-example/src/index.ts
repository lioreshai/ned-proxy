import zlib from 'zlib';
import {Readable} from 'stream';
import { NedFunctionExecutionPayload } from './ned';

async function gunzipStream(stream: Readable) {
  return new Promise((resolve, reject) => {
    const  unzipStream= zlib.createGunzip();
    stream.pipe(unzipStream)
    let data = '';
    unzipStream.on('data', chunk => data = data + chunk);
    unzipStream.on('error', error => reject(error));
    unzipStream.on('end', ()=>resolve(data));
  });
}

(async ()=>{
  const unzipped = await gunzipStream(process.stdin);
  const payload:NedFunctionExecutionPayload = JSON.parse(unzipped.toString());
  await require('./sampleFunction').handler(payload);
})()

