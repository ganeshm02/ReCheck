import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

export async function extractTextFromPDF(file) {
  console.log('[pdfParser] Starting extraction for:', file.name)

  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are supported.')
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be under 5MB.')
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  console.log('[pdfParser] PDF loaded — pages:', pdf.numPages)

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map(item => item.str)
      .join(' ')
    fullText += pageText + '\n\n'
    console.log(`[pdfParser] Page ${i} text length:`, pageText.length)
  }

  const cleanText = fullText.trim()
  console.log('[pdfParser] Total extracted text length:', cleanText.length)
  console.log('[pdfParser] Preview (first 300 chars):', cleanText.substring(0, 300))

  if (cleanText.length === 0) {
    throw new Error('Could not extract text from PDF. The file may be image-based or corrupted.')
  }

  return cleanText
}
