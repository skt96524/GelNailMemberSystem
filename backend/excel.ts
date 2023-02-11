import XLSX from "xlsx";
import path from "path";

interface productnails {
  image: string;
  intro: string;
}

interface plan {
  image: string;
  intro: string;
  plan_name: string;
}

interface shop {
  image: string;
  intro: string;
  area: string;
  address: string;
  shopname: string;
}

interface user {
  image: string;
  username: string;
  nickname: string;
}

interface booking {
  schedule: number;
  booking_status: string;
  apply_time: number;
}

interface article {
  title: string;
  main_img: string;
  html_content: string;
  views: number;
  article_status: string;
}

let workbook = XLSX.readFile(path.join("sampledata.xlsx"));

let Sheet1 = workbook.Sheets.Sheet1;
let Sheet2 = workbook.Sheets.Sheet2;
let Sheet3 = workbook.Sheets.Sheet3;
let Sheet4 = workbook.Sheets.Sheet4;
let Sheet5 = workbook.Sheets.Sheet5;
let Sheet6 = workbook.Sheets.Sheet6;

export let productnails = XLSX.utils.sheet_to_json<productnails>(Sheet1);
export let plans = XLSX.utils.sheet_to_json<plan>(Sheet2);
export let shops = XLSX.utils.sheet_to_json<shop>(Sheet3);
export let users = XLSX.utils.sheet_to_json<user>(Sheet4);
export let booking = XLSX.utils.sheet_to_json<booking>(Sheet5);
export let article = XLSX.utils.sheet_to_json<article>(Sheet6);
