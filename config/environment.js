const ENV = {
  dev: {
    apiUrl: 'http://192.168.0.112:8001/api',
  },
  staging: {
    apiUrl: 'https://staging-api.websharkmedical.com/api',
  },
  prod: {
    apiUrl: 'https://api.websharkmedical.com/api',
  }
};

// This should use process.env.NODE_ENV
const getEnvVars = (env = process.env.NODE_ENV) => {
  if (env === 'development' || env === '') {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'production') {
    return ENV.prod;
  }
};

export default getEnvVars();  // Note: immediately invoke the function