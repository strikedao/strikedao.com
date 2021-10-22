// @format
import dotenv from "dotenv";
dotenv.config();
import process from "process";
import bs58 from "bs58";

// TODO: Figure out why we decided to import the crypto library using a dynamic
// import. If unnecessary, refactor.
const { randomBytes } = await import("crypto");
const { HOSTNAME } = process.env;

export function generate(size) {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, buf) => {
      if (err) reject(err);
      resolve(bs58.encode(buf));
    });
  });
}

export function link(tokens) {
  const params = new URLSearchParams(tokens.map(t => ["tokens", t]));
  return `https://${HOSTNAME}/vote/?${params.toString()}`;
}
