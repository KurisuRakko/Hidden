import { ensureStorageBucket } from "../src/lib/storage/minio";

async function main() {
  await ensureStorageBucket();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
