
export const parseCSV = (content: string): { headers: string[], rows: any[] } => {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };

  // Simple CSV parser that handles basic quoting
  const parseLine = (line: string) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseLine(line);
    const row: Record<string, any> = {};
    headers.forEach((header, index) => {
      let val: any = values[index];
      // Try to parse as number if possible
      if (val && !isNaN(Number(val.replace(/[^0-9.-]+/g, ""))) && val !== '') {
         // Keep string if it's likely a phone number or ID (long string of digits)
         if (val.length < 15) {
            const num = Number(val.replace(/[^0-9.-]+/g, ""));
            val = num;
         }
      }
      row[header] = val;
    });
    return row;
  });

  return { headers, rows };
};

export const getCSVPreview = (rows: any[], limit: number = 5): string => {
  if (rows.length === 0) return "Tiada data.";
  const preview = rows.slice(0, limit);
  return JSON.stringify(preview, null, 2);
};
