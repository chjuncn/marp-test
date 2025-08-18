import type { ReportData } from '../converter.js'

export interface JsonOutputOptions {
  pretty?: boolean
  includeMetadata?: boolean
}

export function generateJson(
  reportData: ReportData,
  options: JsonOutputOptions = {}
): string {
  const { pretty = true, includeMetadata = true } = options

  const output = {
    ...(includeMetadata && { metadata: reportData.metadata }),
    frontmatter: reportData.frontmatter,
    content: reportData.content
  }

  return JSON.stringify(output, null, pretty ? 2 : 0)
}

export function generateJsonSchema(): string {
  // Generate JSON schema for the report format
  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Marp Report Format",
    "type": "object",
    "properties": {
      "metadata": {
        "type": "object",
        "properties": {
          "filename": { "type": "string" },
          "generatedAt": { "type": "string", "format": "date-time" },
          "version": { "type": "string" }
        }
      },
      "frontmatter": {
        "type": "object",
        "description": "YAML frontmatter from the source markdown"
      },
      "content": {
        "type": "object",
        "description": "Processed AST content with report elements"
      }
    },
    "required": ["frontmatter", "content"]
  }

  return JSON.stringify(schema, null, 2)
}
