// Focused checks for hidden amounts, destination progress and travel references.
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import ts from "typescript";
function load(file, imports = {}) {
  const source = ts.transpileModule(
    fs.readFileSync(new URL("../" + file, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require: (key) => {
      if (key in imports) return imports[key];
      throw new Error("Unexpected import: " + key);
    },
    Intl,
    TextEncoder,
    Date,
    Math,
    console,
  });
  return exports;
}
const { wedding } = load("config/wedding.ts");
const { getWeddingData } = load("lib/wedding-data.ts", {
  "@/config/wedding": { wedding },
});
const { symbolicKilometers, tripBudget } = load("lib/travel-reference.ts");
assert.equal(symbolicKilometers(100000, 1545, 4198, 24190), 370);
assert.equal(symbolicKilometers(0, 1545, 4198, 24190), 0);
assert.equal(symbolicKilometers(100000, 0, 4198, 24190), 0);
assert.equal(symbolicKilometers(-1, 1545, 4198, 24190), 0);
assert.equal(symbolicKilometers(Infinity, 1545, 4198, 24190), 0);
assert.equal(symbolicKilometers(1545 * 4198, 1545, 4198, 24190), 24190);
assert.equal(
  JSON.stringify(tripBudget(wedding.travelReference)),
  "[5100,5650]",
);
let data = getWeddingData();
assert.equal(data.gifts.configured, false);
assert.equal(data.gifts.percentage, null);
assert(data.destinations.every((d) => d.percentage === null && !d.unlocked));
wedding.destinations.forEach((d) => {
  d.goal = 1000;
});
wedding.gifts.received = 1500;
wedding.gifts.showAmounts = false;
data = getWeddingData();
assert.equal(data.destinations[0].unlocked, true);
assert.equal(data.destinations[0].percentage, 100);
assert.equal(data.destinations[1].percentage, 50);
assert.equal(data.destinations[2].percentage, 0);
assert.equal(data.gifts.percentage, 18);
assert(!("received" in data.gifts));
assert(!("receivedLabel" in data.gifts));
assert(data.destinations.every((d) => !("goal" in d) && !("goalLabel" in d)));
assert(!JSON.stringify(data).includes("1500"));
wedding.gifts.publicProgress = "unlocked";
data = getWeddingData();
assert.equal(data.gifts.percentage, null);
assert.equal(data.gifts.unlockedCount, 1);
assert(data.destinations.every((d) => d.percentage === null));
wedding.gifts.publicProgress = "hidden";
data = getWeddingData();
assert.equal(data.gifts.percentage, null);
wedding.gifts.showAmounts = true;
data = getWeddingData();
assert("receivedLabel" in data.gifts);
assert(data.destinations.every((d) => "goalLabel" in d));
for (const p of [
  ...wedding.gallery,
  ...wedding.story.photos,
  wedding.hero.photo,
  ...wedding.destinations.map((d) => ({ src: d.image })),
])
  assert(fs.existsSync(new URL("../public" + p.src, import.meta.url)), p.src);
console.log(
  "Passed: progress modes, amount redaction, sequential goals, travel references, and all photo paths.",
);
