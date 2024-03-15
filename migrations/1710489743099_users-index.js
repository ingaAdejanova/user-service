exports.up = (pgm) => {
  pgm.createIndex('users', ['created_at', 'id']);
};

exports.down = (pgm) => {
  pgm.dropIndex('users', ['created_at', 'id']);
};
