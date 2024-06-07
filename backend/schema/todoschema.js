import { sql } from "drizzle-orm";
import { mysqlTable, varchar, text } from "drizzle-orm/mysql-core";

export const todo = mysqlTable("todo", {
  id: varchar("id", { length: 50 })
    .primaryKey()
    .default(sql`(uuid())`)
    .notNull(),
  title: text("title"),
  description: text("description"),
  status: text("status"),
});
