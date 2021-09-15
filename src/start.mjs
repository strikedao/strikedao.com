//@format
import { init, migrations, stills, questions } from "./db.mjs";

export async function initDB() {
  migrations.init(0);
  migrations.init(1);

  const db = init();
  const stillsDB = db.prepare("SELECT COUNT(*) as amount FROM stills").get();
  const boxesDB = db.prepare("SELECT COUNT(*) as amount FROM boxes").get();
  const optionsDB = db.prepare("SELECT COUNT(*) as amount FROM options").get();

  if (stillsDB.amount === 0) {
    await stills.init();
  }
  if (boxesDB.amount === 0 && optionsDB.amount === 0) {
    await questions.init();
  }
}
