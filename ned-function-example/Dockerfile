FROM node
RUN mkdir -p /var/run/ned-function
COPY . /var/run/ned-function
ENTRYPOINT ["node", "/var/run/ned-function/dist/index.js"]