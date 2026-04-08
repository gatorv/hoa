import "dotenv/config";
import { google } from "googleapis";
import {
  toObject,
  toFlatArray,
  calculatePending,
  formatCurrency,
  formatDate,
} from "../lib/helpers.js";

export default async function () {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.SHEET_ID) {
    throw new Error(
      "Missing required environment variables: GOOGLE_SERVICE_ACCOUNT_KEY and SHEET_ID",
    );
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SHEET_ID;
  const spreadsheetGenerales = process.env.SHEET_GENERALES;
  const spreadsheetCasas = process.env.SHEET_CASAS;

  // Fetch general configuration
  const responseGeneral = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: spreadsheetGenerales,
  });

  const config = toObject(responseGeneral.data.values);

  // Fetch houses that have contributed
  const responseHouses = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: spreadsheetCasas,
  });

  // Process data
  const houses = toFlatArray(responseHouses.data.values);
  const progress = ((houses.length / config.total_houses) * 100).toFixed(2);
  const pending = calculatePending(config.total_houses, houses);
  const totalCollected = formatCurrency(
    config.donation_by_house * houses.length,
  );
  const goalToCollect = formatCurrency(config.total_collect);
  const updatedAtFormatted = formatDate(new Date());

  return {
    config,
    houses,
    progress,
    pending,
    totalCollected,
    goalToCollect,
    updatedAtFormatted,
  };
}
