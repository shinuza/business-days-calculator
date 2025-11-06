# Business Days Calculator

A modern web application to calculate workable days between dates, considering holidays for different countries.

## Features

- 📅 Select start and end dates to calculate workable days
- 🌍 Support for multiple countries (US, France)
- 📊 Quick month selection with agenda view
- 💰 Calculate expected revenue based on daily/hourly rates
- 💾 Configuration stored in localStorage
- 🎨 Modern UI with Shadcn/UI components

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Adding New Years

To add support for new years:

1. Create a new JSON file in `src/data/holidays/[country]/[year].json`
2. Follow the existing format with holiday dates and names
3. The application will automatically detect and use the new year

## Holiday Calendar Format

```json
{
  "year": 2025,
  "country": "US",
  "holidays": [
    {
      "date": "2025-01-01",
      "name": "New Year's Day"
    }
  ]
}
```
