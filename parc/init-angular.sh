#!/usr/bin/env sh

echo "Installation des packages NPM"
# installation si packages manquant

npm install --legacy-peer-deps
echo "Done..."

echo "Angular initialisé..."

LOCALE=${LOCALE:-fr}
if [ "$LOCALE" = "en" ]; then
  npm run serve:en
else
  npm run serve
fi