# Analysis Transparency Features

This document explains the enhanced transparency features added to the AutoDev GitHub Agent Action to help users understand what happens during issue analysis.

## 🔍 What's New

### Process Visibility
The action now provides detailed information about every step of the analysis process, including:

- **File Scanning**: How many files were found in your repository
- **File Analysis**: Which files the AI determined were relevant
- **File Filtering**: Which files were excluded and why
- **Analysis Steps**: Detailed breakdown of each analysis phase
- **LLM Calls**: Information about AI service calls and their success/failure

### Diagnostic Information
When analysis results are limited or unexpected, the action provides:

- **Specific Explanations**: Why certain files were filtered out
- **Improvement Suggestions**: How to write better issue descriptions
- **Troubleshooting Tips**: Common issues and solutions

## 📊 Understanding the Analysis Process

### File Processing Pipeline

1. **Workspace Scan**: The action scans your repository to find all files
2. **Initial Filtering**: Basic filtering (excludes node_modules, .git, etc.)
3. **AI Analysis**: The LLM analyzes files for relevance to your issue
4. **Result Generation**: Creates analysis report and recommendations

### File Categories

The action categorizes files into:

- **Source Files**: `.js`, `.ts`, `.py`, `.java`, etc.
- **Configuration Files**: `jest.config.js`, `rollup.config.mjs`, `package.json`, etc.
- **Test Files**: Files in `__tests__/`, `*.test.js`, `*.spec.ts`, etc.
- **Documentation**: `README.md`, `*.md` files, `/docs/` directory

## ⚠️ Common Filtering Scenarios

### Why Files Get Filtered

The AI may filter out files that seem unrelated to your issue:

1. **Configuration Files** (jest.config.js, rollup.config.mjs)
   - Filtered unless issue mentions "configuration", "build", or "setup"
   - **Solution**: Mention specific config files or build problems

2. **Test Files** (__tests__/setup.ts, *.test.js)
   - Filtered unless issue mentions "test", "testing", or "test failure"
   - **Solution**: Include testing-related keywords

3. **Package Files** (package.json, yarn.lock)
   - Filtered unless issue mentions "dependencies" or "installation"
   - **Solution**: Reference dependency or package management issues

4. **Documentation** (README.md, docs/)
   - Filtered unless issue is about documentation
   - **Solution**: Mention "documentation" or "README"

### Example: Before and After

**Before (Generic Issue)**:
```
Title: "App not working"
Body: "The application has some issues and doesn't work properly."
```
Result: Most files filtered, limited analysis

**After (Specific Issue)**:
```
Title: "Build fails with jest.config.js error"
Body: "Getting error in jest.config.js when running tests. The configuration 
seems to conflict with rollup.config.mjs settings."
```
Result: Configuration files included, comprehensive analysis

## 🛠️ Interpreting Analysis Results

### Process Summary Section
```
🔍 Analysis Process
- Files scanned: 45
- Files analyzed: 8
- Files filtered: 37 (see details below)
- Analysis steps: 5
```

### What This Tells You

- **High Filter Ratio** (>80%): Issue description might be too generic
- **Failed Steps**: Technical problems during analysis
- **No LLM Calls**: AI service unavailable or failed
- **Zero Files Analyzed**: Issue description doesn't match any code

### Filtered Files Section
```
⚠️ Files Filtered from Analysis
37 files were not included in the analysis. This may include:
- jest.config.js - Configuration files often filtered by LLM as not directly relevant
- rollup.config.mjs - Build configuration files typically excluded from issue analysis
- __tests__/setup.ts - Test setup files may be filtered if issue doesn't mention testing
```

## 💡 Tips for Better Analysis

### 1. Be Specific
Instead of: "App broken"
Use: "Login component throws error in UserAuth.js"

### 2. Mention File Types
- "Configuration issue" → includes config files
- "Test failing" → includes test files
- "Build problem" → includes build configs
- "Documentation unclear" → includes docs

### 3. Include Error Messages
```
Error: Cannot resolve module 'jest-config' in jest.config.js
```

### 4. Reference Specific Areas
- Function names: "getUserData function"
- File paths: "src/components/Header.tsx"
- Error locations: "line 42 in utils/helper.js"

## 🔧 Troubleshooting

### No Files Analyzed
**Cause**: Issue description too generic or no matching files
**Solution**: Be more specific about affected code areas

### High Filter Rate
**Cause**: AI couldn't connect issue to specific files
**Solution**: Mention specific files, functions, or error messages

### LLM Calls Failed
**Cause**: AI service unavailable or quota exceeded
**Solution**: Check API keys and service status

### Analysis Steps Failed
**Cause**: Technical issues (network, permissions, etc.)
**Solution**: Check logs for specific error messages

## 📈 Using Transparency for Better Issues

The transparency features help you:

1. **Understand** why analysis was limited
2. **Improve** issue descriptions for better results
3. **Debug** problems with the analysis process
4. **Learn** how to write more effective issue reports

Remember: The goal is to help the AI understand your problem as clearly as a human developer would.
