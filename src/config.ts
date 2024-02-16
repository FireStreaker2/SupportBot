let { TOKEN, CLIENT_ID } = process.env;

TOKEN = TOKEN as string;
CLIENT_ID = CLIENT_ID as string;

export const config = { TOKEN, CLIENT_ID };
