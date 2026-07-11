export type GlossaryEntry = {
  term: string;
  answer: string;
};

// A growing list — add a new entry here whenever a new tool/concept shows up
// elsewhere on the site. No restructuring needed.
export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "Twilio",
    answer:
      "Twilio is a company that lets software send and receive real phone calls and text messages without a business having to build its own telecom infrastructure. Think of it as a phone network you control entirely through code — the same way a payment processor lets a website accept credit cards without becoming its own bank.",
  },
  {
    term: "OAuth 2.0 Client Credentials Flow",
    answer:
      "OAuth 2.0 is the standard way one piece of software proves its identity to another and gets permission to act, without ever handling a person's actual password. “Client Credentials Flow” is the version used when there's no human in the loop at all — one server proving to another “I am who I say I am, let me in” — the digital equivalent of a delivery company showing ID at a building's loading dock, rather than a resident using their own keycard.",
  },
  {
    term: "SOQL",
    answer:
      "SOQL (Salesforce Object Query Language) is Salesforce's own version of the question you'd ask a database in plain-ish English — “give me every loan application submitted this month.” Salesforce's data lives in its own hosted system rather than a database a developer manages directly, so it gets its own dialect of that question-asking language — similar in spirit to SQL, shaped around Salesforce's own object model.",
  },
  {
    term: "Field History Tracking",
    answer:
      "Salesforce's built-in feature for automatically keeping a paper trail every time a specific piece of data changes — who moved a record's status from “Submitted” to “Approved,” and exactly when — without a developer having to build that logging by hand. Think of it as the change-log a bank statement keeps automatically, rather than a diary someone has to remember to write in.",
  },
  {
    term: "NFC/RFID",
    answer:
      "Both are ways for a small chip to talk to a nearby device wirelessly, over a few centimeters, with no battery of its own — the same technology behind tap-to-pay cards and building-access fobs. NFC usually means the shorter-range, phone-tap kind; RFID is the broader umbrella term. Stuck to a physical object, a chip like this lets a phone “read” a permanent digital record just by tapping it — a durable link between a real, physical thing and the data about it.",
  },
];
