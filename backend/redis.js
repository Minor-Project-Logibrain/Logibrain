import Redis from "ioredis";

const redisClient = new Redis({
    host:"localhost",
    port:6379,
});

redisClient.on('connect',()=>{
    console.log("Redis Connetcted");
    
});
redisClient.on('error',()=>{
    console.log("Error Occurred While Connetcting with Redis");
});

export default redisClient;