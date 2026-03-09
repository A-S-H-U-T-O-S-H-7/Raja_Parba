import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { jsPDF } from "jspdf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, "CLIENT_PROJECT_OVERVIEW.md");
const outputPath = path.join(__dirname, "Raja_Festival_Project_Overview_Client.pdf");

const markdown = fs.readFileSync(sourcePath, "utf8");
const lines = markdown.replace(/\r\n/g, "\n").split("\n");

const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const marginX = 48;
const marginTop = 52;
const marginBottom = 48;
const contentWidth = pageWidth - marginX * 2;

let y = marginTop;
let page = 1;

const addFooter = () => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Page ${page}`, pageWidth - marginX, pageHeight - 20, { align: "right" });
};

const newPage = () => {
  addFooter();
  doc.addPage();
  page += 1;
  y = marginTop;
};

const ensureSpace = (requiredHeight) => {
  if (y + requiredHeight > pageHeight - marginBottom) {
    newPage();
  }
};

const writeWrapped = (text, fontSize, lineHeight, style = "normal", color = [20, 20, 20]) => {
  doc.setFont("helvetica", style);
  doc.setFontSize(fontSize);
  doc.setTextColor(color[0], color[1], color[2]);

  const wrapped = doc.splitTextToSize(text, contentWidth);
  const required = wrapped.length * lineHeight;
  ensureSpace(required);

  for (const line of wrapped) {
    doc.text(line, marginX, y);
    y += lineHeight;
  }
};

for (const rawLine of lines) {
  const line = rawLine.trimEnd();

  if (!line.trim()) {
    y += 6;
    continue;
  }

  if (line.startsWith("# ")) {
    y += 4;
    writeWrapped(line.replace(/^#\s+/, ""), 17, 22, "bold", [15, 35, 95]);
    y += 4;
    continue;
  }

  if (line.startsWith("## ")) {
    y += 6;
    writeWrapped(line.replace(/^##\s+/, ""), 13, 18, "bold", [30, 45, 70]);
    y += 2;
    continue;
  }

  if (line.startsWith("### ")) {
    y += 4;
    writeWrapped(line.replace(/^###\s+/, ""), 11.5, 16, "bold", [40, 40, 40]);
    continue;
  }

  if (line === "---") {
    ensureSpace(14);
    doc.setDrawColor(180, 180, 180);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 10;
    continue;
  }

  if (line.startsWith("- ")) {
    const bulletText = `• ${line.replace(/^-\s+/, "")}`;
    writeWrapped(bulletText, 10.5, 14.5, "normal", [35, 35, 35]);
    continue;
  }

  if (/^\d+\.\s+/.test(line)) {
    writeWrapped(line, 10.5, 14.5, "normal", [35, 35, 35]);
    continue;
  }

  writeWrapped(line, 10.5, 14.5, "normal", [35, 35, 35]);
}

addFooter();

const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
fs.writeFileSync(outputPath, pdfBuffer);

console.log(`PDF generated: ${outputPath}`);
