import fs from "node:fs";
import path from "node:path";
import HomePage from "@/components/HomePage";
import { BASE_PATH } from "@/lib/site-config";

const publicDir = path.join(process.cwd(), "public");

const cvFiles = fs
  .readdirSync(publicDir)
  .filter((file) => /^cv.*\.pdf$/i.test(file))
  .sort()
  .map((file) => ({ file, href: `${BASE_PATH}/${file}` }));

export default function Page() {
  return <HomePage availableCvs={cvFiles} />;
}
