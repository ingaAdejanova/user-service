import S from 'fluent-json-schema';

const userBaseSchema = S.object()
  .prop('id', S.string())
  .prop('name', S.string())
  .prop('email', S.string().format(S.FORMATS.EMAIL))
  .prop('createdAt', S.string().format(S.FORMATS.DATE_TIME));

const userBodySchema = S.object()
  .prop('name', S.string().required())
  .prop('email', S.string().format(S.FORMATS.EMAIL).required());

// const errorSchema = S.object().prop('error', S.string());

export const createUserSchema = {
  schema: {
    body: userBodySchema,
    response: {
      201: userBaseSchema,
    },
  },
};

export const getUsersSchema = {
  schema: {
    response: {
      200: S.array().items(userBaseSchema),
    },
  },
};

export const getUserSchema = {
  schema: {
    response: {
      200: userBaseSchema,
    },
  },
};

export const updateUserSchema = {
  schema: {
    body: userBodySchema,
    response: {
      200: userBaseSchema,
    },
  },
};

export const deleteUserSchema = {
  schema: {
    response: {
      204: S.null(),
    },
  },
};
