import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { client, initialConnect } from '../lib/redisConnection.mjs';
import { getResponseBody } from './body.mjs';

let connectionErr = false;
let connectionErrMsg;
client.on('error', (err) => {
  if (initialConnect) {
    connectionErr = true;
    connectionErrMsg = err;
  }
});

const handleIndex = async (ctx, next) => {
  if (connectionErr && initialConnect) {
    ctx.throw(400, `Connection failed to database: ${connectionErrMsg}`);
  } else if (!initialConnect) {
    ctx.throw(400, `Not connected yet`);
  }

  const entries = await client.lrange('films', 0, 100);
  const entryCount = await client.llen('films');

  ctx.body = getResponseBody(entries, entryCount);

  next();
};

const handleAdd = (ctx, next) => {
  const { title } = ctx.request.body;
  client.lpush(['films', title]);
  ctx.redirect('/');
  next();
};

const handleDelete = (ctx, next) => {
  client.del('films');
  ctx.redirect('/');
  next();
};

export default () => {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());

  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  });

  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });

  router.get('/', handleIndex);
  router.post('/add', handleAdd);
  router.get('/delete', handleDelete);

  app.use(router.routes());

  const port = 3000;
  app.listen(port);
  console.log('listening on http://localhost:' + port);
};
