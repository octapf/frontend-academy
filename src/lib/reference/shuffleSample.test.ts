import { sampleDistinctBy, samplePracticePairs, shuffleInPlace } from "@/lib/reference/shuffleSample";

describe("shuffleSample", () => {
  it("shuffles deterministically with a fixed random", () => {
    const rng = (() => {
      let i = 0;
      const seq = [0.9, 0.1, 0.5, 0.2, 0.8, 0.3, 0.7, 0.4, 0.6, 0.05];
      return () => seq[i++ % seq.length]!;
    })();
    const a = [1, 2, 3, 4, 5];
    shuffleInPlace(a, rng);
    expect(a).toHaveLength(5);
    expect(new Set(a).size).toBe(5);
  });

  it("samples at most size items", () => {
    const all = Array.from({ length: 50 }, (_, i) => ({ n: i }));
    const picked = samplePracticePairs(all, 10);
    expect(picked.length).toBe(10);
  });

  it("sampleDistinctBy avoids duplicate keys", () => {
    const rows = [
      { k: "a", v: 1 },
      { k: "a", v: 2 },
      { k: "b", v: 3 },
      { k: "c", v: 4 },
    ];
    const out = sampleDistinctBy(rows, 3, (r) => r.k, () => 0.5);
    const keys = out.map((r) => r.k);
    expect(new Set(keys).size).toBe(keys.length);
    expect(out.length).toBeLessThanOrEqual(3);
  });
});
