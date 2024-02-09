import { dependencyMetadata } from "./check.js";
import { outputAction } from './action.js';
import { outputConsole } from "./console.js";
import { env } from "node:process";

export function outputTable (metadata: dependencyMetadata[] ) {
  if (env.GITHUB_STEP_SUMMARY) {
    outputAction(metadata);
  } else {
    outputConsole(metadata);
  }
}
