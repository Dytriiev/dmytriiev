import 'dotenv/config';
// Ця штука в мне не працює , не знаходить assert
// import pkg from '../../package.json' assert {type:'json'}  ; // Import version from package.json

import { z } from 'zod';

const DEFAULT_PORT = 3000
const DEFAULT_ENV  = 'development'

const numberStringSchema = (def) => z.coerce.number().default(def);

const schema = z.object({
  PORT:     numberStringSchema(DEFAULT_PORT),
  NODE_ENV: z.enum(['development', 'production', 'test']).default(DEFAULT_ENV)
});

const parsed = schema.parse(process.env);

export const config = {
  port: parsed.PORT,
  env:  parsed.NODE_ENV,
  baseUrl: `http://localhost:${parsed.PORT}`,
  appName: 'Express API',
  appVersion: '1.0.0',
};