# Flask Invoice

Flask interface to create and manage invoice

## Prerequisites

```
docker
```

## Depends On

```
SQLAlchemy
mistune
Flask_SQLAlchemy
Flask
alembic
flask_login
flask_migrate
flask_restful
flask_script
flask_weasyprint
```

## Running

- Build this app into an container running docker build
- Pull an mysql docker image and run it
- Change SQLALCHEMY_DATABASE_URI To match mysql container
- Run this app
- Navigate to http://0.0.0.0:5000/

