FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .

# Switch to root user temporarily to install dependencies
USER root

# Install puppeteer-extra and required plugins
RUN npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer-extra-plugin-anonymize-ua

# Install Supabase client library
RUN npm install @supabase/supabase-js

# Switch back to non-root user for running the application
USER pptruser

CMD [ "node", "index.js" ]
