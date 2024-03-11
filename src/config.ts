import { ReportConfig, TicketConfig, VerificationConfig } from "./types";

const TOKEN = process.env.TOKEN || "";
const CLIENT_ID = process.env.CLIENT_ID || "";

if (TOKEN === "" || CLIENT_ID === "")
  throw new Error("Missing environment variables!");

const reportConfig: ReportConfig = {};
const ticketConfig: TicketConfig = {};
const verificationConfig: VerificationConfig = {};

export { TOKEN, CLIENT_ID, reportConfig, ticketConfig, verificationConfig };
