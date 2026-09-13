# Technical Challenges

## Coding without AI
Argubably the biggest bottleneck to implementing as many features as I could think of.

## Lack of Dedicated Data Provider
Going for a reliable stock price API which streamed live stock prices would have been the most reliable way , current approach scrapes google finance and yahoo pages and uses regex to extract required data. Incase of failure to extract, serpAPI fallback implmented but due to free usage limits it is heavily throttled.

## Fragile Data Sources
Currently the primary data source is fragile HTML scraper which can change or break. If data isn't fetched for a particular stock then it is immediately marked unnavailble rather than display expired data.

## Caching Data
Intial approach for caching used a approach where stock price was cached at page reload time and was based on an active client being present. Current approach has a serverside clock that refreshes the cache and client always requests static data refreshed server-side.



