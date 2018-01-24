Bankin challenge
====

> This is my participation to the [Bankin Challenge #1](https://blog.bankin.com/challenge-engineering-web-scrapping-dc5839543117)

### Requirements

Needs Node v7.6.0 or greater.

### Install

```sh
git clone https://github.com/codeKonami/bankin-challenge
cd bankin-challenge
npm install
```

### Launch

The script generates a JSON file at the root of project named `output.json`.

```sh
node index.js
# > Took (in seconds): 13.821812033981084
# > Total transactions retrieved:  4999
```

By default this script is optimised to fetch 100 pages at the same time. But in case you don't know the total of pages, you can run the script in endless mode using the PAGES environment variable.

As soon as one page returns an empty array the script will stop.
```sh
# Launch the script in endless mode
PAGES=0 node index.js
```

By default endless mode scraps 10 pages concurrently. To modify this value you can use the PAGES_PER_CYCLE environment variable.

```sh
# Launch the script in endless mode, 50 pages concurrently
PAGES_PER_CYCLE=50 PAGES=0 node index.js
```

### Tests

```sh
# To launch test suite (through Jest)
npm run test
```

### Documentation

#### Approach

The idea of the script is to use [Puppeteer](https://github.com/GoogleChrome/puppeteer) which can use Chromium in headless mode. Each transactions page is opened in a Chromium tab (so 100 tabs are loaded). Then some JS is executed directly in each tab to determine the layout of the DOM.
Finally, the HTML is return and we are using Cheerio to parse it in order to retrieve the row of the table.

It's using an Object to identify each currency from their symbol. I've used the data from [this library](https://github.com/StorePilot/coinify/blob/master/coinify.js)
