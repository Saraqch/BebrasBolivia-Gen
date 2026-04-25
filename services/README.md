# Services Workspace

Esta carpeta contiene la base de microservicios por dominio para trabajo en equipo.

## Servicios

- auth-service
- user-service
- team-service

Cada servicio sigue una estructura alineada:

```text
src/
  app.ts
  server.ts
  config/
  shared/http/
  modules/<domain>/
    domain/
    application/
    infrastructure/
    presentation/http/
```

## Scripts de equipo

Desde esta carpeta:

```bash
npm run dev:auth
npm run dev:user
npm run dev:team
```

Tests por servicio:

```bash
npm --prefix auth-service run test:unit
npm --prefix auth-service run test:integration

npm --prefix user-service run test:unit
npm --prefix user-service run test:integration

npm --prefix team-service run test:unit
npm --prefix team-service run test:integration
```

Compilar todos:

```bash
npm run build
```

## Puertos por defecto

- auth-service: 4101
- user-service: 4102
- team-service: 4103

## Docker Compose

Para levantar todo con contenedores:

```bash
docker compose up
```

## Convenciones para colaboración

- Mantener contratos en `domain` y lógica en `application`.
- Implementaciones concretas en `infrastructure`.
- Rutas y controllers HTTP en `presentation/http`.
- Evitar lógica de negocio directa en `server.ts` o `app.ts`.
- Reutilizar setup y factories desde `tests/integration/fixtures`.
