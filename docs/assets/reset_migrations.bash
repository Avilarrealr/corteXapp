rm -rf ./migrations &&
dropdb -h localhost example || true &&
createdb -h localhost example || true &&
psql -h localhost example -c 'CREATE EXTENSION unaccent;' || true &&
flask db init &&
flask db migrate -m "Initial migration" &&
flask db upgrade