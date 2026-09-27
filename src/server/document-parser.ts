import mammoth from 'mammoth';

// Fallback helper to extract stream text from raw PDF buffer if library parsing has issues
function extractTextFromRawPdfBuffer(buffer: Buffer): string {
  try {
    const raw = buffer.toString('latin1');
    const textPieces: string[] = [];
    
    // Match text within BT ... ET blocks and string tokens (text) Tj or [(...)] TJ
    const tjRegex = /\(([^()]{2,})\)\s*(?:Tj|'|")/g;
    let match: RegExpExecArray | null;
    while ((match = tjRegex.exec(raw)) !== null) {
      const piece = match[1].replace(/\\([()\\])/g, '$1').trim();
      if (piece.length > 1 && !/^[0-9\s.,-]+$/.test(piece)) {
        textPieces.push(piece);
      }
    }
    
    return textPieces.join(' ').replace(/\s+/g, ' ').trim();
  } catch {
    return '';
  }
}

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string, originalName: string): Promise<string> {
  const ext = originalName.split('.').pop()?.toLowerCase();

  if (mimeType.includes('pdf') || ext === 'pdf') {
    try {
      // Dynamic import to handle pdf-parse in ESM/Node cleanly
      const pdfModule = await import('pdf-parse');
      let extracted = '';

      // pdf-parse v2+ exports a class PDFParse
      if ((pdfModule as any).PDFParse) {
        const PDFParseClass = (pdfModule as any).PDFParse;
        const parser = new PDFParseClass({ data: buffer });
        try {
          const textResult = await parser.getText();
          if (textResult) {
            if (Array.isArray(textResult.pages) && textResult.pages.length > 0) {
              extracted = textResult.pages
                .map((p: any) => p.text)
                .filter(Boolean)
                .join('\n\n');
            }
            if (!extracted && textResult.text) {
              extracted = textResult.text;
            }
          }
        } finally {
          try {
            await parser.destroy();
          } catch {
            // ignore cleanup errors
          }
        }
      } else if (typeof pdfModule === 'function') {
        const data = await (pdfModule as any)(buffer);
        extracted = data?.text || '';
      } else if (typeof (pdfModule as any).default === 'function') {
        const data = await (pdfModule as any).default(buffer);
        extracted = data?.text || '';
      }

      // Strip pdf-parse footer markings like "-- 1 of 1 --"
      extracted = extracted.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '').trim();

      // If library returned empty string (e.g. malformed or unusual stream), try stream fallback
      if (!extracted || extracted.length < 30) {
        const rawFallback = extractTextFromRawPdfBuffer(buffer);
        if (rawFallback && rawFallback.length >= 30) {
          extracted = rawFallback;
        }
      }

      if (!extracted || extracted.length < 20) {
        throw new Error('PDF file appears to be empty or contains only scanned images without selectable text. Try uploading as Word (.docx) or pasting the text directly.');
      }

      return extracted;
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      // Attempt raw fallback before giving up
      const rawFallback = extractTextFromRawPdfBuffer(buffer);
      if (rawFallback && rawFallback.length >= 30) {
        return rawFallback;
      }
      throw new Error(`Failed to parse PDF document: ${err.message || 'Unknown PDF error'}`);
    }
  }

  if (
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('msword') ||
    ext === 'docx' ||
    ext === 'doc'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (!result || !result.value || !result.value.trim()) {
        throw new Error('Word file appears to be empty or formatted as an older binary format.');
      }
      return result.value.trim();
    } catch (err: any) {
      console.error('DOCX parsing error:', err);
      // If user uploaded a plain text or RTF disguised as .doc
      const asString = buffer.toString('utf-8').trim();
      const printableChars = asString.replace(/[^\x20-\x7E\t\r\n]/g, '');
      if (printableChars.length > 50 && printableChars.length > asString.length * 0.5) {
        return printableChars.trim();
      }
      throw new Error(`Failed to parse Word document: ${err.message || 'Unknown DOCX error'}. Consider saving as .docx or uploading as PDF.`);
    }
  }

  if (mimeType.includes('text') || ext === 'txt' || ext === 'md' || ext === 'rtf') {
    const text = buffer.toString('utf-8').trim();
    if (!text) {
      throw new Error('Text file is empty.');
    }
    return text;
  }

  throw new Error(`Unsupported document format (.${ext}). CareerInsight AI supports PDF (.pdf), Word (.docx), and plain text (.txt).`);
}

