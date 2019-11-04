/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eslIgnore_" }]*/

// https://regex101.com/r/liES7S/2/
const PROGRESSION_SPEC_REGEX = /^(?<first>-?\d+)(-(?<last>-?\d+)(x(?<step>[1-9][0-9]*))?)?$/;

const SPLIT_SPEC_REGEX = /[\s,,]/;

const _range = (first, last, step = 1) => {
  [first, last] = [first, last].sort((a, b) => (a < b ? -1 : 1));
  const stepVal = Math.max(1, step);
  const result = [];
  for (let i = first; i <= last; i += stepVal) {
    result.push(i);
  }
  return result;
};

const _toSpec = input =>
  input.length === 0
    ? ""
    : _progressions(input)
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

const _progressions = input => {
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

const _isProgression = frames => {
  if (frames.length < 3) {
    return true;
  }
  return !frames.some((_, i, arr) => {
    if (i < 1) {
      return false;
    }
    return arr[i] - arr[i - 1] !== arr[1] - arr[0];
  });
};

class Sequence {
  constructor(frames) {
    this.length = frames.length;
    this.spec = _toSpec(frames);
    this.first = frames[0];
    this.last = frames[frames.length - 1];
    this.step = undefined;
    this.name = this.constructor.name;
  }

  isProgression() {
    return this.constructor.name === "Progression";
  }

  toString() {
    return this.spec;
  }

  *getFrames() {
    for (let eslIgnore_p of this.getProgressions()) {
      for (let eslIgnore_f of eslIgnore_p.getFrames()) {
        yield eslIgnore_f;
      }
    }
  }

  *getProgressions() {
    for (let eslIgnore_spec of this.spec.split(",")) {
      yield SequenceFactory(eslIgnore_spec);
    }
  }

  *getChunks(size, progressions = false) {
    const framesGen = this.getFrames();
    let result = [];
    while (true) {
      const f = framesGen.next();
      if (
        f.done ||
        result.length === size ||
        (progressions &&
          result.length > 1 &&
          result[1] - result[0] !== f.value - result[result.length - 1])
      ) {
        yield SequenceFactory(_toSpec(result));
        result = [];
        if (f.done) {
          break;
        }
      }
      result.push(f.value);
    }
  }
}

class Progression extends Sequence {
  constructor(frames) {
    super(frames);
    this.step = frames.length > 1 ? frames[1] - frames[0] : 1;
  }

  *getFrames() {
    for (let i = this.first; i <= this.last; i += this.step) {
      yield i;
    }
  }
}

const SequenceFactory = spec => {
  const errmsg =
    'Please provide a valid frame spec string. Example "1,2-5,10-20x2"';
  if (!spec) {
    return new Progression([]);
  }

  let frames = spec
    .split(SPLIT_SPEC_REGEX)
    .filter(_ => _.length)
    .reduce((accum, _) => {
      const match = _.match(PROGRESSION_SPEC_REGEX);
      if (match) {
        let { first, last, step } = match.groups;
        first = Math.trunc(first);
        last = last === undefined ? first : Math.trunc(last);
        step = step === undefined ? 1 : Math.trunc(step);
        accum.push(..._range(first, last, step));
      } else {
        throw RangeError(errmsg);
      }
      return accum;
    }, []);

  frames = [...new Set(frames.sort((a, b) => a - b))];
  if (_isProgression(frames)) {
    return new Progression(frames);
  }
  return new Sequence(frames);
};

export default SequenceFactory;
