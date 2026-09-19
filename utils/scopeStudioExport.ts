import type { ScopeBlock, ScopeDocument } from "@/types/scopeStudio";
import { scopeMarkdown, visibleScopeText } from "@/utils/scopeStudio";

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const fileName = (doc: ScopeDocument) =>
  (doc.hideCompany ? "Client" : String(doc.answers.company || "Client"))
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .slice(0, 80) + "-Scope";
const lines = (block: ScopeBlock) =>
  block.type === "table"
    ? [block.headers, ...block.rows].map((row) => row.join(" | "))
    : block.type === "list"
      ? block.items
      : [block.text];

export async function exportScope(
  doc: ScopeDocument,
  format: "md" | "docx" | "xlsx" | "pdf",
) {
  const clean = (text: string) => visibleScopeText(text, doc);
  if (format === "md") {
    download(
      `${fileName(doc)}.md`,
      new Blob([scopeMarkdown(doc)], { type: "text/markdown;charset=utf-8" }),
    );
    return;
  }
  if (format === "docx") {
    const D = await import("docx");
    const children: (
      InstanceType<typeof D.Paragraph> | InstanceType<typeof D.Table>
    )[] = [
      new D.Paragraph({
        text: clean(
          `${String(doc.answers.company || "Client")} — Project Scope`,
        ),
        heading: D.HeadingLevel.TITLE,
      }),
    ];
    for (const section of doc.sections) {
      children.push(
        new D.Paragraph({
          text: section.title,
          heading: D.HeadingLevel.HEADING_1,
        }),
      );
      for (const block of section.blocks) {
        if (block.type === "table")
          children.push(
            new D.Table({
              rows: [block.headers, ...block.rows].map(
                (row) =>
                  new D.TableRow({
                    children: row.map(
                      (cell) =>
                        new D.TableCell({
                          children: [new D.Paragraph(clean(cell))],
                        }),
                    ),
                  }),
              ),
            }),
          );
        else
          for (const text of lines(block))
            children.push(
              new D.Paragraph({
                text: clean(text),
                ...(block.type === "list" ? { bullet: { level: 0 } } : {}),
                spacing: { after: 120 },
              }),
            );
      }
    }
    download(
      `${fileName(doc)}.docx`,
      await D.Packer.toBlob(new D.Document({ sections: [{ children }] })),
    );
    return;
  }
  if (format === "xlsx") {
    const E = await import("exceljs");
    const workbook = new E.Workbook();
    const scope = workbook.addWorksheet("Scope");
    scope.columns = [
      { header: "Section", key: "section", width: 32 },
      { header: "Requirement / details", key: "detail", width: 105 },
    ];
    for (const section of doc.sections)
      for (const block of section.blocks)
        for (const text of lines(block))
          scope.addRow({ section: section.title, detail: clean(text) });
    const response = workbook.addWorksheet("Vendor response");
    response.addRow([
      "Reference",
      "Area",
      "Requirement",
      "Vendor response",
      "Effort (days)",
      "Cost",
      "Comments",
    ]);
    let index = 0;
    for (const section of doc.sections.filter((s) =>
      ["scope", "landscape", "compliance", "governance"].includes(s.id),
    ))
      for (const block of section.blocks) {
        const requirements =
          block.type === "table"
            ? block.rows.map((row) => row.join(": "))
            : lines(block);
        for (const text of requirements)
          response.addRow([
            `R${++index}`,
            section.title,
            clean(text),
            "",
            "",
            "",
            "",
          ]);
      }
    response.columns.forEach((column, i) => {
      column.width = i === 2 ? 75 : i === 0 ? 12 : 25;
    });
    for (const sheet of workbook.worksheets) {
      sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF19212C" },
      };
      sheet.eachRow((row) => {
        row.alignment = { vertical: "top", wrapText: true };
      });
      sheet.views = [{ state: "frozen", ySplit: 1 }];
    }
    const buffer = await workbook.xlsx.writeBuffer();
    download(
      `${fileName(doc)}.xlsx`,
      new Blob([new Uint8Array(buffer)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
    );
    return;
  }
  const printWindow = window.open("", "_blank");
  if (!printWindow)
    throw new Error("Allow pop-ups to open the PDF print preview.");
  printWindow.opener = null;
  const escape = (s: string) =>
    clean(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    );
  printWindow.document.write(
    `<!doctype html><html><head><title>${escape(fileName(doc))}</title><style>body{font:12px/1.6 Arial;color:#18232f;max-width:800px;margin:30px auto}h1{font:32px Georgia}h2{font:22px Georgia;break-after:avoid}p,li{white-space:pre-wrap}table{width:100%;border-collapse:collapse;font-size:11px;table-layout:fixed}td,th{padding:8px;border:1px solid #ccd3da;text-align:left;overflow-wrap:anywhere}tr{break-inside:avoid}thead{display:table-header-group}.note{border-left:3px solid #c58b31;padding:10px}button{padding:10px 20px;margin:20px 0}@page{margin:18mm}@media print{body{margin:0}button{display:none}}</style></head><body><button onclick="window.print()">Print / Save as PDF</button><h1>${escape(String(doc.answers.company || "Client"))} — Project Scope</h1>${doc.sections.map((section) => `<section><h2>${escape(section.title)}</h2>${section.blocks.map((block) => (block.type === "table" ? `<table><thead><tr>${block.headers.map((s) => `<th>${escape(s)}</th>`).join("")}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((s) => `<td>${escape(s)}</td>`).join("")}</tr>`).join("")}</tbody></table>` : block.type === "list" ? `<ul>${block.items.map((s) => `<li>${escape(s)}</li>`).join("")}</ul>` : `<p class="${block.type === "note" ? "note" : ""}">${escape(block.text)}</p>`)).join("")}</section>`).join("")}</body></html>`,
  );
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export async function readLocalScopeFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "txt" || extension === "md") return file.text();
  if (extension === "docx") {
    const mammoth = await import("mammoth");
    return (
      await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    ).value;
  }
  throw new Error("Upload a Word (.docx), Markdown or text document.");
}
