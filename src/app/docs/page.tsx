'use client'

import React, { useState } from 'react'
import { FileText, Code, Copy, CheckCircle, ExternalLink, Zap, Shield, Palette } from 'lucide-react'

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const curlExample = 'curl -X POST http://localhost:3000/api/automation \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "template": "<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;margin:40px;}.header{text-align:center;margin-bottom:30px;}.items{margin:20px 0;}.total{text-align:right;font-weight:bold;}</style></head><body><div class=\\"header\\"><h1>${title}</h1><p>Company: ${company.name}</p></div><div class=\\"items\\"><h3>Items:</h3>${#items}<p>${description} - $${amount}</p>${/items}</div><div class=\\"total\\">Total: $${total}</div></body></html>",\n    "data": {\n      "title": "Invoice #001",\n      "company": {"name": "Acme Corp"},\n      "items": [\n        {"description": "Service A", "amount": 100},\n        {"description": "Service B", "amount": 200}\n      ],\n      "total": 300\n    }\n  }\' \\\n  --output invoice.pdf'

  const jsExample = 'const response = await fetch(\'/api/automation\', {\n  method: \'POST\',\n  headers: { \'Content-Type\': \'application/json\' },\n  body: JSON.stringify({\n    template: `<!DOCTYPE html>\n<html>\n<head>\n    <title>${title}</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 40px; }\n        .header { text-align: center; margin-bottom: 30px; }\n        .items { margin: 20px 0; }\n        .total { text-align: right; font-weight: bold; }\n    </style>\n</head>\n<body>\n    <div class="header">\n        <h1>${title}</h1>\n        <p>Company: ${company.name}</p>\n    </div>\n    <div class="items">\n        <h3>Items:</h3>\n        ${#items}\n        <p>${description} - $${amount}</p>\n        ${/items}\n    </div>\n    <div class="total">\n        Total: $${total}\n    </div>\n</body>\n</html>`,\n    data: {\n      title: "Invoice #001",\n      company: { name: "Acme Corp" },\n      items: [\n        { description: "Service A", amount: 100 },\n        { description: "Service B", amount: 200 }\n      ],\n      total: 300\n    }\n  })\n});\n\nif (response.ok) {\n  const blob = await response.blob();\n  const url = URL.createObjectURL(blob);\n  const a = document.createElement(\'a\');\n  a.href = url;\n  a.download = \'invoice.pdf\';\n  a.click();\n  URL.revokeObjectURL(url);\n} else {\n  const error = await response.json();\n  console.error(\'Error:\', error);\n}'

  const pythonExample = 'import requests\nimport json\n\n# Template and data\npayload = {\n    "template": """<!DOCTYPE html>\n<html>\n<head>\n    <title>${title}</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 40px; }\n        .header { text-align: center; margin-bottom: 30px; }\n        .items { margin: 20px 0; }\n        .total { text-align: right; font-weight: bold; }\n    </style>\n</head>\n<body>\n    <div class="header">\n        <h1>${title}</h1>\n        <p>Company: ${company.name}</p>\n    </div>\n    <div class="items">\n        <h3>Items:</h3>\n        ${#items}\n        <p>${description} - $${amount}</p>\n        ${/items}\n    </div>\n    <div class="total">\n        Total: $${total}\n    </div>\n</body>\n</html>""",\n    "data": {\n        "title": "Invoice #001",\n        "company": {"name": "Acme Corp"},\n        "items": [\n            {"description": "Service A", "amount": 100},\n            {"description": "Service B", "amount": 200}\n        ],\n        "total": 300\n    }\n}\n\n# Make request\nresponse = requests.post(\n    \'http://localhost:3000/api/automation\',\n    headers={\'Content-Type\': \'application/json\'},\n    json=payload\n)\n\n# Save PDF\nif response.status_code == 200:\n    with open(\'invoice.pdf\', \'wb\') as f:\n        f.write(response.content)\n    print("PDF generated successfully!")\nelse:\n    print(f"Error: {response.json()}")'

  const superblocksExample = '// Superblocks Integration Example\n// Step 1: Query BigQuery for data\nconst queryResult = await BigQuery1.trigger();\n\n// Step 2: Prepare template (store this as a variable or in your app)\nconst invoiceTemplate = `<!DOCTYPE html>\n<html>\n<head>\n    <title>${title}</title>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 40px; }\n        .header { text-align: center; margin-bottom: 30px; }\n        .company-info { margin: 20px 0; }\n        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }\n        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }\n        .items-table th { background-color: #f2f2f2; }\n        .total { text-align: right; font-weight: bold; margin-top: 20px; }\n    </style>\n</head>\n<body>\n    <div class="header">\n        <h1>${invoice.number}</h1>\n        <p>Date: ${invoice.date}</p>\n    </div>\n    <div class="company-info">\n        <h3>Bill To:</h3>\n        <p><strong>${customer.name}</strong><br>\n        ${customer.address}<br>\n        ${customer.city}, ${customer.state} ${customer.zip}</p>\n    </div>\n    <table class="items-table">\n        <thead>\n            <tr>\n                <th>Description</th>\n                <th>Quantity</th>\n                <th>Rate</th>\n                <th>Amount</th>\n            </tr>\n        </thead>\n        <tbody>\n            ${#line_items}\n            <tr>\n                <td>${description}</td>\n                <td>${quantity}</td>\n                <td>$${rate}</td>\n                <td>$${amount}</td>\n            </tr>\n            ${/line_items}\n        </tbody>\n    </table>\n    <div class="total">\n        <p>Subtotal: $${totals.subtotal}</p>\n        <p>Tax: $${totals.tax}</p>\n        <h3>Total: $${totals.total}</h3>\n    </div>\n</body>\n</html>`;\n\n// Step 3: Transform BigQuery data to match template variables\nconst templateData = {\n    invoice: {\n        number: queryResult[0].invoice_number,\n        date: queryResult[0].invoice_date\n    },\n    customer: {\n        name: queryResult[0].customer_name,\n        address: queryResult[0].customer_address,\n        city: queryResult[0].customer_city,\n        state: queryResult[0].customer_state,\n        zip: queryResult[0].customer_zip\n    },\n    line_items: queryResult.map(row => ({\n        description: row.item_description,\n        quantity: row.quantity,\n        rate: row.unit_price,\n        amount: row.line_total\n    })),\n    totals: {\n        subtotal: queryResult[0].subtotal,\n        tax: queryResult[0].tax_amount,\n        total: queryResult[0].total_amount\n    }\n};\n\n// Step 4: Generate PDF\nconst pdfResponse = await fetch(\'http://your-domain.com/api/automation\', {\n    method: \'POST\',\n    headers: { \'Content-Type\': \'application/json\' },\n    body: JSON.stringify({\n        template: invoiceTemplate,\n        data: templateData,\n        options: {\n            format: \'A4\',\n            margin: { top: \'0.5in\', right: \'0.5in\', bottom: \'0.5in\', left: \'0.5in\' }\n        }\n    })\n});\n\n// Step 5: Handle response\nif (pdfResponse.ok) {\n    const pdfBlob = await pdfResponse.blob();\n    // Save to file storage, email, or return to user\n    return { success: true, pdf: pdfBlob };\n} else {\n    const error = await pdfResponse.json();\n    throw new Error(`PDF generation failed: ${error.error}`);\n}'

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-blue-100/50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            makeyourpdf
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/" className="text-gray-600 hover:underline">Home</a>
          <a href="/start" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Try Now</a>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate PDF generation into your applications with our simple REST API. 
            Perfect for automation tools like Superblocks, Zapier, or custom applications.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            Quick Start
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Endpoint</h3>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                <span className="text-green-600 font-bold">POST</span> /api/automation
              </div>
              
              <h3 className="text-lg font-semibold mb-4 mt-6">Content-Type</h3>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                application/json
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Response</h3>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                <span className="text-blue-600">Success:</span> PDF file (application/pdf)<br/>
                <span className="text-red-600">Error:</span> JSON error object
              </div>
              
              <h3 className="text-lg font-semibold mb-4 mt-6">Documentation</h3>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                <span className="text-blue-600">GET</span> /api/automation
              </div>
            </div>
          </div>
        </div>

        {/* Request Format */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Format</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Required Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">template</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">HTML template with variables like $&#123;variable&#125; or $&#123;#array&#125;...$&#123;/array&#125;</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">data</td>
                      <td className="border border-gray-300 px-4 py-2">object</td>
                      <td className="border border-gray-300 px-4 py-2">JSON object containing data to populate template variables</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Optional Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Default</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">options.format</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">A4</td>
                      <td className="border border-gray-300 px-4 py-2">Page format (A4, Letter, Legal, etc.)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">options.landscape</td>
                      <td className="border border-gray-300 px-4 py-2">boolean</td>
                      <td className="border border-gray-300 px-4 py-2">false</td>
                      <td className="border border-gray-300 px-4 py-2">Page orientation</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">options.margin</td>
                      <td className="border border-gray-300 px-4 py-2">object</td>
                      <td className="border border-gray-300 px-4 py-2">1in all sides</td>
                      <td className="border border-gray-300 px-4 py-2">Page margins (top, right, bottom, left)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Template Variables */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Template Variables</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Simple Variables</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <code className="text-sm">
                  $&#123;title&#125; → "Invoice #001"<br/>
                  $&#123;company.name&#125; → "Acme Corp"<br/>
                  $&#123;customer.email&#125; → "john@example.com"
                </code>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Array Loops</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="text-sm">
                  $&#123;#items&#125;<br/>
                  &nbsp;&nbsp;$&#123;description&#125; - $&#123;amount&#125;<br/>
                  $&#123;/items&#125;
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Structure Example</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
{`{
  "title": "Invoice #001",
  "company": {
    "name": "Acme Corp",
    "email": "billing@acme.com"
  },
  "items": [
    {
      "description": "Service A",
      "amount": 100
    },
    {
      "description": "Service B", 
      "amount": 200
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-8">
          {/* cURL Example */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">cURL Example</h2>
              <button
                onClick={() => copyToClipboard(curlExample, 'curl')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {copiedCode === 'curl' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedCode === 'curl' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{curlExample}</code>
              </pre>
            </div>
          </div>

          {/* JavaScript Example */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">JavaScript Example</h2>
              <button
                onClick={() => copyToClipboard(jsExample, 'js')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {copiedCode === 'js' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedCode === 'js' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-blue-400 text-sm">
                <code>{jsExample}</code>
              </pre>
            </div>
          </div>

          {/* Python Example */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Python Example</h2>
              <button
                onClick={() => copyToClipboard(pythonExample, 'python')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {copiedCode === 'python' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedCode === 'python' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-yellow-400 text-sm">
                <code>{pythonExample}</code>
              </pre>
            </div>
          </div>

          {/* Superblocks Example */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Superblocks Integration</h2>
              <button
                onClick={() => copyToClipboard(superblocksExample, 'superblocks')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {copiedCode === 'superblocks' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedCode === 'superblocks' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Complete example showing how to integrate with Superblocks to query BigQuery and generate PDFs automatically.
            </p>
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-purple-400 text-sm">
                <code>{superblocksExample}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Error Handling */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Handling</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Common Error Responses</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm">
{`// 400 Bad Request - Missing required fields
{
  "error": "Missing required fields: template and data are required"
}

// 400 Bad Request - Invalid data type
{
  "error": "Template must be a string"
}

// 500 Internal Server Error - PDF generation failed
{
  "error": "Failed to generate PDF",
  "details": "Specific error message",
  "timestamp": "2024-01-01T12:00:00.000Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Testing */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Testing Your Integration</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">1. Test API Documentation</h3>
              <p className="text-gray-600 mb-4">
                First, verify the API is running by checking the documentation endpoint:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                GET /api/automation
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">2. Simple Test Request</h3>
              <p className="text-gray-600 mb-4">
                Start with a minimal template to verify basic functionality:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                &#123;"template": "&lt;h1&gt;$&#123;title&#125;&lt;/h1&gt;", "data": &#123;"title": "Test"&#125;&#125;
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center border border-gray-100">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-600">Generate PDFs in seconds with our optimized Puppeteer engine.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center border border-gray-100">
            <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">Enterprise-grade security with robust error handling and retry logic.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center border border-gray-100">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Developer Friendly</h3>
            <p className="text-gray-600">Simple REST API with comprehensive documentation and examples.</p>
          </div>
        </div>
      </div>
    </div>
  )
}