# 🚀 Marp Report CLI

A command-line tool to convert Markdown files to interactive report format using the Marp Report ecosystem.

**Perfect for creating reports that render with identical UI to the main Marp website!**

## 🎯 What This CLI Does

- **Converts** Markdown to structured JSON/HTML
- **Preserves** all custom report elements (movable blocks, image editors, tables, code tabs)
- **Enables** identical rendering in any React app
- **Provides** standalone React integration example

## Features

- 🔄 Convert Markdown to interactive report format
- 📊 Support for custom report elements (movable blocks, image editors, code tabs, tables)
- 🎨 Multiple output formats (HTML, JSON)
- 📱 Responsive HTML templates
- 👀 Watch mode for development
- ⚡ Fast conversion with unified/remark processing

## Installation

```bash
# Install locally in your project
npm install marp-report-cli

# Or install globally
npm install -g marp-report-cli
```

## Quick Start

### Basic Usage

```bash
# Convert a markdown file to HTML
marp-report convert input.md

# Convert to JSON format
marp-report convert input.md --format json

# Specify output path
marp-report convert input.md --output report.html

# Use watch mode for development
marp-report convert input.md --watch
```

### CLI Commands

#### `convert` (alias: `c`)

Convert a Markdown file to report format.

```bash
marp-report convert <input> [options]
```

**Options:**
- `-o, --output <path>` - Output file path (auto-detects format from extension)
- `-f, --format <format>` - Output format: `html`, `json` (default: `html`)
- `-t, --template <template>` - HTML template name (default: `default`)
- `--watch` - Watch for file changes and rebuild
- `--verbose` - Enable verbose logging

**Examples:**

```bash
# Basic conversion
marp-report convert my-report.md

# Convert to JSON with custom output path
marp-report convert my-report.md -f json -o dist/report.json

# Watch mode with verbose logging
marp-report convert my-report.md --watch --verbose

# Use custom template
marp-report convert my-report.md -t custom-template
```

#### `serve` (alias: `s`)

Start a development server for live preview (planned feature).

```bash
marp-report serve <input> [options]
```

**Options:**
- `-p, --port <port>` - Server port (default: 3000)
- `-t, --template <template>` - HTML template name (default: `default`)

## Markdown Format

Marp Report CLI supports all standard Markdown plus special report elements:

### Movable Blocks

```markdown
:::movable
This content can be moved around in the report.
:::
```

### Image Editor

```markdown
![Image with editor](image.jpg)
<!-- This will create an interactive image editor -->
```

### Code Tabs

```markdown
```tabs
Tab 1:
```javascript
console.log('Hello World');
```

Tab 2:
```python
print("Hello World")
```
```
```

### Table Vanilla

```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
<!-- Tables automatically get enhanced styling -->
```

### Report Merge

You can include other markdown files:

```markdown
<!-- Include another markdown file -->
{{merge: ./other-file.md}}
```

## Frontmatter Support

Add metadata to your reports using YAML frontmatter:

```yaml
---
title: "My Awesome Report"
author: "John Doe"
description: "A comprehensive analysis report"
theme: "dark"
css: |
  .custom-style {
    color: blue;
  }
---

# Report Content

Your markdown content here...
```

## Output Formats

### HTML Output

The HTML output includes:
- Responsive design
- Interactive component placeholders
- Embedded report data as JSON
- Theme support (light/dark)
- Custom CSS from frontmatter

To use the HTML output with interactive components:

1. Include `marp-report-react` in your web application
2. Extract the report data from the `#report-data` script tag
3. Render components using the `marp-report-react` registry

### JSON Output

The JSON output contains:
- Processed AST with report elements
- Frontmatter metadata
- Generation timestamp and version info

```json
{
  "metadata": {
    "filename": "report.md",
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "version": "0.1.0"
  },
  "frontmatter": {
    "title": "My Report",
    "author": "John Doe"
  },
  "content": {
    // Processed AST
  }
}
```

## Templates

### Using Built-in Templates

Currently available templates:
- `default` - Clean, responsive design with modern styling

### Creating Custom Templates

1. Create a new HTML file in your project
2. Use Mustache templating syntax
3. Reference the template by name or path

```bash
marp-report convert input.md -t ./my-template.html
```

Template variables available:
- `{{title}}` - Report title
- `{{description}}` - Report description
- `{{author}}` - Report author
- `{{date}}` - Generation date
- `{{frontmatter}}` - Full frontmatter object
- `{{reportDataJson}}` - JSON-stringified report data
- `{{customCss}}` - Custom CSS from frontmatter
- `{{theme}}` - Theme name

## Integration with React

To render interactive components in a React application:

```javascript
import { registry } from 'marp-report-react';

// Extract report data from generated HTML
const reportData = JSON.parse(
  document.getElementById('report-data').textContent
);

// Render components based on the registry
function renderReportElement(element) {
  const Component = registry[element.type];
  if (Component) {
    return <Component {...element.props} />;
  }
  return <div>Unknown element: {element.type}</div>;
}
```

## Development

### Building from Source

```bash
git clone <repository>
cd marp-report-cli
npm install
npm run build
```

### Testing the CLI

```bash
# Build and test
npm run build
npm run cli -- convert example.md
```

### Project Structure

```
marp-report-cli/
├── src/
│   ├── cli.ts           # Main CLI entry point
│   ├── converter.ts     # Markdown to report converter
│   ├── index.ts         # Library exports
│   ├── generators/
│   │   ├── html.ts      # HTML output generator
│   │   └── json.ts      # JSON output generator
│   └── templates/
│       └── default.html # Default HTML template
├── package.json
├── tsconfig.json
└── README.md
```

## API Usage

You can also use this as a library in your Node.js applications:

```javascript
import { convertMarkdownToReport, generateHtml, generateJson } from 'marp-report-cli';

async function convertReport() {
  const markdown = '# My Report\n\nContent here...';

  // Convert markdown to report data
  const reportData = await convertMarkdownToReport(markdown, {
    filename: 'report.md',
    verbose: true
  });

  // Generate HTML
  const html = await generateHtml(reportData, {
    title: 'My Report',
    template: 'default'
  });

  // Generate JSON
  const json = generateJson(reportData, {
    pretty: true,
    includeMetadata: true
  });
}
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

- [ ] Development server with live reload
- [ ] More built-in templates
- [ ] Plugin system for custom processors
- [ ] PDF export support
- [ ] VS Code extension integration
- [ ] Custom theme support

## Support

- 📚 [Documentation](https://github.com/your-org/marp-report-cli)
- 🐛 [Issue Tracker](https://github.com/your-org/marp-report-cli/issues)
- 💬 [Discussions](https://github.com/your-org/marp-report-cli/discussions)
