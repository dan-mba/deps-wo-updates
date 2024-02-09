import { dependencyMetadata } from "./check.js";
import { outputAction } from './action.js';

export function outputTable (metadata: dependencyMetadata[] ) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    
  } else {
    outputAction(metadata);
  }
}
