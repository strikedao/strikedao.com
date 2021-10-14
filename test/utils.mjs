//@format
import { access, unlink } from "fs/promises";
import { constants } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const database = {
  name: "test.db"
};

export async function delDB() {
  try {
    await access(database.name, constants.F_OK);
  } catch (err) {
    return;
  }
  console.info("deleting test.db");
  await unlink(path.resolve(__dirname, `../${database.name}`));
}
