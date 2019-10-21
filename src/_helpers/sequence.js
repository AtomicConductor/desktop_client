const progressions = input => {
  const results = [[]];
  let i = 0;
  [...input]
    .sort((a, b) => (a < b ? -1 : 1))
    .forEach(element => {
      const curr = results[i];
      if (
        !(
          curr.length < 2 ||
          curr[1] - curr[0] === element - curr[curr.length - 1]
        )
      ) {
        i++;
        results.push([]);
      }
      results[i].push(element);
    });
  return results;
};

const toSpec = input =>
  input.length === 0
    ? ""
    : progressions(input)
        .map(p => {
          if (p.length === 1) {
            return `${p[0]}`;
          }
          const gap = p[1] - p[0];
          if (gap === 1) {
            return `${p[0]}-${p[p.length - 1]}`;
          }
          return `${p[0]}-${p[p.length - 1]}x${gap}`;
        })
        .join(",");

export { progressions, toSpec };
