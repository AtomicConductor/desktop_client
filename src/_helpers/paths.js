import { toUnix } from "upath";

const driveLetterRegEx = /^[a-z]:/i;

export const toPosix = path => toUnix(path).replace(driveLetterRegEx, "");
