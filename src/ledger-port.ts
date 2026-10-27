import type {Ledger} from "./ledger.js";
export type LedgerPort = Pick<Ledger, "createRun" | "reserve" | "finish" | "summary" | "attempts" | "snapshot">;
