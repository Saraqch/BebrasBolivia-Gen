# BebrasBolivia-Gen - Arquitectura Base (Hexagonal)

Este documento define una arquitectura inicial, granular y escalable para un proyecto colaborativo de 24 personas (6 equipos de 4), con stack:

- Frontend: Next.js + Tailwind
- Backend: Express + Prisma
- Testing: Jest

Objetivo: dejar una base clara para que luego puedas ajustarla y evolucionarla modulo por modulo.

## 1. Principios Arquitectonicos

Se usara arquitectura hexagonal (Ports and Adapters) en ambos lados, con enfoque por modulos de negocio.

Principios clave:

- El dominio no depende de frameworks.
- La aplicacion orquesta casos de uso.
- Infraestructura implementa puertos definidos por aplicacion.
- Entradas/salidas (HTTP, DB, cache, mensajeria) entran por adapters.
- Cada modulo (por ejemplo user) encapsula sus reglas y contratos.

## 2. Estructura General del Monorepo (Reorganizado)

```text
BebrasBolivia-Gen/                    (Raíz - Monorepo)
|-- package.json                       (Root workspaces)
|-- README.MD                          (Este archivo)
|-- .github/workflows/                 (CI/CD global)
|-- .husky/                            (Git hooks)
|-- server/                            (Backend - Express + Prisma)
|   |-- package.json
|   |-- tsconfig.json
|   |-- jest.config.js
|   |-- src/
|   |-- prisma/
|   |-- tests/
|   |-- README.md
|   `-- .env.example
|-- client/                            (Frontend - Next.js)
    |-- package.json
    |-- tsconfig.json
    |-- next.config.js
    |-- src/
    |-- tests/
    |-- README.md
    `-- .env.example
```

**Nota:** Cada workspace (server/ y client/) tiene su propio package.json, configuración y scripts independientes.

## 3. Quick Start

### Instalar dependencias (desde raíz)
```bash
npm ci
npm run install:all
```

### Levantar servidor y cliente en desarrollo
```bash
# Terminal 1 - Backend (Express en puerto 3000)
npm run dev --workspace=server

# Terminal 2 - Frontend (Next.js en puerto 3000)
npm run dev --workspace=client
```

### Ejecutar tests y lint
```bash
npm test           # Tests en todos los workspaces
npm run lint       # Lint en todos los workspaces
npm run format     # Prettier en todos los workspaces
```

### Builds de producción
```bash
npm run build --workspaces
```

## 4. Backend (Express + Prisma) - Arquitectura Ajustada

## 4.1 Estructura propuesta (simple y modular)

```text
server/
|-- package.json
|-- tsconfig.json
|-- jest.config.js
|-- .env.example
|-- prisma/
|   |-- schema.prisma
|   |-- migrations/
|   `-- seed/
|-- src/
|   |-- adapters/
|   |   |-- controllers/
|   |   |   |-- user/
|   |   |   |   |-- controllers.ts
|   |   |   |   |-- getAll.ts
|   |   |   |   |-- update.ts
|   |   |   |   `-- create.ts
|   |   |   |-- roles/
|   |   |   `-- permisions/
|   |   |-- repositories/
|   |   |   `-- user/
|   |   |       |-- create.ts
|   |   |       `-- update.ts
|   |   `-- routes/
|   |       |-- routes.ts
|   |       `-- user.ts
|   |
|   |-- config/
|   |-- domain/
|   |   `-- repositories/
|   |       `-- user.ts
|   |
|   |-- services/
|   |   `-- user/
|   |       |-- services.ts
|   |       |-- create.ts
|   |       `-- update.ts
|   |
|   |-- middleware/
|   |   `-- auth/
|   |       `-- auth.ts
|   |
|   |-- utils/
|   |   `-- script.ts
|   |
|   |-- app.ts
|   `-- server.ts
`-- tests/
```

## 4.2 Rutas granulares sin conflictos (clave)

La carpeta routes tiene un `routes.ts` que centraliza el registro de endpoints y evita duplicados por desorden entre modulos.

Ejemplo recomendado:

```text
src/adapters/routes/
|-- routes.ts
`-- user.ts
```

Responsabilidad de cada archivo:

- routes.ts: unico punto de montaje, versionado y prefijos globales (por ejemplo /api/v1).
- user.ts: solo define endpoints del modulo y exporta su RouterModule.
- Controllers: viven en adapters/controllers y no registran rutas.

Patron sugerido:

1. Cada modulo expone su router en adapters/routes/<modulo>.ts.
2. routes.ts importa todos los routers y los monta con prefijos unicos.
3. app.ts solo invoca registerRoutes(config.routePrefix) desde routes.ts.

## 4.3 Flujo real de la peticion (front -> back -> repositorio)

Este es el recorrido actual usando la estructura definida arriba.

### Crear usuario

1. UI del modulo user dispara la accion desde `client/src/modules/user`.
2. Se invoca `userApiService.create(...)` en `client/src/modules/user/infrastructure/api/userService.ts`.
3. `HttpClient` construye la URL en `client/src/shared/infrastructure/http/HttpClient.ts` usando `NEXT_PUBLIC_API_URL`.
4. La peticion llega a `POST /api/v1/user/create`.
5. El prefijo `/api/v1` sale de `server/src/config/env.config.ts` y `server/src/config/app.config.ts`.
6. `server/src/adapters/routes/routes.ts` valida y registra endpoints sin duplicados.
7. `server/src/adapters/routes/user.ts` enruta `/user/create` hacia el controller.
8. `server/src/adapters/controllers/user/create.ts` delega en servicio de dominio.
9. `server/src/domain/services/user/create.ts` y `server/src/domain/services/user/services.ts` aplican la logica de negocio.
10. Se usa el contrato `UserRepository` en `server/src/domain/repositories/user.ts`.
11. `server/src/config/container.ts` inyecta la implementacion concreta del repositorio.
12. La persistencia actual termina en `server/src/adapters/repositories/user/store.ts` (almacenamiento en memoria).
13. La respuesta vuelve en sentido inverso hasta la UI.

### Listar usuarios

1. Front llama `userApiService.list()`.
2. Se envia `GET /api/v1/user/getAll`.
3. Ruta: `server/src/adapters/routes/user.ts`.
4. Controller: `server/src/adapters/controllers/user/getAll.ts`.
5. Servicio: `server/src/domain/services/user/services.ts` (`listUsersService`).
6. Repositorio: `server/src/adapters/repositories/user/store.ts`.

### Actualizar usuario

1. Front llama `userApiService.update({ id, ...data })`.
2. Se envia `PUT /api/v1/user/update`.
3. Ruta: `server/src/adapters/routes/user.ts`.
4. Controller: `server/src/adapters/controllers/user/update.ts`.
5. Servicio: `server/src/domain/services/user/update.ts` y `server/src/domain/services/user/services.ts`.
6. Repositorio: `server/src/adapters/repositories/user/store.ts`.

### Nota sobre base de datos

Actualmente el proyecto guarda datos en memoria (`Map`) dentro de `store.ts`.
Cuando se conecte Prisma/PostgreSQL, el cambio principal sera reemplazar ese adapter por una implementacion real dentro de `adapters/repositories/user` y registrarla en `container.ts`.

## 4.4 Convenciones backend

- Cada endpoint se define solo en su archivo de rutas de modulo.
- El registro global de endpoints vive solo en routes/routes.ts.
- Evitar logica de negocio en controllers o repositorios.
- Prisma se mantiene encapsulado dentro de adapters/repositories.

## 5. Frontend (Next.js + Tailwind) - Hexagonal por Modulos

Aunque en frontend la hexagonal suele ser mas flexible, se propone mantener el mismo lenguaje arquitectonico para consistencia entre equipos.

## 5.1 Estructura propuesta

```text
client/
|-- package.json
|-- tsconfig.json
|-- jest.config.ts
|-- next.config.ts
|-- tailwind.config.ts
|-- postcss.config.js
|-- public/
|-- src/
|   |-- app/
|   |   |-- (public)/
|   |   |   |-- page.tsx
|   |   |   `-- layout.tsx
|   |   |-- (dashboard)/
|   |   |   |-- layout.tsx
|   |   |   |-- users/
|   |   |   |   `-- page.tsx
|   |   |   `-- teams/
|   |   |       `-- page.tsx
|   |   |-- api/
|   |   |   `-- health/
|   |   |       `-- route.ts
|   |   |-- globals.css
|   |   `-- layout.tsx
|   |
|   |-- shared/
|   |   |-- domain/
|   |   |   |-- errors/
|   |   |   `-- Result.ts
|   |   |-- application/
|   |   |   `-- ports/
|   |   |-- infrastructure/
|   |   |   |-- http/
|   |   |   |   |-- HttpClient.ts
|   |   |   |   `-- fetchHttpClient.ts
|   |   |   `-- config/
|   |   |       `-- env.client.ts
|   |   |-- ui/
|   |   |   |-- components/
|   |   |   |   |-- atoms/
|   |   |   |   |-- molecules/
|   |   |   |   `-- organisms/
|   |   |   `-- hooks/
|   |   `-- styles/
|   |       `-- tokens.css
|   |
|   |-- modules/
|   |   |-- user/
|   |   |   |-- domain/
|   |   |   |   |-- entities/
|   |   |   |   |   `-- User.ts
|   |   |   |   |-- value-objects/
|   |   |   |   |   `-- UserEmail.ts
|   |   |   |   `-- services/
|   |   |   |       `-- UserDisplayNamePolicy.ts
|   |   |   |
|   |   |   |-- application/
|   |   |   |   |-- use-cases/
|   |   |   |   |   |-- GetUsers.ts
|   |   |   |   |   `-- CreateUser.ts
|   |   |   |   |-- dto/
|   |   |   |   |   |-- UserViewModel.ts
|   |   |   |   |   `-- CreateUserPayload.ts
|   |   |   |   |-- mappers/
|   |   |   |   |   `-- UserUiMapper.ts
|   |   |   |   `-- ports/
|   |   |   |       |-- in/
|   |   |   |       |   `-- UserUiActionsPort.ts
|   |   |   |       `-- out/
|   |   |   |           `-- UserApiPort.ts
|   |   |   |
|   |   |   |-- infrastructure/
|   |   |   |   |-- api/
|   |   |   |   |   |-- UserApiAdapter.ts
|   |   |   |   |   `-- user.endpoints.ts
|   |   |   |   |-- state/
|   |   |   |   |   `-- user.store.ts
|   |   |   |   `-- cache/
|   |   |   |       `-- user.cache.ts
|   |   |   |
|   |   |   `-- ui/
|   |   |       |-- pages/
|   |   |       |   `-- UsersPage.tsx
|   |   |       |-- components/
|   |   |       |   |-- UserList.tsx
|   |   |       |   |-- UserCard.tsx
|   |   |       |   `-- CreateUserForm.tsx
|   |   |       `-- hooks/
|   |   |           |-- useUsers.ts
|   |   |           `-- useCreateUser.ts
|   |   |
|   |   |-- auth/
|   |   |   `-- (...misma estructura)
|   |   |-- team/
|   |   |   `-- (...misma estructura)
|   |   `-- challenge/
|   |       `-- (...misma estructura)
|   |
|   `-- tests/
|       |-- unit/
|       |   |-- modules/
|       |   `-- shared/
|       |-- integration/
|       `-- e2e/
`-- docs/
	`-- ui/
```

## 5.2 Flujo recomendado (frontend)

1. Pagina de Next.js monta componentes de modulo.
2. Hook/UI dispara caso de uso de aplicacion.
3. Caso de uso consume un puerto de salida (API adapter).
4. Adapter HTTP llama backend y normaliza respuesta.
5. Mapper transforma DTO en ViewModel para UI.

## 5.3 Convenciones frontend

- Componentes UI sin logica de negocio.
- Casos de uso sin detalles de fetch/axios directo.
- Endpoints y adapters aislados en infraestructura.
- Un modulo no importa internals de otro modulo.

## 6. Estrategia de Equipos (24 personas / 6 equipos)

Propuesta de distribucion:

1. Equipo A: modulo auth (front + back + tests)
2. Equipo B: modulo user (front + back + tests)
3. Equipo C: modulo team (front + back + tests)
4. Equipo D: modulo challenge (front + back + tests)
5. Equipo E: shared platform (observabilidad, libs shared, CI)
6. Equipo F: QA, pruebas E2E, performance y seguridad

Regla importante: cada equipo es owner de sus modulos y sus contratos.

## 7. Testing con Jest

Cobertura minima recomendada por modulo:

- Unit (dominio y use-cases): 70%
- Integration (adapters HTTP y repositorios Prisma): 20%
- E2E (flujos criticos): 10%

Reglas:

- Tests de dominio no dependen de Express ni Next.
- Tests de aplicacion usan doubles de puertos.
- Tests de infraestructura validan integracion real (DB/API) en entorno de prueba.

## 8. Checklist para crear un nuevo modulo

Ejemplo: modulo user.

1. Crear carpeta del modulo.
2. Crear domain/entities + value-objects + repository contract.
3. Crear servicios/casos de uso del modulo (manteniendo dominio desacoplado).
4. Implementar adapters/controllers y adapters/repositories.
5. Registrar endpoints del modulo en adapters/routes/<modulo>.ts y montarlo en adapters/routes/routes.ts.
6. Agregar tests unit, integration y e2e.
7. Documentar contratos del modulo en docs.

## 9. Roadmap sugerido (inicio rapido)

1. Montar skeleton de carpetas en client y server.
2. Implementar primer modulo vertical completo: user.
3. Definir convenciones de naming y linting para todos.
4. Configurar CI con pipeline: lint -> test -> build.
5. Repetir patron para auth, team, challenge.

## 10. Notas finales

- Esta arquitectura prioriza mantenibilidad y trabajo paralelo de varios equipos.
- Es normal que parezca extensa al inicio; la ganancia llega cuando escalan modulos y personas.
- Cuando hagas tus cambios, compartelos y te ayudo a generar una version refinada del README y/o el arbol real de carpetas.

---

# GUÍA DE USO PARA DESARROLLADORES

Esta sección explica paso a paso cómo trabajar en la arquitectura como equipo de 24 personas.

## 11. Configuración Inicial

### Para desarrolladores nuevos:

```bash
# 1. Clonar el repo
git clone <repo-url>
cd BebrasBolivia-Gen

# 2. Instalar dependencias
npm run install:all

# 3. Copiar variables de entorno
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Levantar localmente (2 terminales)
npm run dev --workspace=server  # Terminal 1
npm run dev --workspace=client  # Terminal 2
```

### Verificar que todo funciona:
```bash
npm test        # Todos los tests deben pasar
npm run lint    # No debe haber errores de linting
npm run build   # Build debe completar sin errores
```

## 12. Crear un Nuevo Módulo (Guía Paso a Paso)

Ejemplo: Crear un módulo **challenge** desde cero.

### Paso 1: Backend - Crear Dominio

Crea la carpeta y define la entidad:

```bash
mkdir -p server/src/domain/challenge/{entities,value-objects,services,repositories}
```

**server/src/domain/challenge/entities/Challenge.ts**
```typescript
export interface ChallengeEntity {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}
```

**server/src/domain/challenge/repositories/ChallengeRepository.ts**
```typescript
import type { ChallengeEntity } from '../entities/Challenge';

export interface ChallengeRepository {
  create(challenge: ChallengeEntity): Promise<ChallengeEntity>;
  findById(id: string): Promise<ChallengeEntity | null>;
  list(filters?: { difficulty?: string }): Promise<ChallengeEntity[]>;
}
```

### Paso 2: Backend - Crear Adapters (Controllers)

```bash
mkdir -p server/src/adapters/controllers/challenge
mkdir -p server/src/adapters/repositories/prisma/challenge
```

**server/src/adapters/controllers/challenge/CreateChallengeController.ts**
```typescript
import type { ChallengeEntity } from '../../../domain/challenge/entities/Challenge';
import type { ChallengeRepository } from '../../../domain/challenge/repositories/ChallengeRepository';
import { generateId } from '../../../utils/id';

export interface CreateChallengeInput {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const createChallengeController = async (
  repository: ChallengeRepository,
  input: CreateChallengeInput,
): Promise<ChallengeEntity> => {
  const challenge: ChallengeEntity = {
    createdAt: new Date(),
    description: input.description,
    difficulty: input.difficulty,
    id: generateId(),
    title: input.title,
  };

  return repository.create(challenge);
};
```

**server/src/adapters/repositories/prisma/challenge/ChallengePrismaRepository.ts**
```typescript
import type { ChallengeEntity } from '../../../../domain/challenge/entities/Challenge';
import type { ChallengeRepository } from '../../../../domain/challenge/repositories/ChallengeRepository';

export class ChallengePrismaRepository implements ChallengeRepository {
  private readonly challenges = new Map<string, ChallengeEntity>();

  public create(challenge: ChallengeEntity): Promise<ChallengeEntity> {
    this.challenges.set(challenge.id, challenge);
    return Promise.resolve(challenge);
  }

  public findById(id: string): Promise<ChallengeEntity | null> {
    return Promise.resolve(this.challenges.get(id) ?? null);
  }

  public list(filters?: { difficulty?: string }): Promise<ChallengeEntity[]> {
    let challenges = [...this.challenges.values()];

    if (filters?.difficulty) {
      challenges = challenges.filter((c) => c.difficulty === filters.difficulty);
    }

    return Promise.resolve(challenges);
  }
}
```

### Paso 3: Backend - Registrar Routes

**server/src/adapters/routes/challenge.routes.ts**
```typescript
import { createChallengeController } from '../controllers/challenge/CreateChallengeController';
import { createContainer } from '../../config/container';

import type { RouterModule } from './types';

const container = createContainer();

export const challengeRoutes: RouterModule = {
  basePath: '/challenges',
  moduleName: 'challenge',
  routes: [
    {
      handler: (payload: unknown) => {
        return createChallengeController(container.challengeRepository, payload as any);
      },
      method: 'POST',
      path: '/',
    },
    {
      handler: () => {
        return container.challengeRepository.list();
      },
      method: 'GET',
      path: '/',
    },
  ],
};
```

Agrega a **server/src/adapters/routes/routes.ts**:
```typescript
import { challengeRoutes } from './challenge.routes';  // ← Agregar
// ... imports existentes

export const routeModules: RouterModule[] = [
  authRoutes,
  challengeRoutes,  // ← Agregar
  teamRoutes,
  userRoutes,
];
```

Actualiza **server/src/config/container.ts** siguiendo el mismo patrón:
```typescript
export const createContainer = (): AppContainer => {
  return {
    // registra aquí los repositorios y servicios del nuevo módulo
  };
};
```

La idea es que cada nuevo módulo agregue sus dependencias en este punto central, sin mezclar lógica de negocio con los controllers.

### Paso 4: Frontend - Crear Domain y Services

```bash
mkdir -p client/src/modules/challenge/domain
mkdir -p client/src/modules/challenge/application/mappers
mkdir -p client/src/modules/challenge/infrastructure/api
mkdir -p client/src/modules/challenge/ui/{pages,components,hooks}
```

**client/src/modules/challenge/domain/ChallengeViewModel.ts**
```typescript
export interface ChallengeViewModel {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}
```

**client/src/modules/challenge/infrastructure/api/challengeService.ts**
```typescript
import { createHttpClient } from '@/shared/infrastructure/http/HttpClient';
import type { ChallengeViewModel } from '../../domain/ChallengeViewModel';

const httpClient = createHttpClient();

export const challengeApiService = {
  list: async (): Promise<ChallengeViewModel[]> => {
    return httpClient.get<ChallengeViewModel[]>('/challenges');
  },

  create: async (
    payload: Omit<ChallengeViewModel, 'id' | 'createdAt'>,
  ): Promise<ChallengeViewModel> => {
    return httpClient.post<ChallengeViewModel, Omit<ChallengeViewModel, 'id' | 'createdAt'>>(
      '/challenges',
      payload,
    );
  },
};
```

**client/src/modules/challenge/ui/pages/ChallengesPage.tsx**
```typescript
'use client';

import { useEffect, useState } from 'react';

import { challengeApiService } from '../../infrastructure/api/challengeService';
import type { ChallengeViewModel } from '../../domain/ChallengeViewModel';

export function ChallengesPage(): JSX.Element {
  const [challenges, setChallenges] = useState<ChallengeViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    challengeApiService
      .list()
      .then(setChallenges)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4">Cargando desafíos...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Challenges</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="font-bold text-lg">{challenge.title}</h2>
              <p className="text-gray-600 text-sm">{challenge.description}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {challenge.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

### Paso 5: Agregar Tests

**server/tests/unit/domain/challenge.spec.ts**
```typescript
describe('Challenge Entity', () => {
  it('should create a challenge with valid data', () => {
    const challenge = {
      createdAt: new Date(),
      description: 'Test challenge',
      difficulty: 'easy' as const,
      id: 'ch_123',
      title: 'Challenge 1',
    };

    expect(challenge.title).toBe('Challenge 1');
    expect(challenge.difficulty).toBe('easy');
  });
});
```

## 13. Convenciones de Naming

Sigue estas convenciones para evitar conflictos:

### Backend

| Item | Patrón | Ejemplo |
|------|--------|---------|
| Archivo de entidad | `<EntityName>.ts` | `Challenge.ts` |
| Archivo de value object | `<ValueObjectName>.ts` | `ChallengeDifficulty.ts` |
| Archivo de repository (interface) | `<EntityName>Repository.ts` | `ChallengeRepository.ts` |
| Archivo de controller | `<ActionName>Controller.ts` | `CreateChallengeController.ts` |
| Archivo de ruta | `<module>.routes.ts` | `challenge.routes.ts` |
| Clase de repositorio Prisma | `<EntityName>PrismaRepository.ts` | `ChallengePrismaRepository.ts` |
| Archivo de middleware | `<name>.middleware.ts` | `auth.middleware.ts` |

### Frontend

| Item | Patrón | Ejemplo |
|------|--------|---------|
| Archivo de tipo/view model | `<EntityName>ViewModel.ts` | `ChallengeViewModel.ts` |
| Archivo de servicio API | `<module>Service.ts` | `challengeService.ts` |
| Página/componente | `<PageName>.tsx` | `ChallengesPage.tsx` |
| Hook custom | `use<FeatureName>.ts` | `useChallenges.ts` |
| Componente | `<ComponentName>.tsx` | `ChallengeCard.tsx` |

## 14. Flujo de Trabajo Paralelo (Por Equipo)

Cada equipo es dueño de 1-2 módulos. Aquí cómo evitar conflictos:

### Paso 1: Crear rama por módulo
```bash
git checkout -b feat/user-module
# O para más de un módulo
git checkout -b feat/user-auth-modules
```

### Paso 2: Trabajar en backend y frontend por separado dentro del módulo

```bash
# Terminal 1 - Backend del módulo
cd server
npm run dev

# Terminal 2 - Frontend del módulo
cd client
npm run dev
```

### Paso 3: Antes de hacer PR

```bash
# Lint
npm run lint --workspaces

# Tests
npm test --workspaces

# Build
npm run build --workspaces

# Si todo pasa, hacer commit
git add .
git commit -m "feat: implement user module (domain, controllers, routes, ui)"
git push origin feat/user-module
```

### Paso 4: PR Description Template

```markdown
## 📋 Descripción
Implementación del módulo de User con:
- Domain entities y value objects
- Controllers para crear y listar usuarios
- Frontend page y servicios de API

## ✅ Checklist
- [x] Backend: domain, adapters, routes
- [x] Frontend: components, services, pages
- [x] Tests unitarios
- [x] Lint y format pasando
- [x] Build sin errores

## 🔗 Endpoints
- POST /api/v1/users - Crear usuario
- GET /api/v1/users - Listar usuarios

## 📸 Screenshots (si aplica)
[Pantalla del módulo]

## 🐛 Issues Relacionados
Fixes #123
```

## 15. Reglas de Oro para No Pisar Trabajo Ajeno

1. **Cada equipo = 1 módulo en su rama**
   - Equipo A: feat/auth-module
   - Equipo B: feat/user-module
   - etc.

2. **Cambios a archivos compartidos (root configs) = Coordinación**
   - ESLint rules → Avisar a líderes
   - package.json root → Coordinado
   - CI workflows → Coordinado

3. **Routes centralizadas = Naming único**
   - POST `/api/v1/users` → Solo para User
   - POST `/api/v1/challenges` → Solo para Challenge
   - Evitar POST `/api/v1/list` (ambiguo)

4. **Domain aislado por módulo**
   - `server/src/domain/user/` solo User usa
   - `server/src/domain/auth/` solo Auth usa
   - Si necesitas compartir lógica → `server/src/shared/`

5. **Frontend: módulos independientes**
   - `client/src/modules/user/` solo User
   - `client/src/modules/auth/` solo Auth
   - Componentes comunes → `client/src/shared/ui/`

## 16. Debugging y Testing Local

### Ejecutar solo tests de tu módulo

```bash
# Backend - tests del módulo user
npm test -- server/tests/unit/domain/user --workspace=server

# Frontend - tests del módulo challenge
npm test -- client/tests/unit/modules/challenge --workspace=client
```

### Ver requests HTTP en tiempo real

En `client/src/shared/infrastructure/http/HttpClient.ts`, agrega logging:

```typescript
const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
  const url = `${baseUrl}${path}`;
  console.log(`📤 ${method} ${url}`, body); // ← Agregar

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...config?.headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    console.error(`❌ Error ${response.status}: ${response.statusText}`); // ← Agregar
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Response:`, data); // ← Agregar
  return data as Promise<T>;
};
```

## 17. Troubleshooting Común

### ❌ Error: "Duplicated endpoint detected"

**Causa:** Registraste la misma ruta 2 veces en `routes/routes.ts`

**Solución:**
```bash
cd server
grep -r "POST:/api/v1/users" src/adapters/routes/
# Revisa que no esté definida en dos módulos diferentes
```

### ❌ Error: "Cannot find module '@/..'"

**Causa:** TypeScript paths no configurados en `tsconfig.json`

**Solución:** Verificar que `"@/*": ["src/*"]` esté en:
- `server/tsconfig.json`
- `client/tsconfig.json`

### ❌ Frontend no conecta con Backend

**Diagnóstico:**
1. Verificar que backend está corriendo: `http://localhost:3000/api/v1/users`
2. Verificar `.env` del client: `NEXT_PUBLIC_API_URL`
3. Check console del navegador para errores CORS

## 18. Commits Recomendados

Sigue conventional commits:

```bash
# Crear nuevo módulo
git commit -m "feat: add user module with domain, controllers and routes"

# Agregar feature a módulo existente
git commit -m "feat(user): add email validation with UserEmail value object"

# Fix en dominio
git commit -m "fix(challenge): difficulty enum validation"

# Tests
git commit -m "test(user): add unit tests for user services"

# Refactor
git commit -m "refactor(routes): centralize route registration in index.ts"
```

## 19. Comunicación Entre Equipos

Usa este formato en PRs y issues:

```markdown
**Impacto en otros módulos:**
- [x] No afecta otros módulos
- [ ] Afecta: Auth (porque cambié UserRepository)
  → @team-auth-owners revisar

**API Contracts:**
```json
POST /api/v1/users
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Breaking Changes:**
- ❌ Ninguno
```

---

¡Listo! Ahora tu equipo tiene una guía clara para trabajar en paralelo sin conflictos.

