import type { ReportData } from '../converter.js'
import Mustache from 'mustache'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface HtmlGeneratorOptions {
  template?: string
  title?: string
  includeReactBundle?: boolean
  cdnUrl?: string
  reactMode?: boolean
}

export async function generateHtml(
  reportData: ReportData,
  options: HtmlGeneratorOptions = {}
): Promise<string> {
    const {
    template = 'default',
    title = 'Marp Report',
    includeReactBundle = true,
    cdnUrl = 'https://unpkg.com',
    reactMode = false
  } = options

  // Load template - for now, we'll use the embedded beautiful template
  // In the future, this could load from external template files
  let templateContent: string

  if (template === 'default') {
    templateContent = getBeautifulTemplate()
  } else {
    // Try to load custom template file
    const templatePath = path.join(__dirname, '..', 'templates', `${template}.html`)
    try {
      templateContent = await fs.readFile(templatePath, 'utf-8')
    } catch (error) {
      // Fall back to beautiful template if custom template not found
      templateContent = getBeautifulTemplate()
    }
  }

  // Prepare template data
  const templateData = {
    title,
    frontmatter: reportData.frontmatter,
    metadata: reportData.metadata,
    reportDataJson: JSON.stringify(reportData),
    includeReactBundle,
    cdnUrl,
    reactMode,
    // Add common frontmatter fields for easy access
    description: reportData.frontmatter.description || '',
    author: reportData.frontmatter.author || '',
    date: reportData.frontmatter.date || reportData.metadata.generatedAt,
    // CSS and styling
    customCss: reportData.frontmatter.css || '',
    theme: reportData.frontmatter.theme || 'default'
  }

  // Render template
  return Mustache.render(templateContent, templateData)
}

function getDefaultTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    {{#author}}<meta name="author" content="{{author}}">{{/author}}
    {{#date}}<meta name="date" content="{{date}}">{{/date}}

    <!-- React and ReactDOM -->
    {{#includeReactBundle}}
    <script crossorigin src="{{cdnUrl}}/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="{{cdnUrl}}/react-dom@18/umd/react-dom.production.min.js"></script>
    {{/includeReactBundle}}

    <!-- Default Styles -->
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }

        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .report-header {
            margin-bottom: 2rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 1rem;
        }

        .report-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .report-meta {
            color: #666;
            font-size: 0.9rem;
        }

        .report-content {
            margin-top: 2rem;
        }

        .report-element {
            margin: 2rem 0;
            padding: 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
        }

        .report-element-type {
            font-size: 0.8rem;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        /* Theme variations */
        .theme-dark {
            background-color: #1a1a1a;
            color: #f0f0f0;
        }

        .theme-dark .report-element {
            background-color: #2a2a2a;
            border-color: #404040;
        }

        /* Custom CSS from frontmatter */
        {{#customCss}}
        {{{customCss}}}
        {{/customCss}}
    </style>
</head>
<body class="theme-{{theme}}">
    <div class="report-container">
        <header class="report-header">
            <h1 class="report-title">{{title}}</h1>
            <div class="report-meta">
                {{#author}}<span>By {{author}}</span> • {{/author}}
                <span>Generated on {{date}}</span>
                {{#description}} • <span>{{description}}</span>{{/description}}
            </div>
        </header>

        <main class="report-content">
            <div id="report-root">
                <!-- React components will be rendered here -->
                <div class="report-element">
                    <div class="report-element-type">Loading</div>
                    <p>Loading interactive report content...</p>
                </div>
            </div>
        </main>
    </div>

    <!-- Report Data -->
    <script type="application/json" id="report-data">
        {{{reportDataJson}}}
    </script>

    <!-- Report Renderer -->
    <script>
        // This is where you would integrate with marp-report-react
        // For now, we'll show a placeholder
        document.addEventListener('DOMContentLoaded', function() {
            const reportData = JSON.parse(document.getElementById('report-data').textContent);
            const rootElement = document.getElementById('report-root');

            // Placeholder implementation
            rootElement.innerHTML = \`
                <div class="report-element">
                    <div class="report-element-type">Report Data</div>
                    <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow-x: auto;">
\${JSON.stringify(reportData, null, 2)}
                    </pre>
                </div>
                <div class="report-element">
                    <div class="report-element-type">Next Steps</div>
                    <p>To render interactive components, integrate this with marp-report-react in your web application.</p>
                    <p>The report data is available in the #report-data script tag above.</p>
                </div>
            \`;
        });
    </script>
</body>
</html>`
}

function getBeautifulTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <meta name="description" content="{{description}}">
    {{#author}}<meta name="author" content="{{author}}">{{/author}}
    {{#date}}<meta name="date" content="{{date}}">{{/date}}

    <!-- React and ReactDOM -->
    {{#includeReactBundle}}
    <script crossorigin src="{{cdnUrl}}/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="{{cdnUrl}}/react-dom@18/umd/react-dom.production.min.js"></script>
    {{/includeReactBundle}}

    <!-- Default Styles -->
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            padding: 0;
            margin: 0;
        }

        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            min-height: 100vh;
        }

        .report-header {
            margin-bottom: 3rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 2rem;
        }

        .report-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a202c;
        }

        .report-meta {
            color: #718096;
            font-size: 0.95rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            align-items: center;
        }

        .report-meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .report-content {
            margin-top: 2rem;
        }

        .report-element {
            margin: 2rem 0;
            padding: 1.5rem;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background-color: #f7fafc;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
        }

        .report-element:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-color: #cbd5e0;
        }

        .report-element-type {
            font-size: 0.75rem;
            color: #4a5568;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin-bottom: 0.75rem;
            padding: 0.25rem 0.75rem;
            background-color: #edf2f7;
            border-radius: 6px;
            display: inline-block;
        }

        .loading-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #4a5568;
        }

        .spinner {
            width: 1rem;
            height: 1rem;
            border: 2px solid #e2e8f0;
            border-top: 2px solid #4299e1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .next-steps {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin-top: 2rem;
        }

        .next-steps h3 {
            margin-bottom: 1rem;
            font-size: 1.25rem;
        }

        .next-steps ul {
            list-style: none;
            padding: 0;
        }

        .next-steps li {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
        }

        .next-steps li::before {
            content: "✨";
            position: absolute;
            left: 0;
        }

        /* Theme variations */
        .theme-dark {
            background-color: #1a202c;
            color: #f7fafc;
        }

        .theme-dark .report-title {
            color: #f7fafc;
        }

        .theme-dark .report-element {
            background-color: #2d3748;
            border-color: #4a5568;
            color: #e2e8f0;
        }

        .theme-dark .report-element-type {
            background-color: #4a5568;
            color: #e2e8f0;
        }

        .theme-dark .report-header {
            border-color: #4a5568;
        }

                /* Responsive design */
        @media (max-width: 768px) {
            .report-container {
                padding: 1rem;
            }

            .report-title {
                font-size: 2rem;
            }

            .report-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
        }

        /* Report content styling */
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        .report-table th,
        .report-table td {
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
        }

        .report-table th {
            background-color: #f7fafc;
            font-weight: 600;
        }

        .enhanced-table {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        .tabs-container .tab-header:hover {
            opacity: 0.8;
        }

        /* Custom CSS from frontmatter */
        {{#customCss}}
        {{{customCss}}}
        {{/customCss}}
    </style>
</head>
<body class="theme-{{theme}}">
    <div class="report-container">
        <header class="report-header">
            <h1 class="report-title">{{title}}</h1>
            <div class="report-meta">
                {{#author}}
                <div class="report-meta-item">
                    <span>👤</span>
                    <span>{{author}}</span>
                </div>
                {{/author}}
                <div class="report-meta-item">
                    <span>📅</span>
                    <span>{{date}}</span>
                </div>
                {{#description}}
                <div class="report-meta-item">
                    <span>📄</span>
                    <span>{{description}}</span>
                </div>
                {{/description}}
            </div>
        </header>

        <main class="report-content">
            <div id="report-root">
                <div class="report-element">
                    <div class="report-element-type">Loading</div>
                    <div class="loading-indicator">
                        <div class="spinner"></div>
                        <span>Loading interactive report content...</span>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Report Data -->
    <script type="application/json" id="report-data">
        {{{reportDataJson}}}
    </script>

            <!-- Load marp-report-react components -->
    {{#includeReactBundle}}
    <script type="module">
        // Import the React registry from marp-report-react
        // Note: In a real deployment, you'd bundle this properly
        import { registry } from './marp-report-react.js'; // You'd need to build and serve this

        const reportData = JSON.parse(document.getElementById('report-data').textContent);
        const rootElement = document.getElementById('report-root');

        // Function to render React components from AST
        function renderReactComponents(ast) {
            if (!ast || !ast.children) {
                return React.createElement('p', null, 'No content available');
            }

            return ast.children.map((node, index) => renderNode(node, index));
        }

        function renderNode(node, key) {
            if (!node) return null;

            switch (node.type) {
                case 'heading':
                    const HeadingTag = \`h\${node.depth || 1}\`;
                    const headingText = node.children?.map(child =>
                        child.type === 'text' ? child.value : ''
                    ).join('') || '';
                    const props = node.data?.hProperties || {};
                    return React.createElement(HeadingTag, { key, ...props }, headingText);

                case 'paragraph':
                    return React.createElement('p', { key },
                        node.children?.map((child, i) => renderNode(child, i))
                    );

                case 'text':
                    return node.value;

                case 'inlineCode':
                    return React.createElement('code', { key }, node.value);

                case 'code':
                    return React.createElement('pre', { key },
                        React.createElement('code', {
                            className: node.lang ? \`language-\${node.lang}\` : ''
                        }, node.value)
                    );

                case 'list':
                    const ListTag = node.ordered ? 'ol' : 'ul';
                    return React.createElement(ListTag, { key },
                        node.children?.map((child, i) => renderNode(child, i))
                    );

                case 'listItem':
                    return React.createElement('li', { key },
                        node.children?.map((child, i) => renderNode(child, i))
                    );

                case 'table':
                    return React.createElement('table', { key, className: 'report-table' },
                        node.children?.map((child, i) => renderNode(child, i))
                    );

                case 'tableRow':
                    return React.createElement('tr', { key },
                        node.children?.map((child, i) => renderNode(child, i))
                    );

                case 'tableCell':
                    return React.createElement('td', { key },
                        node.children?.map((child, i) => renderNode(child, i))
                    );

                case 'image':
                    return React.createElement('img', {
                        key,
                        src: node.url,
                        alt: node.alt,
                        title: node.title
                    });

                case 'raw':
                    // This is where we render the actual React components!
                    if (node.data?.hName) {
                        const Component = registry[node.data.hName];
                        if (Component) {
                            return React.createElement(Component, {
                                key,
                                ...node.data.hProperties
                            });
                        }
                    }
                    return null;

                default:
                    if (node.children) {
                        return React.createElement('div', { key },
                            node.children.map((child, i) => renderNode(child, i))
                        );
                    }
                    return null;
            }
        }

        // Render the React app
        const App = () => {
            return React.createElement('div', null, renderReactComponents(reportData.content));
        };

        ReactDOM.render(React.createElement(App), rootElement);
    </script>
    {{/includeReactBundle}}

    <!-- Fallback for when React is not available -->
    {{^includeReactBundle}}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const reportData = JSON.parse(document.getElementById('report-data').textContent);
            const rootElement = document.getElementById('report-root');

            // Function to render HTML from AST nodes (fallback)
            function renderNode(node) {
                if (!node) return '';

                switch (node.type) {
                    case 'heading':
                        const level = node.depth || 1;
                        const headingText = node.children?.map(child =>
                            child.type === 'text' ? child.value : ''
                        ).join('') || '';
                        const id = node.data?.id || '';
                        return \`<h\${level}\${id ? \` id="\${id}"\` : ''}>\${headingText}</h\${level}>\`;

                    case 'paragraph':
                        const pText = node.children?.map(renderNode).join('') || '';
                        return \`<p>\${pText}</p>\`;

                    case 'text':
                        return node.value || '';

                    case 'inlineCode':
                        return \`<code>\${node.value || ''}</code>\`;

                    case 'code':
                        return \`<pre><code class="language-\${node.lang || ''}">\${node.value || ''}</code></pre>\`;

                    case 'list':
                        const listTag = node.ordered ? 'ol' : 'ul';
                        const listItems = node.children?.map(renderNode).join('') || '';
                        return \`<\${listTag}>\${listItems}</\${listTag}>\`;

                    case 'listItem':
                        const itemContent = node.children?.map(renderNode).join('') || '';
                        return \`<li>\${itemContent}</li>\`;

                    case 'table':
                        const tableContent = node.children?.map(renderNode).join('') || '';
                        return \`<table class="report-table">\${tableContent}</table>\`;

                    case 'tableRow':
                        const rowContent = node.children?.map(renderNode).join('') || '';
                        return \`<tr>\${rowContent}</tr>\`;

                    case 'tableCell':
                        const cellContent = node.children?.map(renderNode).join('') || '';
                        return \`<td>\${cellContent}</td>\`;

                    case 'image':
                        return \`<img src="\${node.url || ''}" alt="\${node.alt || ''}" title="\${node.title || ''}" />\`;

                    case 'raw':
                        // Render custom components
                        if (node.data?.hName) {
                            return renderCustomComponent(node.data.hName, node.data.hProperties || {});
                        }
                        return '';

                    default:
                        // For unhandled node types, try to render children
                        if (node.children) {
                            return node.children.map(renderNode).join('');
                        }
                        return '';
                }
            }

            // Function to render custom components as HTML placeholders
            function renderCustomComponent(componentName, props) {
                switch (componentName) {
                    case 'movable-block':
                        const movableData = JSON.parse(props['data-json'] || '{}');
                        const items = movableData.items || [];
                        return \`
                            <div class="report-element">
                                <div class="report-element-type">Movable Block</div>
                                <div style="border: 2px dashed #e2e8f0; width: \${movableData.width || 640}px; height: \${movableData.height || 280}px; position: relative; background: #f7fafc;">
                                    \${items.map(item => \`
                                        <div style="position: absolute; left: \${item.x}px; top: \${item.y}px; padding: 8px 12px; background: #4299e1; color: white; border-radius: 4px; font-size: 14px;">
                                            \${item.content || item.id}
                                        </div>
                                    \`).join('')}
                                </div>
                                <p><em>In React: This would be an interactive movable component</em></p>
                            </div>
                        \`;

                    case 'table-vanilla':
                        const tableData = JSON.parse(props['data-json'] || '{}');
                        const caption = tableData.caption || '';
                        const columns = tableData.columns || [];
                        const rows = tableData.rows || [];
                        const align = tableData.align || [];

                        const getAlignment = (idx) => {
                            const a = align[idx];
                            if (a === 'center' || a === 'right' || a === 'left') return a;
                            return idx === 0 ? 'left' : 'right';
                        };

                        return \`
                            <figure class="tv-wrap">
                                \${caption ? \`<figcaption class="tv-caption">\${caption}</figcaption>\` : ''}
                                <div class="tv-scroll">
                                    <table class="tv-table">
                                        <thead>
                                            <tr>
                                                \${columns.map((col, i) => \`<th style="text-align: \${getAlignment(i)}">\${col}</th>\`).join('')}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            \${rows.map(row => \`
                                                <tr>
                                                    \${row.map((cell, ci) => \`<td style="text-align: \${getAlignment(ci)}">\${String(cell)}</td>\`).join('')}
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                <style>
                                    .tv-wrap { margin: 1.5rem auto; }
                                    .tv-caption { text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 0.5rem; }
                                    .tv-scroll { overflow-x: auto; }
                                    .tv-table { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border-radius: 0.5rem; }
                                    .tv-table thead th { position: sticky; top: 0; background: #0ea5e9; color: #fff; font-weight: 700; padding: 0.75rem 1rem; }
                                    .tv-table tbody td { padding: 0.75rem 1rem; border-top: 1px solid #e5e7eb; }
                                    .tv-table tbody tr:nth-child(odd) td { background: #f8fafc; }
                                    .tv-table tbody tr:hover td { background: #eef2ff; }
                                    .tv-table th:first-child { border-top-left-radius: 0.5rem; }
                                    .tv-table th:last-child { border-top-right-radius: 0.5rem; }
                                </style>
                            </figure>
                        \`;

                    case 'image-editor':
                        const src = props['data-src'] || '';
                        const width = props['data-width'] || '640';
                        return \`
                            <div class="report-element">
                                <div class="report-element-type">Image Editor</div>
                                <img src="\${src}" width="\${width}" style="max-width: 100%; border: 2px solid #e2e8f0; border-radius: 8px;" />
                                <p><em>In React: This would have crop, resize, and edit controls</em></p>
                            </div>
                        \`;

                    case 'code-tabs':
                        const tabsData = JSON.parse(props['data-tabs'] || '[]');
                        return \`
                            <div class="report-element">
                                <div class="report-element-type">Code Tabs</div>
                                <div class="tabs-container">
                                    <div class="tab-headers" style="display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 1rem;">
                                        \${tabsData.map((tab, i) => \`
                                            <button class="tab-header \${i === 0 ? 'active' : ''}" style="padding: 8px 16px; border: none; background: \${i === 0 ? '#4299e1' : '#f7fafc'}; color: \${i === 0 ? 'white' : '#4a5568'}; cursor: pointer;">
                                                \${tab.title || \`Tab \${i + 1}\`}
                                            </button>
                                        \`).join('')}
                                    </div>
                                    <div class="tab-content">
                                        \${tabsData.length > 0 ? \`
                                            <pre style="background: #2d3748; color: #e2e8f0; padding: 1rem; border-radius: 4px; overflow-x: auto;"><code>\${tabsData[0].code || 'No content'}</code></pre>
                                        \` : '<p>No tabs available</p>'}
                                    </div>
                                </div>
                                <p><em>In React: This would have interactive tab switching</em></p>
                            </div>
                        \`;

                    default:
                        return \`
                            <div class="report-element">
                                <div class="report-element-type">Unknown Component: \${componentName}</div>
                                <pre style="background: #f7fafc; padding: 1rem; border-radius: 4px;">\${JSON.stringify(props, null, 2)}</pre>
                            </div>
                        \`;
                }
            }

            // Render the complete report
            function renderReport(ast) {
                if (!ast || !ast.children) {
                    return '<p>No content available</p>';
                }

                return ast.children.map(renderNode).join('');
            }

            // Render the report content
            rootElement.innerHTML = renderReport(reportData.content);
        });
    </script>
</body>
</html>`
}
