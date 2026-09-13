This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started


Ensure that npm is installed :
then

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


Choices Made during development:
- All data is fetched parallely through the use of promises.
- Fetch made on and every 15 seconds
- Result cached and any fetch within 15 seconds is returned cached values
- Yahoo and Google Finance Webpage used and data is extracted using regex ( xpath attempted but no robust path found )
- External API for fallback incase webpage scrape fails but limit of requests per month hence heavily throttled.
- If fetch fails then field is marked unavailable 
