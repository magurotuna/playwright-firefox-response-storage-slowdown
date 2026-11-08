import http from 'node:http';
import playwright from 'playwright';

// A server that answers every request with a 40 KB body.
await using server = http.createServer((req, res) => res.end('x'.repeat(40 * 1024))).listen(0);

// Firefox by default. Run `node repro.mjs chromium` to compare with Chromium.
await using browser = await playwright[process.argv[2] ?? 'firefox'].launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${server.address().port}/`);

// Fetch 120,000 times and print the seconds for each group of 5,000 fetches.
// Juggler keeps up to 100 MiB of response bodies (about 2,500 of these), so
// it starts to evict at about fetch 2,500, in the first group.
// Every group does the same work.
console.log(await page.evaluate(async () => {
  const times = [];
  let start = performance.now();
  for (let i = 1; i <= 120000; i++) {
    await (await fetch('/')).text();
    if (i % 5000 === 0) {
      times.push(((performance.now() - start) / 1000).toFixed(1));
      start = performance.now();
    }
  }
  return times.join(' ');
}));
