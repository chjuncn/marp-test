#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { convertMarkdownToReport } from './converter.js'
import { generateHtml } from './generators/html.js'
import { generateJson } from './generators/json.js'
import fs from 'fs-extra'
import path from 'path'

const program = new Command()

program
  .name('marp-report')
  .description('CLI tool to convert Markdown files to interactive report format')
  .version('0.1.0')

program
  .command('convert')
  .alias('c')
  .description('Convert a Markdown file to report format')
  .argument('<input>', 'Input Markdown file path')
  .option('-o, --output <path>', 'Output file path (auto-detect format from extension)')
  .option('-f, --format <format>', 'Output format: html, json', 'html')
  .option('-t, --template <template>', 'HTML template name', 'default')
  .option('--react', 'Generate React-ready HTML (requires marp-report-react in your app)')
  .option('--watch', 'Watch for file changes and rebuild')
  .option('--verbose', 'Enable verbose logging')
  .action(async (input: string, options) => {
    const spinner = ora('Converting Markdown to Report...').start()

    try {
      // Validate input file
      if (!await fs.pathExists(input)) {
        throw new Error(`Input file not found: ${input}`)
      }

      // Determine output path and format
      let outputPath = options.output
      let format = options.format

      if (outputPath) {
        const ext = path.extname(outputPath).toLowerCase()
        if (ext === '.html') format = 'html'
        else if (ext === '.json') format = 'json'
      } else {
        const inputBase = path.basename(input, path.extname(input))
        outputPath = `${inputBase}.${format === 'html' ? 'html' : 'json'}`
      }

      if (options.verbose) {
        spinner.text = `Reading ${input}...`
      }

      // Read and convert markdown
      const markdownContent = await fs.readFile(input, 'utf-8')

      if (options.verbose) {
        spinner.text = 'Converting to report format...'
      }

      const reportData = await convertMarkdownToReport(markdownContent, {
        filename: path.basename(input),
        verbose: options.verbose
      })

      if (options.verbose) {
        spinner.text = `Generating ${format.toUpperCase()} output...`
      }

      // Generate output based on format
      let output: string
      if (format === 'html') {
        output = await generateHtml(reportData, {
          template: options.template,
          title: path.basename(input, path.extname(input)),
          reactMode: options.react
        })
      } else if (format === 'json') {
        output = generateJson(reportData)
      } else {
        throw new Error(`Unsupported format: ${format}`)
      }

      // Write output
      await fs.writeFile(outputPath, output, 'utf-8')

      spinner.succeed(
        chalk.green(`✅ Report generated successfully!\n`) +
        chalk.blue(`   Input:  ${input}\n`) +
        chalk.blue(`   Output: ${outputPath}\n`) +
        chalk.blue(`   Format: ${format.toUpperCase()}`)
      )

      if (options.watch) {
        console.log(chalk.yellow('\n👀 Watching for changes... (Press Ctrl+C to stop)'))

        const { default: chokidar } = await import('chokidar')
        chokidar.watch(input).on('change', async () => {
          const watchSpinner = ora('File changed, rebuilding...').start()
          try {
            const newContent = await fs.readFile(input, 'utf-8')
            const newReportData = await convertMarkdownToReport(newContent, {
              filename: path.basename(input),
              verbose: false
            })

            let newOutput: string
            if (format === 'html') {
              newOutput = await generateHtml(newReportData, {
                template: options.template,
                title: path.basename(input, path.extname(input))
              })
            } else {
              newOutput = generateJson(newReportData)
            }

            await fs.writeFile(outputPath, newOutput, 'utf-8')
            watchSpinner.succeed(chalk.green('✅ Report rebuilt!'))
          } catch (error) {
            watchSpinner.fail(chalk.red(`❌ Rebuild failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
          }
        })
      }

    } catch (error) {
      spinner.fail(chalk.red(`❌ Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
      process.exit(1)
    }
  })

program
  .command('serve')
  .alias('s')
  .description('Start a development server for live preview')
  .argument('<input>', 'Input Markdown file path')
  .option('-p, --port <port>', 'Server port', '3000')
  .option('-t, --template <template>', 'HTML template name', 'default')
  .action(async (input: string, options) => {
    console.log(chalk.blue('🚀 Starting development server...'))
    console.log(chalk.yellow('📝 This feature will be implemented in a future version'))
    console.log(chalk.gray(`   File: ${input}`))
    console.log(chalk.gray(`   Port: ${options.port}`))
    console.log(chalk.gray(`   Template: ${options.template}`))
  })

program.parse()
