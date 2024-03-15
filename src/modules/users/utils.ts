export function encodeCursor(created_at: string, id: string): string {
  return Buffer.from(`${new Date(created_at).toISOString()}_${id}`).toString('base64');
}

export function decodeCursor(cursor: string): { created_at: string; id: string } {
  const decoded = Buffer.from(cursor, 'base64').toString();
  const [created_at, id] = decoded.split('_');

  return { created_at: new Date(created_at).toISOString(), id };
}
