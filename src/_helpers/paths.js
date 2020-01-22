import { normalize } from "upath";

const driveLetterRegEx = /^[a-z]:/i;

export const toPosix = path => normalize(path).replace(driveLetterRegEx, "");
