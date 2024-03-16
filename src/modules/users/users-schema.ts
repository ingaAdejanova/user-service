import S from 'fluent-json-schema';

const userResponseSchema = S.object()
  .prop('id', S.string())
  .prop('name', S.string())
  .prop('email', S.string().format(S.FORMATS.EMAIL))
  .prop('created_at', S.string().format(S.FORMATS.DATE_TIME));

const errorSchema = S.object().prop('error', S.string());

export const createUserSchema = {
  schema: {
    body: S.object().prop('name', S.string().required()).prop('email', S.string().format(S.FORMATS.EMAIL).required()),
    response: {
      201: userResponseSchema,
      '4xx': errorSchema
    }
  }
};

export const getUsersSchema = {
  schema: {
    response: {
      200: S.object()
        .prop('data', S.array().items(userResponseSchema))
        .prop('next_cursor', S.anyOf([S.null(), S.string()])),
      '4xx': errorSchema
    }
  }
};

export const getUserSchema = {
  schema: {
    response: {
      200: userResponseSchema,
      '4xx': errorSchema
    }
  }
};

export const updateUserSchema = {
  schema: {
    body: S.object().prop('name', S.string().required()),
    response: {
      200: userResponseSchema,
      '4xx': errorSchema
    }
  }
};

export const deleteUserSchema = {
  schema: {
    response: {
      204: S.null(),
      '4xx': errorSchema
    }
  }
};
