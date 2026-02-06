const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    const status=422;
    const extraDetails=error.errors[0].message
    const message='fil the input properly'
    const err={
      status,
      message,
      extraDetails
    };
   next(err);
  }
};
module.exports = validate;