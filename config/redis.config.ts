const redis = require('redis');

let redisClient;
(async () => {
  redisClient = redis.createClient();
  try {
    redisClient.on('error', (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    console.log('Redis connected....');
    return redisClient;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

export default redisClient;
