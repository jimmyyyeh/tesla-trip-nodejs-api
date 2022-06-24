FROM node:14-buster-slim
LABEL maintainer="Jimmy Yeh <chienfeng0719@hotmail.com>"

# Prepare env
ENV TZ=Asia/Taipei
ARG PRODUCT_NAME="app"
RUN mkdir -p /${PRODUCT_NAME}
WORKDIR /${PRODUCT_NAME}
RUN apt-get update
RUN apt-get install -y vim

# Prepare package
RUN yarn global add express-generator nodemon eslint
