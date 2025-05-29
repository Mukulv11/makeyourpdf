import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    let htmlTemplate = ''
    let jsonData = ''
    let imageData = null
    let imageUrl = ''
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await request.formData()
      htmlTemplate = formData.get('template') as string
      jsonData = formData.get('data') as string
      const imageFile = formData.get('image') as File
      imageUrl = formData.get('imageUrl') as string
      
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        imageData = `data:${imageFile.type};base64,${buffer.toString('base64')}`
      }
    } else {
      // Handle JSON data
      const body = await request.json()
      htmlTemplate = body.template
      jsonData = body.data
      imageUrl = body.imageUrl || ''
    }

    if (!htmlTemplate || !jsonData) {
      return NextResponse.json(
        { error: 'Missing required fields: template and data' },
        { status: 400 }
      )
    }

    // Parse JSON data
    let data
    try {
      data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400 }
      )
    }

    // Process template with data
    const processedHtml = processTemplate(htmlTemplate, data, imageData || imageUrl)

    // Generate PDF using Puppeteer
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        timeout: 10000,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox'
        ]
      })
    } catch (error) {
      console.error('Failed to launch browser with new headless mode, trying legacy:', error)
      browser = await puppeteer.launch({
        headless: true,
        timeout: 10000,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox'
        ]
      })
    }

    const page = await browser.newPage()
    await page.setContent(processedHtml, { 
      waitUntil: 'domcontentloaded',
      timeout: 10000
    })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })

    await browser.close()

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="makeyourpdf-document.pdf"'
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

// Template processing function
function processTemplate(template: string, data: any, imageSource?: string): string {
  let processed = template

  // Handle image injection
  if (imageSource) {
    // Replace common image placeholders
    processed = processed.replace(/\$\{image\}/g, imageSource)
    processed = processed.replace(/\$\{logo\}/g, imageSource)
    processed = processed.replace(/\$\{photo\}/g, imageSource)
    
    // Add image to data object for template processing
    data.image = imageSource
    data.logo = imageSource
    data.photo = imageSource
  }

  // Handle simple variables ${variable}
  processed = processed.replace(/\$\{([^#\/\}]+)\}/g, (match, variable) => {
    const keys = variable.trim().split('.')
    let value = data
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return match // Return original if not found
      }
    }
    
    return value !== undefined ? String(value) : match
  })

  // Handle arrays ${#items}...${/items}
  processed = processed.replace(/\$\{#(\w+)\}([\s\S]*?)\$\{\/\1\}/g, (match, arrayName, content) => {
    const array = data[arrayName]
    if (!Array.isArray(array)) return match

    return array.map(item => {
      return content.replace(/\$\{([^#\/\}]+)\}/g, (innerMatch, variable) => {
        const keys = variable.trim().split('.')
        let value = item
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key]
          } else {
            return innerMatch
          }
        }
        
        return value !== undefined ? String(value) : innerMatch
      })
    }).join('')
  })

  return processed
} 