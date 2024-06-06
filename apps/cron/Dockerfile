# BUILDER STAGE
FROM amazon/aws-lambda-nodejs:18 AS BUILDER

WORKDIR /app

# install yarn
RUN npm i -g yarn

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn db:generate


RUN npx nx run cron:build --configuration=production --skip-nx-cache

# RUNNER STAGE
FROM amazon/aws-lambda-nodejs:18 AS RUNNER

WORKDIR ${LAMBDA_TASK_ROOT}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# copy the built app from the previous stage
COPY --from=BUILDER ./app/dist/apps/cron ./
COPY --from=BUILDER ./app/node_modules ./node_modules


# set the CMD to your handler 
CMD ["apps/cron/src/main.handler"]
