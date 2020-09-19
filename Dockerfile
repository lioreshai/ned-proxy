FROM docker

RUN set -eux; \
        apk add --no-cache --update nodejs npm

RUN mkdir -p /var/run/ned-proxy

COPY . /var/run/ned-proxy

ENTRYPOINT ["node", "/var/run/ned-proxy/dist/index.js"]