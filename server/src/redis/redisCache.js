const { redisClient } = require('./redisConnect');

const cacheManager = (namespace,keyFormatter) => {
  if (!namespace) throw new Error('namespace is required');
  if (!redisClient) throw new Error(`${namespace} - redisClient error`);
  if (!redisClient.status === 'ready') throw new Error(`${namespace} - redisClient not connected`);
  console.log(`${namespace} - Cache connected`);


  const keySet = `${namespace}/keys:keys`;

  const addKeyToSet = async (key) => {
    return redisClient.sadd(keySet, key);
  };

  const cache = async (key, value, ttl) => {
    await addKeyToSet(key);
    const fullKey = `${namespace}:${key}`;
    await redisClient.set(fullKey, value, ...(ttl ? ['EX', ttl]:[]));
  };

  const cacheMongooseRaw = async (valueObjects, ttl) => {
    
    const data = Array.isArray(valueObjects) ? valueObjects : [valueObjects];

    await Promise.all(data.map(async (valueObject) => {
      if(!valueObject) return 

      if(valueObject.err && valueObject.index) return;

      const jsonObject = valueObject.toObject && typeof valueObject.toObject === "function" ? valueObject.toObject({versionKey:false}) : valueObject;
      
      let fullKey = jsonObject._id;
      if(keyFormatter && keyFormatter(jsonObject)){
        fullKey= keyFormatter(jsonObject);
      } 
      if(!fullKey){
        console.log('cacheMongooseRaw - keyFormatter error');
      }
      let cacheKeys = Array.isArray(fullKey) ? fullKey : [fullKey];
      for(const cacheKey of cacheKeys){
        await cache(cacheKey, JSON.stringify(jsonObject), ttl);

      }
      
    } ));
  }

  const getCache = async (key) => {
    const value = await redisClient.get(`${namespace}:${key}`);
    
    return value && JSON.parse(value);
  };

  const getOrSetCache = async (key, callFetch, ttl) => {
    
    
    let cachedData = await getCache(key);

    if (cachedData) {
      console.log(`${namespace}:${key} - Cache hit`);
      return cachedData
    }

    console.log(`${namespace}:${key} - Cache miss`);
    try {
      const response = await callFetch();
      await cacheMongooseRaw(response, ttl);
      return response;
    } catch (error) {
      console.log(`${namespace}:${key} - Cache error`);
      throw new Error(error);
    }
    
  };

  const getAll = async (setting)=>{
    const keys = await redisClient.smembers(keySet);
    const mappedKey = keys.map(key=>`${namespace}:${key}`)
    console.log(mappedKey)
    if(!mappedKey.length)
      return []

    const values = await redisClient.mget(mappedKey)
    if(setting && setting.array){
      return (values).map(d=>JSON.parse(d))
    }
    
    return keys.reduce((acc, key, index)=>{
      acc[key] = JSON.parse(values[index])
      return acc
    },{})
    
  }


  const clearAllCache = async () => {
    const keys = await redisClient.smembers(keySet);
    for (let key of keys) {
      await redisClient.del(`${namespace}:${key}`);
    }
    await redisClient.del(keySet);
    console.log(`${keySet} - All cache cleared`);
  };

  return {
    getOrSetCache,
    clearAllCache,
    cache,
    getCache,
    getAll,
    cacheMongooseRaw
  };
};


module.exports = {};
