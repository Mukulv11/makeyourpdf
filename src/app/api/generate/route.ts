import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

// Handle GET requests - API documentation
export async function GET() {
  return NextResponse.json({
    message: "PDF Generation API",
    version: "1.0.0",
    endpoints: {
      POST: "/api/generate",
      description: "Generate PDF from HTML template and JSON data",
      parameters: {
        template: "HTML template string (required)",
        data: "JSON data string (required)", 
        image: "Image file (optional)",
        imageUrl: "Image URL (optional)"
      }
    },
    example: {
      template: "<!DOCTYPE html><html><body><h1>${title}</h1><img src=\"${logo}\" /></body></html>",
      data: JSON.stringify({ title: "My Document", logo: "data:image/..." })
    }
  })
}

// Handle POST requests - PDF generation
export async function POST(request: NextRequest) {
  let browser = null
  
  try {
    // Parse form data
    const formData = await request.formData()
    const template = formData.get('template') as string
    const dataString = formData.get('data') as string
    const imageFile = formData.get('image') as File | null
    const imageUrl = formData.get('imageUrl') as string | null

    // Validate required fields
    if (!template || !dataString) {
      return NextResponse.json(
        { error: 'Template and data are required' },
        { status: 400 }
      )
    }

    // Parse JSON data
    let data
    try {
      data = JSON.parse(dataString)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON data format' },
        { status: 400 }
      )
    }

    // Handle image processing - support multiple images
    const images: { [key: string]: string } = {}
    
    // Process single image (backward compatibility)
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      images.image = `data:${imageFile.type};base64,${base64}`
      images.logo = images.image
      images.photo = images.image
    } else if (imageUrl) {
      images.image = imageUrl
      images.logo = imageUrl
      images.photo = imageUrl
    }

    // Process multiple images
    const formEntries = Array.from(formData.entries())
    for (const [key, value] of formEntries) {
      if (key.startsWith('image') && key !== 'image' && value instanceof File) {
        const bytes = await value.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        images[key] = `data:${value.type};base64,${base64}`
      } else if (key.startsWith('imageUrl') && key !== 'imageUrl' && typeof value === 'string' && value.trim()) {
        const imageKey = key.replace('Url', '')
        images[imageKey] = value.trim()
      }
    }

    // Process template with data and images
    const processedHtml = processTemplate(template, data, images)

    // Try PDF generation with retry logic
    let pdfBuffer
    let attempt = 0
    const maxAttempts = 2

    while (attempt < maxAttempts) {
      try {
        attempt++
        console.log(`PDF generation attempt ${attempt}/${maxAttempts}`)

        // Launch Puppeteer with different configs for each attempt
        const launchConfig = attempt === 1 ? {
          headless: "new" as const,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ],
          timeout: 60000,
          protocolTimeout: 60000
        } : {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
          ],
          timeout: 30000
        }

        browser = await puppeteer.launch(launchConfig)
        const page = await browser.newPage()
        
        // Set viewport and user agent for better compatibility
        await page.setViewport({ width: 1200, height: 800 })
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        // Set content with a more reliable approach
        await page.setContent(processedHtml, { 
          waitUntil: 'load',
          timeout: 30000 
        })

        // Wait for any fonts or images to load
        await page.waitForTimeout(attempt === 1 ? 2000 : 1000)

        // Generate PDF with error handling
        pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          timeout: 30000,
          preferCSSPageSize: false
        })

        await browser.close()
        browser = null
        break // Success, exit retry loop

      } catch (attemptError) {
        console.error(`Attempt ${attempt} failed:`, attemptError)
        
        if (browser) {
          try {
            await browser.close()
          } catch (closeError) {
            console.error('Error closing browser:', closeError)
          }
          browser = null
        }

        if (attempt === maxAttempts) {
          throw attemptError // Re-throw if all attempts failed
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    
    // Clean up browser if it exists
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    // Provide more specific error messages
    let errorMessage = 'Failed to generate PDF'
    let errorDetails = error instanceof Error ? error.message : 'Unknown error'

    if (errorDetails.includes('Navigating frame was detached')) {
      errorMessage = 'PDF generation failed due to browser session issue'
      errorDetails = 'Please try again. If the problem persists, try using the client-side generation option.'
    } else if (errorDetails.includes('Session closed') || errorDetails.includes('Protocol error')) {
      errorMessage = 'Browser session was closed unexpectedly'
      errorDetails = 'Please try again. This can happen due to resource constraints.'
    } else if (errorDetails.includes('timeout')) {
      errorMessage = 'PDF generation timed out'
      errorDetails = 'The document took too long to process. Try simplifying your template or reducing image sizes.'
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        suggestion: 'Try using the "Download PDF (Client)" button as an alternative.'
      },
      { status: 500 }
    )
  }
}

// Template processing function
function processTemplate(template: string, data: any, images?: { [key: string]: string } | null): string {
  let processed = template

  // Handle image injection
  if (images && Object.keys(images).length > 0) {
    // Replace image placeholders with actual images
    for (const [key, imageUrl] of Object.entries(images)) {
      // Replace both ${key} and \${key} patterns
      processed = processed.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), imageUrl)
      processed = processed.replace(new RegExp(`\\\\\\$\\{${key}\\}`, 'g'), imageUrl)
      
      // Add to data object for template processing
      data[key] = imageUrl
    }
  } else {
    // Remove image tags if no images provided
    const imageKeys = ['image', 'logo', 'photo']
    for (let i = 1; i <= 10; i++) {
      imageKeys.push(`image${i}`)
    }
    
    imageKeys.forEach(key => {
      processed = processed.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), '')
      processed = processed.replace(new RegExp(`\\\\\\$\\{${key}\\}`, 'g'), '')
    })
  }

  // Handle simple variables ${variable}
  processed = processed.replace(/\$\{([^#\/\}]+)\}/g, (match, variable) => {
    const keys = variable.trim().split('.')
    let value = data
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return '' // Return empty string if not found
      }
    }
    
    return value !== undefined ? String(value) : ''
  })

  // Handle arrays ${#items}...${/items}
  processed = processed.replace(/\$\{#(\w+)\}([\s\S]*?)\$\{\/\1\}/g, (match, arrayName, content) => {
    const array = data[arrayName]
    if (!Array.isArray(array)) return ''

    return array.map(item => {
      return content.replace(/\$\{([^#\/\}]+)\}/g, (innerMatch, variable) => {
        const keys = variable.trim().split('.')
        let value = item
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key]
          } else {
            return ''
          }
        }
        
        return value !== undefined ? String(value) : ''
      })
    }).join('')
  })

  return processed
} 