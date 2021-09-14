// @format
import bs58 from "bs58";
const { randomBytes } = await import("crypto");

export function generate(size) {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, buf) => {
      if (err) reject(err);
      resolve(bs58.encode(buf));
    });
  });
}
