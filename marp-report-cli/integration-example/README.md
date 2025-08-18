# 🚀 Marp Report CLI - React Integration Example

This is a **standalone React application** that demonstrates how to render CLI-generated JSON using the `marp-report-react` components.

## 🎯 Purpose

When you move `marp-report-cli` to a new repository, this example shows:

1. **How to install** the CLI as a dependency
2. **How to generate** JSON from Markdown
3. **How to render** JSON in a React app with **identical UI**
4. **Complete workflow** from Markdown → JSON → React

## 🏗 Architecture

```
CLI Workflow:
Markdown → marp-report-cli → JSON → React App → Identical UI
```

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
# Install CLI globally (when published)
npm install -g marp-report-cli

# Or use locally during development
cd marp-report-cli
npm link
```

### 2. Install React App Dependencies

```bash
cd integration-example
npm install
```

### 3. Generate Report Data

```bash
# Generate JSON from any markdown file
marp-report convert example.md --format json --output src/data/report.json
```

### 4. Run the React App

```bash
npm run dev
# Open http://localhost:3000
```

## 🎨 What You'll See

- **Identical UI** to the main Marp website
- **Full interactivity** of all custom components:
  - MovableBlock (draggable content)
  - ImageEditor (crop/edit images)
  - TableVanilla (enhanced tables)
  - CodeTabs (tabbed code blocks)
- **Professional styling** with Tailwind CSS

## 🔄 Development Workflow

### 1. Write Markdown
```bash
# Create your report
echo "# My Report" > my-report.md
echo "Some content..." >> my-report.md
```

### 2. Generate JSON
```bash
marp-report convert my-report.md --format json --output src/data/my-report.json
```

### 3. Update React App
```tsx
// src/App.tsx
import reportData from './data/my-report.json'
// ... render with ReportRenderer
```

### 4. View Results
```bash
npm run dev
# See your report with identical UI! ✨
```

## 📁 Key Files

- **`src/App.tsx`**: Main application component
- **`src/components/ReportRenderer.tsx`**: Core renderer (converts JSON AST → React)
- **`src/data/example-report.json`**: Sample CLI-generated data
- **`package.json`**: Dependencies and scripts

## 🎯 Benefits

✅ **Standalone**: Works independently of main website
✅ **Identical UI**: Uses same `marp-report-react` components
✅ **Full Featured**: All CLI features work (watch, templates, etc.)
✅ **Production Ready**: TypeScript, modern React, Vite
✅ **Portable**: Easy to copy to any React project

## 🚀 Integration in Your Own App

Copy `src/components/ReportRenderer.tsx` to your React app:

```tsx
import { ReportRenderer } from './components/ReportRenderer'
import reportData from './report.json'

function MyReportPage() {
  return (
    <div>
      <h1>{reportData.frontmatter.title}</h1>
      <ReportRenderer ast={reportData.content} />
    </div>
  )
}
```

## 🎉 Perfect for New Repository

When you move the CLI to a new repo, this example provides:
- **Documentation** of how to use the CLI
- **Working demo** people can run immediately
- **Integration guide** for React apps
- **Proof** that CLI generates identical UI

This makes your CLI repository complete and professional! 🎯
