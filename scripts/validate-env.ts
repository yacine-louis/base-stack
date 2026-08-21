import { initEnv } from "../app/utils/env.server";

// Run before dev, build, and start so a misconfigured deployment exits before
// Vite or the server begins doing work.
initEnv();
