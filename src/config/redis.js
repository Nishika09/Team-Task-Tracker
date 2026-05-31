const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
    console.error(
        'Redis Error:',
        err
    );
});

const connectRedis = async () => {
    await redisClient.connect();

    console.log(
        'Redis Connected'
    );
};

module.exports = {
    redisClient,
    connectRedis
};