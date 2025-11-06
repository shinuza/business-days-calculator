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

### Local Development

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

#### Build

```bash
npm run build
```

#### Preview

```bash
npm run preview
```

### Docker

#### Build Docker Image

```bash
docker build -t business-days-calculator .
```

#### Run Docker Container

```bash
docker run -d -p 8080:80 --name business-days-calculator business-days-calculator
```

The application will be available at `http://localhost:8080`

#### Stop and Remove Container

```bash
docker stop business-days-calculator
docker rm business-days-calculator
```

#### Using Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
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
