FROM node:lts-bookworm

COPY src apollo
WORKDIR apollo

RUN npm i install

ENTRYPOINT [ "node" ]
CMD [ "--max-old-space-size=1024", "index.js" ]
