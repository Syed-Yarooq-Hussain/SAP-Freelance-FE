import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist";
import "pdfjs-dist/webpack";

async function fetchCityCountry(address: string) {
  const query = address.replace(/\d{3,5}/g, "").trim();

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "SAP-Freelance-App",
    },
  });
  const data = await res.json();

  if (data.length > 0 && data[0].address) {
    const addr = data[0].address;
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
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      textContent += text.items.map((s: any) => s.str).join(" ") + "\n";
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
  console.log("experienceMatch");
  console.log(experienceMatch);

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
    const geoInfo = await fetchCityCountry(addressLine);
    city = geoInfo.city || city;
    country = geoInfo.country || country;
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
