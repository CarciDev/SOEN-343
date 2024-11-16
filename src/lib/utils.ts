import { getModeUserPrefers } from "@skeletonlabs/skeleton";
import type { TrackingStatus } from "./domain/TrackingStatus";

export function centsToDollars(price: number): string {
  // Divide by 100 to convert cents to dollars
  const dollars = Math.abs(price) / 100; // Taking absolute value to handle negative prices
  const sign = price < 0 ? "-" : ""; // Adding a negative sign if price is negative
  return `${sign}$${dollars.toFixed(2)}`;
}

export function formatDbReservationDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTrackingStatus(ts: TrackingStatus | string): string {
  switch (ts) {
    case "PICKED_UP_AT_ORIGIN":
      return "Picked up at origin";
    case "FACILITY_TRANSIT":
      return "Transit through facility";
    case "OUT_FOR_DELIVERY":
      return "On delivery vehicle";
    case "DELIVERED":
      return "Delivered";
    default:
      return "Other status";
  }
}

export async function setFlatpickrTheme() {
  if (getModeUserPrefers()) {
    await import("flatpickr/dist/themes/material_blue.css");
  } else {
    await import("flatpickr/dist/themes/dark.css");
  }
}

export function getReservationDuration(startDate: Date, endDate: Date): number {
  return Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function parseDate(dateString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const day = parseInt(dayStr);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error("Invalid date format");
  }

  return new Date(year, month, day);
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "CAD",
  });
}

/**
 * Converts an ArrayBuffer to a Node.js Buffer.
 *
 * @param {ArrayBuffer} ab - The ArrayBuffer to convert.
 * @returns {Buffer} - A new Buffer containing the same data as the ArrayBuffer.
 */
export function toBuffer(ab: ArrayBuffer): Buffer {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab); // Create an array view over the ArrayBuffer to access its data
  for (let i = 0; i < buf.length; i++) {
    buf[i] = view[i];
  } // Copy each byte to the Buffer
  return buf;
}
