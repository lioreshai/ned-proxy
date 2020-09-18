FROM docker:dind

RUN set -eux; \
        apk add --no-cache --update nodejs npm

RUN mkdir -p /var/run/dind-executor

COPY . /var/run/dind-executor-proxy

ENTRYPOINT ["node", "/var/run/dind-executor-proxy/dist/index.js"]