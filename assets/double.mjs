//@format
import { copyFile, rename } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const min = 0;
const max = 692;

function padded(num, targetLength) {
  return `out${num.toString().padStart(targetLength, "0")}.mp4`;
}

function produce(min, max, targetLength) {
  const nums = [];
  for (let i = min; i <= max; i++) {
    nums.push({
      name: padded(i, targetLength),
      num: i
    });
  }
  return nums;
}

const dir = resolve(__dirname, "stills");
const dir2 = resolve(__dirname, "stills2");
const names = produce(min, max, 3);
let duplicates = 0;
for (const { name, num } of names) {
  const copyPath = `${dir2}/${padded(num + duplicates, 4)}`;
  const duplicatePath = `${dir2}/${padded(num + duplicates + 1, 4)}`;
  await copyFile(`${dir}/${name}`, copyPath);
  await copyFile(copyPath, duplicatePath);
  duplicates++;
}
