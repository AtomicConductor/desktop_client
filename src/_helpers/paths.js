const RX_DRIVE_LETTER = /^[a-z]:/i;
const RX_BACKSLASH = /\\/g;

export const toPosix = path =>
  path.replace(RX_DRIVE_LETTER, "").replace(RX_BACKSLASH, "/");
