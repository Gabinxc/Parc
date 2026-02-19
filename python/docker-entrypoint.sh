#!/bin/sh
set -e

echo "Attente de la base de données..."
until python3 -c "import mariadb; mariadb.connect(user='mysqlusr', password='mysqlpwd', host='database', port=3306, database='parc')" 2>/dev/null; do
  echo "DB pas encore prête, nouvelle tentative dans 3s..."
  sleep 3
done
echo "Base de données prête !"

python3 init.py

python3 -m flask --debug run --host=0.0.0.0
