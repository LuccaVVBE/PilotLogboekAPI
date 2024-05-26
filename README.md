# PilotLogboek API


- Student: Lucca Van Veerdeghem

## Vereisten
Ik verwacht dat volgende software reeds geïnstalleerd is:
- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)


## Opstarten

Om de applicatie te downloaden naar je lokale schijf, kan je de directory clonen aan de hand van volgend commando:
 `git clone https://github.com/Web-IV/2223-webservices-LuccaVanVeerdeghem`

Voor de applicatie kan runnen, moet er een environment file `.env` aangemaakt worden in de root folder. 
Volgende informatie moet in het bestand komen te staan voor lokaal te draaien. 
Indien te applicatie online draait, kan de environment verandert worden naar production.
Ook moeten de DB variabelen verandert worden naar een online database.

```
NODE_ENV=development
DB_HOST=<db host address>
DB_PORT=<port>
DB_USER=<username>
DB_PASS=<password>
DB_NAME=logbook_test
DB_CLIENT=mysql2
AUTH_JWKS_URI=https://<auth0 application domain>/.well-known/jwks.json
AUTH_AUDIENCE=<auth0 api identifier>
AUTH_ISSUER=https://<auth0 application domain>/
AUTH_USER_INFO=https://<auth0 application domain>/userinfo
```

Eenmaal dit bestand is aangemaakt en de juiste data ingesteld is, kan de applicatie gestart worden.
De applicatie is gebaseerd op de package manager `yarn`. Deze slaat de gebruikte packages op in het [package.json](package.json) bestand.

Voor je de applicatie voor de eerste keer kan starten, moet je het commando `yarn install` uitvoeren in de root folder.
Dit zorgt ervoor dat alle gebruikte packages geïnstalleerd worden in het project.

De applicatie kan nu gestart worden met `yarn start`.

Indien de server lokaal draait, kan je de routes van de server bekijken op de lokale pagina http://localhost:9000/swagger . 

## Testen

De testen worden uitgevoerd via de package `jest` en `supertest`. Deze maken gebruik van een verschillende environment file.
Vooraleer je de testen kan uitvoeren, maak je het nieuwe env bestand aan met bestandsnaam `.env.test`. Volgende variabelen mogen in dit bestand geplaatst worden:
```
NODE_ENV=test
DB_HOST=<db host address>
DB_PORT=<port>
DB_USER=<username>
DB_PASS=<password>
DB_NAME=logbook_test
DB_CLIENT=mysql2
AUTH_JWKS_URI=https://<auth0 application domain>/.well-known/jwks.json
AUTH_AUDIENCE=<auth0 api identifier>
AUTH_ISSUER=https://<auth0 application domain>/
AUTH_USER_INFO=https://<auth0 application domain>/userinfo

AUTH_TEST_USER_USER_ID=<auth0id of user>
AUTH_TEST_USER_USERNAME=<auth0 username of user>
AUTH_TEST_USER_PASSWORD=<auth0 password of user>
AUTH_TOKEN_URL=https://<auth0 application domain>/oauth/token
AUTH_CLIENT_ID=<auth0 application client id>
AUTH_CLIENT_SECRET=<auth0 application client secret>
```

Met dit bestand aangemaakt, kan je nu de testen runnen met `yarn test`.

Alle routes kunnen ook getest worden via de pagina http://localhost:9000/swagger , maar dan is het noodzakelijk om je te authenticeren met een access token die er als volgt uitziet `Bearer <token>`. De token zelf kan je uit de localstorage halen wanneer ingelogd op de wegpagina http://localhost:3000 (frontend lokaal) of https://pilotlogger.onrender.com (frontend online).