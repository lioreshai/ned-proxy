import express from 'express';
import {Logger} from 'tslog';

const logger: Logger = new Logger({ name: "httpApi" });
const app = express();


app.get( "/", ( req, res ) => {
    logger.debug(`incoming request with headers:`, req.headers)
    res.send( "Hello world!" );
} );

app.listen( 80, () => {
    logger.info(`node-dind-executor listening on port 80`)
} );