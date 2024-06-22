const Redis = require('ioredis');

let redisClient;

const initRedis = (config) => {
  try {
    redisClient = new Redis(config);
    return new Promise((resolve, reject) => {
      redisClient.on('connect', () => {
        console.log('Redis client connected');
        module.exports.redisClient = redisClient;
        resolve();
      });
 
      redisClient.on('error', (err) => {
        console.log('Redis connection error: ' + err);
        reject(err);
      });
    });

  } catch (err) {
    console.log('initRedis', err);
    throw new Error(err);
  }
};

module.exports.initRedis = initRedis;
