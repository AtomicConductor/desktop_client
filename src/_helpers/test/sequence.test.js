import Sequence, { validSpec } from "../sequence";

describe("Sequence class", () => {
  describe("factory", () => {
    it("should generate empty sequence", () => {
      const s = Sequence();
      expect([...s.getFrames()]).toEqual([]);
    });

    it("should generate Progression from empty ", () => {
      const s = Sequence();
      expect(s.constructor.name).toBe("Progression");
    });

    it("should generate Progression from single number", () => {
      const s = Sequence("10");
      expect(s.constructor.name).toBe("Progression");
    });

    it("should generate Progression from any two numbers", () => {
      const s = Sequence("10,53");
      expect(s.constructor.name).toBe("Progression");
    });

    it("should generate Progression from regular sequence", () => {
      const s = Sequence("2,4,6,8");
      expect(s.constructor.name).toBe("Progression");
    });

    it("should generate Progression from unsorted regular sequence", () => {
      const s = Sequence("2-4x2,8,6");
      expect(s.constructor.name).toBe("Progression");
    });

    it("should generate Sequence from spec with spaces or commas", () => {
      const s = Sequence("2-4x2,   8,,6   5");
      expect([...s.getFrames()]).toEqual([2, 4, 5, 6, 8]);
    });

    it("should generate Sequence from irregular sequence", () => {
      const s = Sequence("2,4,6,9");
      expect(s.constructor.name).toBe("Sequence");
    });
  });

  describe("sequence", () => {
    it("name should be sequence", () => {
      const s = Sequence("1,3,4");
      expect(s.name).toBe("Sequence");
    });

    it("should hold first and last", () => {
      const s = Sequence("1,3,4");
      expect(s.first).toBe(1);
      expect(s.last).toBe(4);
    });

    it("should yield values", () => {
      const s = Sequence("1,3,4");
      expect([...s.getFrames()]).toEqual([1, 3, 4]);
    });

    it("should yield several progressions", () => {
      const s = Sequence("1,3,4");
      expect([...s.getProgressions()].length).toBe(2);
      expect([...s.getProgressions()][0].name).toBe("Progression");
    });

    it("should yield chunks as Sequences", () => {
      const s = Sequence("1-20");
      expect([...s.getChunks(5)].length).toBe(4);
      expect([...[...s.getChunks(5)][0].getFrames()]).toEqual([1, 2, 3, 4, 5]);
    });

    it("should yield chunks when there's a remainder", () => {
      const s = Sequence("1-23");
      expect([...s.getChunks(5)].length).toBe(5);
      expect([...[...s.getChunks(5)][4].getFrames()]).toEqual([21, 22, 23]);
    });

    it("should yield Sequences as chunks when progressions not specified", () => {
      const s = Sequence("1,2,4");
      expect([...s.getChunks(5)].length).toBe(1);
    });

    it("should yield Progressions as chunks when specified", () => {
      const s = Sequence("1,2,4");
      expect([...s.getChunks(5, true)].length).toBe(2);
    });
  });

  describe("progression", () => {
    it("name should be progression", () => {
      const s = Sequence("1,3");
      expect(s.name).toBe("Progression");
    });

    it("should hold first, last and step", () => {
      const s = Sequence("1,3,5");
      expect(s.first).toBe(1);
      expect(s.last).toBe(5);
      expect(s.step).toBe(2);
    });

    it("should yield values", () => {
      const s = Sequence("1,3,5");
      expect([...s.getFrames()]).toEqual([1, 3, 5]);
    });
  });

  describe("spec strings", () => {
    it("should give empty spec for empty input spec", () => {
      expect(`${Sequence()}`).toBe("");
      expect(`${Sequence("")}`).toBe("");
    });

    it("should throw on invalid spec", () => {
      expect(() => Sequence("bad")).toThrow();
    });

    it("generates single number spec", () => {
      expect(`${Sequence("1")}`).toBe("1");
    });

    it("generates range spec", () => {
      expect(`${Sequence("1, 2, 3")}`).toBe("1-3");
    });

    it("generates range step spec", () => {
      expect(`${Sequence("1, 3, 5")}`).toBe("1-5x2");
    });

    it("generates mixed spec with commas", () => {
      expect(`${Sequence("1, 3, 5, 10, 15, 21, 22")}`).toBe(
        "1-5x2,10-15x5,21-22"
      );
    });
  });

  describe("negative frames", () => {
    it("should make a negative single number", () => {
      expect([...Sequence("-1").getFrames()][0]).toBe(-1);
    });

    it("should make a range of negative frame numbers", () => {
      expect([...Sequence("-10--8").getFrames()]).toEqual([-10, -9, -8]);
    });

    it("should make a range of negative to positive frame numbers", () => {
      expect([...Sequence("-2-2").getFrames()]).toEqual([-2, -1, 0, 1, 2]);
    });

    it("should make a stepped range of negative frame numbers", () => {
      expect([...Sequence("-2-2x2").getFrames()]).toEqual([-2, 0, 2]);
    });

    it("should make several stepped ranges of negative frame numbers", () => {
      expect([...Sequence("-8--5,-7--4").getFrames()]).toEqual([
        -8,
        -7,
        -6,
        -5,
        -4
      ]);
    });

    it("should sort a range of negative frame numbers", () => {
      const result = [...Sequence("-2--4").getFrames()];
      expect(result.length).toBe(3);
      expect(result[0]).toBe(-4);
      expect(result[2]).toBe(-2);
    });

    it("should throw with an invalid step", () => {
      expect(() => Sequence("1-2x-1")).toThrow();
      expect(() => Sequence("1-2x0")).toThrow();
    });
  });
});
