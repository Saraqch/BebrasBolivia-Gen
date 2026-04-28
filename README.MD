# BebrasBolivia-Gen

Monorepo para la plataforma colaborativa BebrasBolivia.

Arquitectura actual:
- Frontend: Next.js (`client`)
- Backend: microservicios Node.js/Express (`services`)
- Testing: Jest
- Calidad: ESLint + Prettier + Husky


## Estructura actual

```text
BebrasBolivia-Gen/
|-- client/                     # Frontend Next.js
|-- services/                   # Backend microservicios
|   |-- auth-service/
|   |-- user-service/
|   `-- team-service/
|-- .github/workflows/ci.yml    # CI (lint, test, build)
|-- .husky/                     # Git hooks
|-- docker-compose.yml
|-- package.json                # Scripts raiz + workspaces
`-- README.MD
```

## Workspaces

El monorepo usa npm workspaces en la raiz:
- `services`
- `client`

## Requisitos

- Node.js >= 18
- npm >= 9
- Git
- Docker (opcional, para BD/compose)

## Instalacion

Desde la raiz:

```bash
npm ci
npm run install:all
```

## Desarrollo local

### Levantar todo desde raiz

```bash
npm run dev
```

Esto ejecuta:
- `services`: `auth-service`, `user-service`, `team-service` en paralelo
- `client`: Next.js

### Levantar solo backend microservicios

```bash
npm run dev --workspace=services
```

### Levantar solo frontend

```bash
npm run dev --workspace=client
```

## Puertos por defecto

Microservicios:
- auth-service: `4101`
- user-service: `4102`
- team-service: `4103`

Frontend:
- client (Next.js): `3000` (por defecto)

## Variables de entorno

### Backend (`services/.env`)

Basado en `services/.env.example`:

```env
AUTH_SERVICE_PORT=4101
USER_SERVICE_PORT=4102
TEAM_SERVICE_PORT=4103
```

### Frontend (`client/.env`)

Basado en `client/.env.example`. Variables relevantes:

```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4101
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:4102
NEXT_PUBLIC_TEAM_SERVICE_URL=http://localhost:4103
```

Nota: tambien existe compatibilidad legacy con `NEXT_PUBLIC_API_URL`.

## Scripts principales

Desde la raiz:

```bash
npm run dev
npm run build
npm test
npm run lint
npm run format
npm run format:check
```

Scripts utiles por workspace:

```bash
npm run dev --workspace=services
npm run build --workspace=services
npm run test --workspace=services

npm run dev --workspace=client
npm run build --workspace=client
npm run test --workspace=client
```

## Scripts por microservicio

Ejemplos:

```bash
npm --prefix services/auth-service run dev
npm --prefix services/user-service run dev
npm --prefix services/team-service run dev

npm --prefix services/auth-service run test:unit
npm --prefix services/auth-service run test:integration
```

## Docker Compose

Archivo: `docker-compose.yml`

Actualmente incluye:
- `postgres_db` (PostgreSQL)
- `auth-service` (build local)

Levantar compose:

```bash
docker compose up
```

## Calidad y validaciones

### Antes de commit

```bash
npm test
npm run build
```

### Hooks

- `pre-commit`: ejecuta `lint-staged`
- `pre-push`: ejecuta tests

## CI

Workflow: `.github/workflows/ci.yml`

En push/PR hacia `main` o `develop` ejecuta:
1. Instalacion limpia
2. Format check
3. Lint
4. Type-check (client)
5. Tests
6. Build

## Troubleshooting rapido

### La extension Jest en VS Code no detecta comando

Si ves "multiple candidates found", es porque es monorepo con varios paquetes.

Solucion rapida:
- Usar Quick Fix: "Jest: Setup monorepo"

### El frontend no conecta a servicios

Verifica en `client/.env`:
- `NEXT_PUBLIC_AUTH_SERVICE_URL`
- `NEXT_PUBLIC_USER_SERVICE_URL`
- `NEXT_PUBLIC_TEAM_SERVICE_URL`

Y confirma que los microservicios estan levantados.

## Convencion de trabajo para equipos

- Cada equipo trabaja por modulo/servicio en su rama.
- Evitar cambios innecesarios en archivos raiz compartidos.
- Correr `npm test` y `npm run build` antes de abrir PR.
- Mantener dominio/aplicacion desacoplados de infraestructura en cada servicio.
