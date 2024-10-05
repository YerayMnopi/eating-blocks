import { pino } from 'pino';

export const logger = pino({
    name: 'eating_blocks',
    level: 'debug',
});
