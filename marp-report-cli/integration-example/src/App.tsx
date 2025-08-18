import React from 'react'
import { ReportRenderer } from './components/ReportRenderer'
import reportData from './data/test-report.json'

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">{reportData.frontmatter.title || 'Marp Report'}</h1>
        <div className="meta">
          {reportData.frontmatter.author && (
            <div className="meta-item">
              <span>👤</span>
              <span>{reportData.frontmatter.author}</span>
            </div>
          )}
          <div className="meta-item">
            <span>📅</span>
            <span>{new Date(reportData.metadata.generatedAt).toLocaleDateString()}</span>
          </div>
          {reportData.frontmatter.description && (
            <div className="meta-item">
              <span>📄</span>
              <span>{reportData.frontmatter.description}</span>
            </div>
          )}
        </div>
      </header>

      <main className="content">
        <ReportRenderer ast={reportData.content} />
      </main>
    </div>
  )
}

export default App
