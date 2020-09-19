import { NedFunctionExecutionPayload } from './ned';

export function handler(payload: NedFunctionExecutionPayload) {
    console.log(payload.hostname);
}