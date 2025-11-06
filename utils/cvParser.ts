import mammoth from "mammoth";

type PDFJSModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (params: { data: ArrayBuffer | Uint8Array }) => {
    promise: Promise<PDFDocumentProxy>;
  };
};

type PDFDocumentProxy = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
};

type PDFPageProxy = {
  getTextContent: () => Promise<TextContent>;
};

type TextItem = { str: string };
type TextContent = { items: TextItem[] };

async function loadPdfJs(): Promise<PDFJSModule> {
  if (typeof window === "undefined") {
    throw new Error("PDF parsing is only available in the browser.");
  }

  let pdfjs: unknown;

  try {
    pdfjs = await import("pdfjs-dist/build/pdf");
  } catch {
    pdfjs = await import("pdfjs-dist");
  }

  const pkgImport = (await import("pdfjs-dist/package.json")) as
    | { version?: string }
    | { default: { version?: string } };

  const ver =
    ("default" in pkgImport ? pkgImport.default.version : pkgImport.version) ??
    "3.11.174";

  const major = parseInt(ver.split(".")[0] ?? "3", 10);
  const base = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${ver}`;
  const workerUrl =
    major >= 3
      ? `${base}/build/pdf.worker.min.mjs`
      : `${base}/legacy/build/pdf.worker.min.js`;

  const mod = pdfjs as PDFJSModule;
  mod.GlobalWorkerOptions.workerSrc = workerUrl;

  return mod;
}

async function fetchCityCountry(address: string) {
  const query = address.replace(/\d{3,5}/g, "").trim();
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "SAP-Freelance-App" },
  });
  const data: unknown = await res.json();

  if (Array.isArray(data) && data[0] && typeof data[0] === "object") {
    const addr = (data[0] as { address?: Record<string, string> }).address;
    if (addr) {
      return {
        city:
          addr.city ||
          addr.town ||
          addr.village ||
          addr.hamlet ||
          addr.municipality,
        country: addr.country,
      };
    }
  }
  return { city: undefined, country: undefined };
}

export async function parseCV(file: File): Promise<{
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  experience?: string;
  rawText: string;
}> {
  let textContent = "";

  if (file.type === "application/pdf") {
    const { getDocument } = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      textContent += content.items.map((s: TextItem) => s.str).join(" ") + "\n";
    }
  } else if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    textContent = result.value;
  } else {
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  }

  const emailMatch = textContent.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  );
  const phoneMatch = textContent.match(
    /(\+?\(?\d{1,4}\)?[\s-]?\d{3,}[\s-]?\d{3,}\d*)/
  );

  const lines = textContent.split("\n").map((l) => l.trim());
  const addressLine = lines.find(
    (l) =>
      l.includes(",") &&
      (/\d{4,6}/.test(l) || l.includes("@") || l.includes("+"))
  );
  const nameMatch = lines.find((line) => line.trim().length > 0);
  const experienceMatch = textContent.match(/(\d+\+?)\s+(years?|yrs?)/i);

  let city: string | undefined;
  let country: string | undefined;

  if (addressLine) {
    const parts = addressLine.split(",").map((p) => p.trim());
    const filtered = parts.filter(
      (p) => !/^\d+/.test(p) && !/\b(street|road|ave|blvd|dr|rd)\b/i.test(p)
    );
    if (filtered.length >= 2) {
      city = filtered[filtered.length - 2];
      country = filtered[filtered.length - 1]
        .replace(/\d{4,6}/g, "")
        .replace(/•.*/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  if ((!city || !country) && addressLine) {
    const geo = await fetchCityCountry(addressLine);
    city = geo.city || city;
    country = geo.country || country;
  }

  return {
    fullName: nameMatch?.trim(),
    email: emailMatch?.[0],
    phone: phoneMatch?.[0],
    city,
    country,
    experience: experienceMatch?.[1],
    rawText: textContent,
  };
}
