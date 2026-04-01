"use client";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const normalizeCellValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  return String(value);
};

export const buildExcelData = (rows = [], columns = []) => {
  if (!Array.isArray(columns) || columns.length === 0) {
    return [];
  }

  const headers = columns.map((column) => column.header || "");
  const body = rows.map((row, rowIndex) =>
    columns.map((column) => {
      const value =
        typeof column.accessor === "function"
          ? column.accessor(row, rowIndex)
          : row?.[column.accessor];

      return normalizeCellValue(value);
    })
  );

  return [headers, ...body];
};

export const exportToExcel = (data, filename, options = {}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  if (!filename.toLowerCase().endsWith(".xls") && !filename.toLowerCase().endsWith(".xlsx")) {
    filename += ".xls";
  }

  const excelTextStyle = ' style="mso-number-format:\\@;"';
  const {
    headerBgColor = "#4472C4",
    headerTextColor = "#FFFFFF",
    boldHeaders = true,
    forceText = false,
    textColumns = []
  } = options;

  const normalizedTextColumns = new Set(textColumns.map((column) => String(column || "").toLowerCase()));

  let tableHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ';
  tableHTML += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
  tableHTML += 'xmlns="http://www.w3.org/TR/REC-html40">';
  tableHTML += "<head>";
  tableHTML += '<meta charset="UTF-8">';
  tableHTML += "<!--[if gte mso 9]>";
  tableHTML += "<xml>";
  tableHTML += "<x:ExcelWorkbook>";
  tableHTML += "<x:ExcelWorksheets>";
  tableHTML += "<x:ExcelWorksheet>";
  tableHTML += "<x:Name>Sheet1</x:Name>";
  tableHTML += "<x:WorksheetOptions>";
  tableHTML += "<x:DisplayGridlines/>";
  tableHTML += "</x:WorksheetOptions>";
  tableHTML += "</x:ExcelWorksheet>";
  tableHTML += "</x:ExcelWorksheets>";
  tableHTML += "</x:ExcelWorkbook>";
  tableHTML += "</xml>";
  tableHTML += "<![endif]-->";
  tableHTML += "</head>";
  tableHTML += "<body>";
  tableHTML += '<table border="1">';

  tableHTML += "<thead><tr>";
  data[0].forEach((cell) => {
    const cellContent = escapeHtml(cell);
    const headerWeight = boldHeaders ? "bold" : "normal";
    tableHTML += `<th bgcolor="${headerBgColor}" style="color: ${headerTextColor}; font-weight: ${headerWeight}; text-align: center;">${cellContent}</th>`;
  });
  tableHTML += "</tr></thead>";

  tableHTML += "<tbody>";
  const headers = data[0] || [];

  data.slice(1).forEach((row) => {
    tableHTML += "<tr>";
    row.forEach((cell, columnIndex) => {
      const normalizedValue = normalizeCellValue(cell);
      const cellContent = escapeHtml(normalizedValue);
      const isNumber = !Number.isNaN(Number(cell)) && cell !== null && cell !== undefined && cell !== "";
      const hasLeadingZero = typeof cell === "string" && /^0\d+/.test(cell);
      const hasLeadingApostrophe = typeof cell === "string" && cell.startsWith("'");
      const headerLabel = String(headers[columnIndex] || "").toLowerCase();
      const isDateColumn =
        headerLabel.includes("date") || headerLabel.includes("dob") || headerLabel.includes("birth");
      const isTextSensitiveDateValue = typeof cell === "string" && /^'?\d{8}$/.test(cell);
      const isTextColumn = normalizedTextColumns.has(headerLabel);

      let style = "";
      if (forceText || isTextColumn) {
        style = excelTextStyle;
      } else if ((isDateColumn && isTextSensitiveDateValue) || hasLeadingZero || hasLeadingApostrophe) {
        style = excelTextStyle;
      } else if (isNumber) {
        style = ' style="mso-number-format:0"';
      }

      tableHTML += `<td${style}>${cellContent}</td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</tbody>";

  tableHTML += "</table>";
  tableHTML += "</body>";
  tableHTML += "</html>";

  const blob = new Blob([tableHTML], {
    type: "application/vnd.ms-excel"
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 100);
};
