const padNumber = (val, pad) =>
  (val < 0 ? "-" : "") + `${Math.abs(val)}`.padStart(pad, "0");

const tokensForKey = (key, tokens) =>
  tokens.filter(_ => _.match(new RegExp(`^${key}[1-8]?$`)));

const padding = _ => _.match(/[a-z_]+([1-8]?)/)[1] || 1;

/**
 * Generate a new context with padded numbers
 *
 * @param {Array} tokens Set of tokens, possibly with padding indicator,
 * extracted from the task template.
 * ["chunk_start", "chunk_end3", "chunk_start3"]
 * @param {*} context Object containing token bases and their numeric values.
 * {
 * chunk_start: 1,
 * chunk_end: 10
 * }
 * @returns New context containing padded numbers for the tokens.
 * {
 * chunk_start: "1",
 * chunk_end3: "010",
 * chunk_start3: "001"
 * }
 */
const paddedContext = (tokens, context) => {
  const result = {};
  Object.keys(context).forEach(key => {
    tokensForKey(key, tokens).forEach(token => {
      result[token] = padNumber(context[key], Math.trunc(padding(token)));
    });
  });
  return result;
};

export { paddedContext };
