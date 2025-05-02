#!/bin/sh

npm install

echo "---------------Run migrations---------------"

npm run typeorm:run

echo "---------------Run migrations - END---------"

if [[ $SEEDS = true ]]; then
    echo "-----------------Run seeds------------------"

    npm run seed:run

    echo "-----------------Run seeds - END------------"
fi

npm run start:debug
