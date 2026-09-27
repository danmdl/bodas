// Accept both the standard Next.js flags and the managed preview's Vite-style flags.
// This keeps the project a normal Next.js application on local machines and Vercel.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const incoming = process.argv.slice(2);
const args = [];
for (let i = 0; i < incoming.length; i++) {
  if (incoming[i] === "--strictPort") continue;
  args.push(incoming[i] === "--host" ? "--hostname" : incoming[i]);
}
const child = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "dev", ...args],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
