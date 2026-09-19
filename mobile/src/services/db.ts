import * as SQLite from "expo-sqlite";
import { Vehicle, ExpenseRecord, TripTelemetry, InspectionAngle } from "../types";

const DB_NAME = "drivesense_v1.db";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  try {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await initSchema(dbInstance);
    return dbInstance;
  } catch (err) {
    console.warn("SQLite openDatabaseAsync warning:", err);
    throw err;
  }
}

async function initSchema(db: SQLite.SQLiteDatabase) {
  // 1. Vehicles Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      trim TEXT,
      licensePlate TEXT NOT NULL,
      fuelType TEXT NOT NULL,
      odometerKm REAL NOT NULL,
      avgEfficiencyKmpl REAL NOT NULL,
      healthScore INTEGER NOT NULL,
      healthStatus TEXT NOT NULL,
      subsystems TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // 2. Inspection Angles / Sessions Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspection_checkpoints (
      id TEXT PRIMARY KEY NOT NULL,
      vehicleId TEXT NOT NULL,
      angleId TEXT NOT NULL,
      zone TEXT NOT NULL,
      status TEXT NOT NULL,
      damageDetected INTEGER NOT NULL DEFAULT 0,
      damageSeverity TEXT,
      notes TEXT,
      photoUri TEXT,
      capturedAt TEXT NOT NULL
    );
  `);

  // 3. Expenses & Fuel Logs Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      vehicleId TEXT NOT NULL,
      category TEXT NOT NULL,
      amountInr REAL NOT NULL,
      liters REAL,
      costPerLiter REAL,
      odometerKm REAL,
      date TEXT NOT NULL,
      notes TEXT
    );
  `);

  // 4. Drive Telemetry Logs Table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS drive_logs (
      tripId TEXT PRIMARY KEY NOT NULL,
      vehicleId TEXT NOT NULL,
      durationSeconds INTEGER NOT NULL,
      distanceKm REAL NOT NULL,
      avgSpeedKmh REAL NOT NULL,
      fuelBurnedLiters REAL NOT NULL,
      efficiencyKmpl REAL NOT NULL,
      routePointsJson TEXT NOT NULL,
      startedAt TEXT NOT NULL,
      endedAt TEXT
    );
  `);
}

// Vehicle CRUD
export async function saveVehicleToDb(vehicle: Vehicle): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO vehicles (
      id, brand, model, year, trim, licensePlate, fuelType,
      odometerKm, avgEfficiencyKmpl, healthScore, healthStatus,
      subsystems, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      vehicle.id,
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.trim || "",
      vehicle.licensePlate,
      vehicle.fuelType,
      vehicle.odometerKm,
      vehicle.avgEfficiencyKmpl,
      vehicle.healthScore,
      vehicle.healthStatus,
      JSON.stringify(vehicle.subsystems),
      vehicle.createdAt,
      vehicle.updatedAt,
    ]
  );
}

export async function getAllVehiclesFromDb(): Promise<Vehicle[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>("SELECT * FROM vehicles ORDER BY createdAt DESC;");
  return rows.map((r) => ({
    ...r,
    subsystems: JSON.parse(r.subsystems),
  }));
}

// Expenses CRUD
export async function insertExpenseToDb(expense: ExpenseRecord): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO expenses (id, vehicleId, category, amountInr, liters, costPerLiter, odometerKm, date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      expense.id,
      expense.vehicleId,
      expense.category,
      expense.amountInr,
      expense.liters || null,
      expense.costPerLiter || null,
      expense.odometerKm || null,
      expense.date,
      expense.notes || "",
    ]
  );
}

export async function getExpensesForVehicle(vehicleId: string): Promise<ExpenseRecord[]> {
  const db = await getDatabase();
  return await db.getAllAsync<ExpenseRecord>(
    "SELECT * FROM expenses WHERE vehicleId = ? ORDER BY date DESC;",
    [vehicleId]
  );
}
