const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: 'Server error', message: err.message });
  };
  
  module.exports = errorMiddleware;
  