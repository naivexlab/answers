const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 
    (process.env.NODE_ENV === 'production'
      ? '/api/backend'
      : 'http://localhost:4000/api/backend'
    ),
};

export default config;