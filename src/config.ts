import {
  Cooldowns,
  ReportConfig,
  TicketConfig,
  VerificationConfig,
} from "./types";

const TOKEN = process.env.TOKEN || "";
const CLIENT_ID = process.env.CLIENT_ID || "";

if (TOKEN === "" || CLIENT_ID === "")
  throw new Error("Missing environment variables!");

const cooldowns: Cooldowns = {};

const reportConfig: ReportConfig = {};
const ticketConfig: TicketConfig = {};
const verificationConfig: VerificationConfig = {};

export {
  TOKEN,
  CLIENT_ID,
  cooldowns,
  reportConfig,
  ticketConfig,
  verificationConfig,
};
