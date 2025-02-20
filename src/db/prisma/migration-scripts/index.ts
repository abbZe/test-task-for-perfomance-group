import { createServer } from 'node:http';
import { PrismaClient } from '@prisma/client';

const port = process.env['PORT'] || 3000;
export const client = new PrismaClient();

createServer(async function (req, res) {
  const countResult = (await client.$queryRaw`
        SELECT count(*)
        FROM "_prisma_migrations"
        WHERE "finished_at" IS NULL
          AND "rolled_back_at" IS NULL
    `) as Array<{ count: number }>;
  if (countResult?.[0]?.count && countResult?.[0]?.count > 0) {
    // noinspection MagicNumberJS
    res.writeHead(500);
  } else {
    // noinspection MagicNumberJS
    res.writeHead(200);
  }
  res.end();
}).listen(port, () => {
  console.log(`db-client started, port ${port}`);
});
