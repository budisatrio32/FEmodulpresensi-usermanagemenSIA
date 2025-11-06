const { createServer } = require('http');
const next = require('next');

const dev = false; // karena ini production
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log('> Next.js app ready');
  });
});
