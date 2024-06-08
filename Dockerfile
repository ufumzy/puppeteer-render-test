FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Install puppeteer-extra and required plugins
RUN npm install puppeteer-extra@^3.1.6 puppeteer-extra-plugin-stealth puppeteer-extra-plugin-anonymize-ua

CMD [ "node", "index.js" ]
