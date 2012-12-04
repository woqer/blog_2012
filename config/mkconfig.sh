#! /bin/sh

if [ "xx$(pwd)" != "xx/app/config" ] ; then
   echo "ERROR: Este comando solo debe ejecutarse en los dynos de heroku."
   echo "       Crea el fichero config/config.json usado por sequelize."
   exit
fi

cat > config.json <<EOF
{
    "username": "$DATABASE_USER",
    "password": "$DATABASE_PASSWORD",
    "database": "$DATABASE_NAME",
    "host":     "$DATABASE_HOST",
    "dialect":  "$DATABASE_DIALECT",
    "port":     "$DATABASE_PORT",
    "protocol": "$DATABASE_PROTOCOL",
    "storage":  "$DATABASE_STORAGE",
    "omitNull": true
}
EOF



