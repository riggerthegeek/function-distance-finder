FROM node:8-alpine

LABEL maintainer="Simon Emms <simonemms.com>"

ARG FWATCHDOG_VERSION="0.6.12"

# Add the fwatchdog
ADD https://github.com/openfaas/faas/releases/download/${FWATCHDOG_VERSION}/fwatchdog /usr/bin
RUN chmod +x /usr/bin/fwatchdog

# Set correct permissions to use non root user
WORKDIR /home/node/

# Wrapper/boot-strapper
COPY package.json ./

# This ordering means the npm installation is cached for the outer function handler.
RUN npm install --production

# Copy outer function handler
COPY index.js ./

# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install
WORKDIR /home/node/function
COPY function/*.json ./
RUN npm install --production || :

# COPY function files and folders
COPY function/ ./

# Set correct permissions to use non root user
WORKDIR /home/node/

# chmod for tmp is for a buildkit issue (@alexellis)
RUN chown node:node -R /home/node \
  && chmod 777 /tmp

USER node

# Define the OpenFAAS envvars here
ENV cgi_headers="true"
ENV fprocess="node index.js"

HEALTHCHECK --interval=1s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]
