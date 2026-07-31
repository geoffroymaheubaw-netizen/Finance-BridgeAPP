import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);

let app: any;

try {
  const serverPath = path.resolve(process.cwd(), "dist/server.cjs");
  const serverModule = require(serverPath);
  app = serverModule.app || serverModule.default || serverModule;
} catch (err) {
  const serverModule = require(path.resolve(process.cwd(), "server.ts"));
  app = serverModule.app || serverModule.default || serverModule;
}

export default app;

