import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import type { AppUser } from "../../pages/admin/UsersDataDashboard";

/* Normalize data for export */
const formatUsers = (users: AppUser[]) =>
  users.map(u => ({
    ID: u.idNumber,
    First_Name: u.firstName,
    Last_Name: u.lastName,
    Email: u.email,
    Role: u.role,
    Course: u.course,
    Faculty: u.faculty,
    Created_At: new Date(u.createdAt).toLocaleDateString()
  }));

/* CSV EXPORT */
export const exportToCSV = (users: AppUser[]) => {
  const csv = Papa.unparse(formatUsers(users));
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "users.csv");
};

/* EXCEL EXPORT */
export const exportToExcel = (users: AppUser[]) => {
  const worksheet = XLSX.utils.json_to_sheet(formatUsers(users));
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  XLSX.writeFile(workbook, "users.xlsx");
};
