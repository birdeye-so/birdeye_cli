import { Command } from "commander";
import { z } from "zod";
import { extendedCatalog } from "./extended-catalog.js";
import { skillCatalog } from "./skill-catalog.js";
import { AppError, type Data } from "./shared.js";

/** Build command flags from the same schemas exposed to AI tools. */
export function registerDataCommands(
  program: Command,
  execute: (op: string, params: Data, command: Command) => Promise<void>,
) {
  for (const [operation, entry] of Object.entries({
    ...extendedCatalog,
    ...skillCatalog,
  })) {
    const [groupName, name] = operation.split(".");
    const group =
      program.commands.find((c) => c.name() === groupName) ||
      program.command(groupName);
    const schema = z.toJSONSchema(entry.schema) as Data;
    const properties: Data = schema.properties;
    const positional =
      operation === "token.search"
        ? "keyword"
        : properties.token_address
          ? "token_address"
          : properties.wallet
            ? "wallet"
            : properties.address
              ? "address"
              : undefined;
    const command = group
      .command(name + (positional ? ` <${positional}>` : ""))
      .description(entry.description);
    for (const [key, field] of Object.entries<Data>(properties)) {
      if (key === positional || key === "chain") continue;
      const choices = field.enum || field.items?.enum;
      const help = `${key}${choices ? ` (${choices.join(", ")})` : ""}${field.default !== undefined ? `; default ${JSON.stringify(field.default)}` : ""}`;
      command.option(
        `--${key.replaceAll("_", "-")} <value>`,
        help,
        (value: string) => {
          if (field.type === "boolean") {
            if (!["true", "false"].includes(value))
              throw new AppError(
                "INVALID_INPUT",
                `${key} must be true or false`,
              );
            return value === "true";
          }
          if (field.type === "array")
            return value.split(",").map((v) => v.trim());
          if (field.type === "integer" || field.type === "number") {
            if (!value.trim() || !Number.isFinite(Number(value)))
              throw new AppError("INVALID_INPUT", `${key} must be a number`);
            return Number(value);
          }
          return value;
        },
      );
    }
    command.action(async (...args: any[]) => {
      const c: Command = args.at(-1);
      const params: Data = {};
      if (positional) params[positional] = args[0];
      for (const [key, value] of Object.entries(c.opts()))
        params[key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)] =
          value;
      await execute(operation, params, c);
    });
  }
}
