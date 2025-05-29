import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

// Template processing function
function processTemplate(template: string, data: any): string {
  let processed = template

  // Handle array loops first: ${#items}...${/items}
  processed = processed.replace(/\$\{#(\w+)\}([\s\S]*?)\$\{\/\1\}/g, (match, arrayName, content) => {
    const array = data[arrayName]
    if (!Array.isArray(array)) return ''

    return array.map(item => {
      let itemContent = content
      // Replace variables within the loop
      itemContent = itemContent.replace(/\$\{([^#\/\}]+)\}/g, (innerMatch, variable) => {
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
      return itemContent
    }).join('')
  })

  // Handle escaped array loops: \${#items}...\${/items}
  processed = processed.replace(/\\\$\{#(\w+)\}([\s\S]*?)\\\$\{\/\1\}/g, (match, arrayName, content) => {
    const array = data[arrayName]
    if (!Array.isArray(array)) return ''

    return array.map(item => {
      let itemContent = content
      // Replace variables within the loop
      itemContent = itemContent.replace(/\\\$\{([^#\/\}]+)\}/g, (innerMatch, variable) => {
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
      return itemContent
    }).join('')
  })

  // Handle simple variables: ${variable}
  processed = processed.replace(/\$\{([^#\/\}]+)\}/g, (match, variable) => {
    const keys = variable.trim().split('.')
    let value = data
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return ''
      }
    }
    
    return value !== undefined ? String(value) : ''
  })

  // Handle escaped variables: \${variable}
  processed = processed.replace(/\\\$\{([^#\/\}]+)\}/g, (match, variable) => {
    const keys = variable.trim().split('.')
    let value = data
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return ''
      }
    }
    
    return value !== undefined ? String(value) : ''
  })

  return processed
}

export async function GET() {
  return NextResponse.json({
    name: "MakeYourPDF Automation API",
    version: "1.0.0",
    description: "Generate PDFs programmatically from HTML templates and JSON data",
    endpoints: {
      "POST /api/automation": {
        description: "Generate PDF from template and data",
        contentType: "application/json",
        parameters: {
          template: {
            type: "string",
            required: true,
            description: "HTML template with variables like ${variable} or ${#array}...${/array}"
          },
          data: {
            type: "object",
            required: true,
            description: "JSON object containing data to populate template variables"
          },
          options: {
            type: "object",
            required: false,
            description: "PDF generation options",
            properties: {
              format: {
                type: "string",
                default: "A4",
                description: "Page format (A4, Letter, Legal, etc.)"
              },
              margin: {
                type: "object",
                default: { top: "1in", right: "1in", bottom: "1in", left: "1in" },
                description: "Page margins"
              },
              landscape: {
                type: "boolean",
                default: false,
                description: "Page orientation"
              },
              printBackground: {
                type: "boolean",
                default: true,
                description: "Include background graphics"
              }
            }
          }
        },
        response: {
          success: "PDF file (application/pdf)",
          error: "JSON error object"
        }
      }
    },
    examples: {
      "Basic Invoice": {
        template: `<!DOCTYPE html>
<html>
<head>
    <title>\${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .items { margin: 20px 0; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>\${title}</h1>
        <p>Company: \${company.name}</p>
    </div>
    <div class="items">
        <h3>Items:</h3>
        \${#items}
        <p>\${description} - $\${amount}</p>
        \${/items}
    </div>
    <div class="total">
        Total: $\${total}
    </div>
</body>
</html>`,
        data: {
          title: "Invoice #001",
          company: {
            name: "Acme Corp"
          },
          items: [
            { description: "Service A", amount: 100 },
            { description: "Service B", amount: 200 }
          ],
          total: 300
        }
      }
    },
    usage: {
      curl: `curl -X POST http://localhost:3000/api/automation \\
  -H "Content-Type: application/json" \\
  -d '{
    "template": "<!DOCTYPE html><html><body><h1>\${title}</h1></body></html>",
    "data": {"title": "My Document"}
  }' \\
  --output document.pdf`,
      javascript: `const response = await fetch('/api/automation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: '<!DOCTYPE html><html><body><h1>\${title}</h1></body></html>',
    data: { title: 'My Document' }
  })
});

if (response.ok) {
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  a.click();
}`,
      python: `import requests

payload = {
    "template": "<!DOCTYPE html><html><body><h1>\${title}</h1></body></html>",
    "data": {"title": "My Document"}
}

response = requests.post('http://localhost:3000/api/automation', json=payload)

if response.status_code == 200:
    with open('document.pdf', 'wb') as f:
        f.write(response.content)`
    }
  })
}

export async function POST(request: NextRequest) {
  let browser = null
  
  try {
    console.log('Automation API: Starting PDF generation...')
    const body = await request.json()
    console.log('Automation API: Request body received')
    
    // Validate required fields
    if (!body.template || !body.data) {
      console.log('Automation API: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: template and data are required' },
        { status: 400 }
      )
    }

    const { template, data, options = {} } = body

    // Validate template is string
    if (typeof template !== 'string') {
      console.log('Automation API: Template is not a string')
      return NextResponse.json(
        { error: 'Template must be a string' },
        { status: 400 }
      )
    }

    // Validate data is object
    if (typeof data !== 'object' || data === null) {
      console.log('Automation API: Data is not an object')
      return NextResponse.json(
        { error: 'Data must be a JSON object' },
        { status: 400 }
      )
    }

    console.log('Automation API: Processing template...')
    // Process template with data
    const processedHtml = processTemplate(template, data)
    console.log('Automation API: Template processed, length:', processedHtml.length)

    // Default PDF options
    const pdfOptions = {
      format: options.format || 'A4',
      margin: options.margin || {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      },
      landscape: options.landscape || false,
      printBackground: options.printBackground !== false,
      preferCSSPageSize: true,
      ...options
    }

    console.log('Automation API: Launching Puppeteer...')
    // Launch Puppeteer with retry logic
    const launchOptions = {
      headless: "new" as const,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    }

    try {
      browser = await puppeteer.launch(launchOptions)
      console.log('Automation API: Puppeteer launched successfully')
    } catch (error) {
      console.log('Automation API: First launch attempt failed, trying with different config...', error)
      // Try without specifying executable path (use bundled Chromium)
      const fallbackOptions = {
        headless: "new" as const,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--single-process',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      }
      
      try {
        browser = await puppeteer.launch(fallbackOptions)
        console.log('Automation API: Puppeteer launched with fallback config')
      } catch (fallbackError) {
        console.log('Automation API: Fallback launch also failed, trying minimal config...', fallbackError)
        // Last resort: minimal configuration
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        console.log('Automation API: Puppeteer launched with minimal config')
      }
    }

    console.log('Automation API: Creating new page...')
    const page = await browser.newPage()
    
    // Set longer timeouts
    page.setDefaultTimeout(30000)
    page.setDefaultNavigationTimeout(30000)

    console.log('Automation API: Setting page content...')
    // Set content and wait for it to load
    await page.setContent(processedHtml, { 
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000 
    })
    console.log('Automation API: Page content set successfully')

    console.log('Automation API: Generating PDF...')
    // Generate PDF with retry
    let pdfBuffer
    try {
      pdfBuffer = await page.pdf(pdfOptions)
      console.log('Automation API: PDF generated successfully, size:', pdfBuffer.length)
    } catch (error) {
      console.log('Automation API: First PDF generation failed, retrying...', error)
      await page.waitForTimeout(1000)
      pdfBuffer = await page.pdf(pdfOptions)
      console.log('Automation API: PDF generated on retry, size:', pdfBuffer.length)
    }

    await browser.close()
    console.log('Automation API: Browser closed')

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Automation API: PDF generation error:', error)
    console.error('Automation API: Error type:', typeof error)
    console.error('Automation API: Error constructor:', error?.constructor?.name)
    console.error('Automation API: Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Clean up browser if it exists
    if (browser) {
      try {
        await browser.close()
        console.log('Automation API: Browser cleaned up after error')
      } catch (closeError) {
        console.error('Automation API: Error closing browser:', closeError)
      }
    }

    // Get detailed error message
    let errorMessage = 'Unknown error'
    let errorDetails = null
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error)
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: errorMessage,
        stack: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 