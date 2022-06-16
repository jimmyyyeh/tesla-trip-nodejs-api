# Buster-slim Node(Erbium) 12.20.2 LTS
FROM node:14-buster-slim
LABEL maintainer="Jimmy Yeh <chienfeng0719@hotmail.com>"

# Prepare env
ARG PRODUCT_NAME="app"
RUN mkdir -p /${PRODUCT_NAME}
WORKDIR /${PRODUCT_NAME}
RUN apt-get update
RUN apt-get install -y vim

# Prepare package
RUN yarn global add express-generator nodemon webpack webpack-cli eslint

