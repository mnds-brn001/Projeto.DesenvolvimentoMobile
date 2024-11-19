

export const initializeDatabase = async (db) => {

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS barbers (
      name TEXT DEFAULT "Barbeiro",
      surname TEXT DEFAULT "Anônimo",
      username TEXT DEFAULT "barbeiro",
      password TEXT DEFAULT "123"
    );

    CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact TEXT,
    service_type TEXT,
    status BOLLEAN DEFAULT 1,
    date TEXT DEFAULT (datetime('now', '-3 hours'))
    );

    INSERT INTO barbers DEFAULT VALUES;
  `)

}