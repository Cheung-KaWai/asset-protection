import * as fs from "node:fs";
import * as path from "node:path";

const inputPath = process.argv[2];
const dir = path.dirname(inputPath);
const ext = path.extname(inputPath);
const baseName = path.basename(inputPath, ext);
const outputPath = path.join(dir, `${baseName}-obfuscation${ext}`);

const data = fs.readFileSync(inputPath);
for (let i = 0; i < data.length; i++) {
  data[i] ^= 0xaa;
}
fs.writeFileSync(outputPath, data);

console.log(`Obfuscated GLB saved to: ${outputPath}`);
