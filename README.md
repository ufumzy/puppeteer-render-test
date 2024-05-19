
# 🌟 Puppeteer Web Scraping Docker Environment 🌟

Welcome to our Puppeteer Docker setup for seamless web scraping adventures! Whether you're a seasoned data hunter or just diving into the world of web scraping, this repository has got you covered.

## 🚀 Quick Start

Getting started is a breeze! Just follow these simple steps:

1. Clone the Repository:
   ```
   git clone git@github.com:ufumzy/puppeteer-render-test.git
   ```
   ```
   cd puppeteer-web-scraping
   ```
2. **Build the Docker Image:**
   ```
   docker build -t puppeteer-scraping .
   ```

3. **Run the Docker Container:**
   ```
   docker run -p 3000:3000 puppeteer-scraping
   ```

4. **Visit the Endpoint:**
   Open your favorite browser and head to [http://localhost:3000/scrape](http://localhost:3000/scrape) to witness the magic!

## 🕵️‍♂️ What's Inside?

This repository provides a Dockerfile that sets up the Puppeteer environment and all its dependencies for hassle-free web scraping. But wait, there's more! We've included a test scrape that fetches the title of the homepage from Goal.com just to give you a taste of what's possible.

### 🧠 The Brains Behind the Operation

The scraping logic is neatly encapsulated in `scrapelogic.js`, where all the magic happens. Feel free to explore and customize it to suit your scraping needs!

### 🕰️ Execution Time Tracker

Ever wondered how long it takes to process a scraping request? We've got you covered! We've included an execution time tracker to keep you informed about the processing speed.

## 🤝 Contributions

Contributions are more than welcome! Whether it's bug fixes, feature enhancements, or just feedback, we appreciate any form of contribution to make this project even better.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to tweak and adjust any part of this README to better fit your style and preferences. Happy scraping! 🎉


Demo Link: https://puppeteer-render-wa5k.onrender.com/scrape


![scrape](https://github.com/ufumzy/puppeteer-render-test/assets/13329994/add3cbd2-62d0-4c01-a4b8-52168cde95e8)


