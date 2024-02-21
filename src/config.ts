let { TOKEN, CLIENT_ID } = process.env;

TOKEN = TOKEN as string;
CLIENT_ID = CLIENT_ID as string;

// TODO: add db integration instead of storing in memory?
interface TicketConfig {
  [key: string]: {
    category: string;
    role: string;
  };
}

const ticketConfig: TicketConfig = {};

export const config = { TOKEN, CLIENT_ID };
export { ticketConfig };
