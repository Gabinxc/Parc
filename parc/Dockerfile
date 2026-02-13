FROM node:20-alpine

ARG MY_UID
ARG MY_GID

RUN apk add chromium gettext shadow

RUN deluser node || true && \
    if [ "${MY_GID:-0}" != "0" ]; then \
        getent group ${MY_GID} >/dev/null 2>&1 || groupadd -g ${MY_GID} customgroup; \
    fi && \
    if [ "${MY_UID:-0}" != "0" ]; then \
        useradd -l -u ${MY_UID} -g ${MY_GID} node; \
    fi && \
    if [ "${MY_UID:-0}" != "0" ] && [ "${MY_GID:-0}" != "0" ]; then \
        chown -R ${MY_UID}:${MY_GID} /home/node; \
    fi

WORKDIR /home/node/app

