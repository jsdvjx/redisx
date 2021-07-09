import { RedisClient } from 'redis';

const redis = new RedisClient({
  host: '127.0.0.1',
  auth_pass: 'aabbcc',
});
redis.set('test', 'abc', (e, i) => {
  console.log(e, i);
});

redis.bitfield('test', ['GET', 'u4', 1, 'GET', 'u4', 2, 'SET', 'u4', 2, 2], (e, i) => {
  console.log(e, i);
});
