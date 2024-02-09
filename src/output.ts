import { dependencyMetadata } from "./check.js";
import { outputAction } from './action.js';
import { outputConsole } from "./console.js";

export function outputTable (metadata: dependencyMetadata[] ) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    outputAction(metadata);
  } else {
    outputConsole(metadata);
  }
}
