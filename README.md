# Auto Data Analyst

Auto Data Analyst is a beginner-friendly React app that analyzes CSV files directly in the browser. It parses the file with PapaParse, profiles columns, summarizes numeric data, creates automatic charts with Recharts, and writes simple rule-based insights without calling any API.

## Features

- Upload a CSV file
- Preview the first 10 rows
- Detect column names and basic data types
- Show count, average, min, and max for numeric columns
- Create bar charts for categorical columns
- Create histogram-style line charts for numeric columns
- Generate simple written insights locally
- Clean dashboard UI built with Tailwind CSS

## Tech Stack

- React
- Vite
- Tailwind CSS
- PapaParse
- Recharts

## Setup

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open the URL Vite prints in your terminal, usually:

```text
http://localhost:5173
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
    AutoCharts.jsx
    ColumnTypes.jsx
    FileUploader.jsx
    Insights.jsx
    PreviewTable.jsx
    SummaryStats.jsx
  utils/
    analysis.js
  App.jsx
  index.css
  main.jsx
```

## How Analysis Works

1. PapaParse reads the CSV with the first row as headers.
2. Empty rows are removed.
3. Each column is classified as `number` when most filled values can be converted to numbers.
4. Numeric columns receive summary statistics.
5. Categorical values are counted for bar charts.
6. Numeric values are grouped into buckets for histogram-style charts.
7. Insights are generated from row counts, column types, ranges, unique values, and missing values.

All analysis happens in the browser, so no uploaded data is sent to a server.
