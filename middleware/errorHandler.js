export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  const message =
    err.message.indexOf("Cast to ObjectId failed") != -1
      ? "Data was not found"
      : err.message;

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
