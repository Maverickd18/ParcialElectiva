# Parcial de Calidad de Software Avanzado - RESPUESTAS

## Parte 1: Estrategia

### 1. Diferencia entre CI y CD

#### CI (Integración Continua)
- **Definición**: Automatización que integra y prueba cambios de código frecuentemente (múltiples veces al día)
- **Objetivo**: Detectar errores tempranamente
- **Actividades**: Compilación, linting, pruebas unitarias, análisis estático
- **Beneficio**: Mantener la calidad del código en cada commit

#### CD (Despliegue Continuo)
- **Definición**: Automatización que permite desplegar cambios a producción automáticamente
- **Objetivo**: Entregas rápidas y frecuentes
- **Actividades**: Pruebas de integración, pruebas de humo, despliegue automático
- **Beneficio**: Ciclos de entrega más rápidos (puede o no estar incluido en este proyecto)

**En este proyecto**: Implementaremos **CI completo** con posibilidades de CD

---

### 2. Elecciones Técnicas Justificadas

#### **Lenguaje: TypeScript**
- **Justificación**:
  - Tipado estático: Detecta errores en tiempo de compilación
  - Compatible con ecosistema Node.js
  - Excelente para CI/CD (transcompilar a JavaScript)
  - Herramientas maduras y estándares en la industria

#### **Linter: ESLint**
- **Justificación**:
  - Estándar de facto en proyectos JavaScript/TypeScript
  - Altamente configurable
  - Integración directa con editors y CI/CD
  - Excelentes reglas para calidad de código (complejidad ciclomática, convenciones, etc.)

#### **Framework de Testing: Jest**
- **Justificación**:
  - Framework de testing más popular en JavaScript/TypeScript
  - Incluye cobertura de código nativamente (coverage)
  - Configuración simple
  - Reportes claros en CI/CD

#### **Cobertura: Jest Coverage**
- **Justificación**:
  - Integrada en Jest, no requiere herramienta adicional
  - Genera reportes HTML y LCOV
  - Fácil de validar umbrales mínimos

#### **Umbral de Cobertura: 80%**
- **Justificación**:
  - 70% es bajo; 90% es difícil de mantener sin sacrificar agilidad
  - 80% es estándar en la industria (balance calidad-productividad)
  - Cubre la mayoría de caminos críticos del código

---

### 3. Herramientas de Construcción

- **Package Manager**: npm (incluido con Node.js)
- **Build Tool**: TypeScript Compiler (tsc)
- **Runtime**: Node.js 18+

---

## Parte 2: Workflow CI/CD

### Archivo: `.github/workflows/ci-quality.yml`

El workflow está configurado para ejecutarse automáticamente en:
- **Push** a ramas `main` o `develop`
- **Pull Request** contra ramas `main` o `develop`

### Pasos del Pipeline (en orden)

#### 1. **Checkout del Código**
```yaml
- uses: actions/checkout@v4
```
- Descarga el código del repositorio
- No puede fallar (es prerrequisito)

#### 2. **Setup Node.js**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 18.x
    cache: 'npm'
```
- Instala Node.js 18.x
- Cache npm para acelerar instalación de dependencias
- No puede fallar

#### 3. **Instalar Dependencias**
```yaml
- run: npm ci
  continue-on-error: false
```
- `npm ci` (clean install) - instalación limpia reproducible
- **Falla si**: `package-lock.json` no existe o hay conflictos
- `continue-on-error: false` → El pipeline se detiene si falla

#### 4. **Ejecutar ESLint (Linter)**
```yaml
- run: npm run lint
  continue-on-error: false
```
- Analiza calidad del código
- Verifica: convenciones, no variables sin usar, sin console
- **Falla si**: Hay violaciones de linting
- **continue-on-error: false** → Detiene el pipeline si falla

**Ejemplo de fallo**:
```
error  Unexpected console statement  no-console  src/index.ts:5:1
```

#### 5. **Compilar TypeScript**
```yaml
- run: npm run build
  continue-on-error: false
```
- Transpila `.ts` a `.js` con `tsc`
- Valida tipos de TypeScript
- **Falla si**: Errores de tipo (TS2322, etc.)
- Salida en carpeta `dist/`

**Ejemplo de fallo**:
```
error TS2322: Type 'string' is not assignable to type 'number'.
```

#### 6. **Ejecutar Pruebas Unitarias**
```yaml
- run: npm test
  continue-on-error: false
```
- Ejecuta Jest sin cobertura
- Ejecuta todos los tests en `src/__tests__/**/*.test.ts`
- **Falla si**: Algún test falla
- Tiempo típico: 2-5 segundos

**Ejemplo de fallo**:
```
● Calculator › debe sumar correctamente
expect(received).toBe(expected)
Expected: 5
Received: 4
```

#### 7. **Tests con Cobertura**
```yaml
- run: npm run test:coverage
  continue-on-error: false
```
- Ejecuta tests y mide cobertura
- Genera reportes en carpeta `coverage/`
- **Falla si**: Cobertura < 80% (en algunas configuraciones)

**Salida esperada**:
```
File           | % Stmts | % Branch | % Funcs | % Lines |
All files      |     100 |      100 |     100 |     100 |
```

#### 8. **Validar Umbral de Cobertura (80%)**
```yaml
- run: |
    npm run test:coverage -- --collectCoverageFrom='src/**/*.ts' \
      --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
  continue-on-error: false
```
- Valida que TODAS las métricas sean >= 80%
- **Falla si**: Alguna métrica (branches, lines, functions, statements) < 80%
- Es el **control de calidad más estricto**

**Ejemplo de fallo**:
```
❌ Error: Cobertura de 72% es menor a 80%
JEST: "Global coverage threshold not met"
```

#### 9. **Subir Reporte de Cobertura**
```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: coverage-report
    path: coverage/
    retention-days: 30
```
- `if: always()` → Se ejecuta incluso si pasos anteriores fallaron
- Sube carpeta `coverage/` como artefacto
- Disponible en GitHub Actions por 30 días
- Permite descargar reporte HTML

#### 10. **Resumen del CI**
```yaml
- run: echo "✅ Pipeline CI completado"
  if: always()
```
- Mensaje informativo final
- Se ejecuta incluso si hay fallos anteriores

---

### Flujo de Control: ¿Cuándo Falla el Pipeline?

```
START
  ↓
Checkout ← (nunca falla)
  ↓
Setup Node ← (nunca falla)
  ↓
npm ci ← PUEDE FALLAR ❌
  ├─ Sí → STOP (código 1)
  └─ No
      ↓
      npm lint ← PUEDE FALLAR ❌
      ├─ Sí → STOP (código 1)
      └─ No
          ↓
          npm build ← PUEDE FALLAR ❌
          ├─ Sí → STOP (código 1)
          └─ No
              ↓
              npm test ← PUEDE FALLAR ❌
              ├─ Sí → STOP (código 1)
              └─ No
                  ↓
                  npm test:coverage ← PUEDE FALLAR ❌
                  ├─ Sí → STOP (código 1)
                  └─ No
                      ↓
                      Validar 80% ← PUEDE FALLAR ❌
                      ├─ Sí → STOP (código 1)
                      └─ No
                          ↓
                          Upload Artifacts
                          ↓
                          Summary
                          ↓
                          ✅ SUCCESS (código 0)
```

**Regla clave**: Si `continue-on-error: false`, el pipeline se detiene inmediatamente.

---

### Configuración en `package.json`

```json
{
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "clean": "rm -rf dist coverage"
  }
}
```

---

### Configuración en `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

---

## Parte 3: Uso de nektos/act

### ¿Qué es `act`?

**nektos/act** es una herramienta que permite ejecutar **workflows de GitHub Actions localmente** sin necesidad de hacer push a GitHub.

**Repositorio**: https://github.com/nektos/act

### ¿Por qué es importante?

| Situación | Sin `act` | Con `act` |
|-----------|-----------|----------|
| **Validar workflow** | Push → Esperar 1-2 min → Ver error en GitHub | Ejecutar `act` → Error inmediato |
| **Ciclo de desarrollo** | Lento (push/pull 10+ veces) | Rápido (iteraciones locales) |
| **Costo** | GitHub Actions tiene límites gratuitos | Gratis, usa tu CPU/Docker |
| **Debugging** | Ver logs en GitHub | Logs en terminal local |

---

### ¿Cómo funciona?

**`act` usa Docker para simular el entorno de GitHub Actions:**

```
Tu máquina local
  ↓
act command
  ↓
Docker Engine
  ↓
Crea contenedor con ubuntu-latest
  ↓
Ejecuta workflow exactamente como en GitHub
  ↓
Resultado en terminal
```

---

### Requisitos Previos

#### 1. Docker Desktop
- **Windows/macOS**: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Instalar Docker Engine
- **Verificar**: Ejecutar `docker --version`

**Por qué Docker**: Porque `act` necesita un contenedor Linux para simular el entorno de GitHub.

#### 2. act Instalado

**Windows (PowerShell)**:
```powershell
# Opción 1: Chocolatey
choco install act

# Opción 2: Scoop
scoop install act

# Opción 3: Descargar binario
# https://github.com/nektos/act/releases
```

**macOS**:
```bash
brew install act
```

**Linux**:
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash
```

**Verificar instalación**:
```powershell
act --version
```

---

### Comandos Comunes

#### Ejecutar todo el workflow
```powershell
act
```
- Ejecuta todos los jobs del workflow
- Busca `.github/workflows/*.yml`
- Por defecto usa evento `push`

#### Ejecutar un job específico
```powershell
act -j quality
```
- `-j` especifica el job (en este caso, "quality")
- Útil si hay múltiples jobs

#### Ejecutar evento específico
```powershell
act push
act pull_request
```
- Simula un evento específico
- Modifica cómo se activa el workflow

#### Ver logs detallados
```powershell
act -v
```
- `-v` = verbose
- Muestra más detalles de cada paso

#### Listar jobs disponibles
```powershell
act --list
```
- Muestra qué jobs están en el workflow

#### Usar imagen Docker específica
```powershell
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:full-latest
```
- `-P` especifica la imagen Docker a usar
- Por defecto descarga una imagen mínima

---

### Ejemplo de Ejecución

```powershell
$ cd C:\Users\josep\Documents\GitHub\ParcialElectiva
$ act

[CI - Calidad de Software/quality] 🚀  Start job 'quality'
[CI - Calidad de Software/quality]   🐳  docker run --rm -v C:\path\to\repo:/workspace ...
[CI - Calidad de Software/quality] ✓ Checkout código
[CI - Calidad de Software/quality] ✓ Configurar Node.js 18.x
[CI - Calidad de Software/quality] ✓ Instalar dependencias
[CI - Calidad de Software/quality] ✓ Linting con ESLint
[CI - Calidad de Software/quality] ✓ Compilar (TypeScript)
[CI - Calidad de Software/quality] ✓ Tests unitarios
[CI - Calidad de Software/quality] ✓ Tests con cobertura
[CI - Calidad de Software/quality] ✓ Validar umbral de cobertura (80%)
[CI - Calidad de Software/quality] ✅ CI - Calidad de Software/quality completed successfully

✅ All jobs completed successfully
```

---

### Flujo de Trabajo Recomendado

1. **Desarrollo local**
   ```powershell
   npm run lint:fix
   npm run build
   npm test:coverage
   ```

2. **Validación con `act` antes de push**
   ```powershell
   act
   ```

3. **Si falla localmente**
   - Corregir el error
   - Volver a paso 1

4. **Si pasa localmente**
   ```powershell
   git add .
   git commit -m "Feature: ..."
   git push
   ```

5. **GitHub Actions ejecuta automáticamente**
   - En caso de divergencia (muy raro si `act` pasó)
   - Puedes ver logs en GitHub Actions

---

### Ventajas y Limitaciones

#### ✅ Ventajas
- **Rápido**: Validar en segundos
- **Económico**: No usa cuota de GitHub Actions
- **Offline**: Funciona sin internet (una vez descargada la imagen)
- **Debugging**: Logs en tiempo real
- **Exactitud**: Simula GitHub perfectamente

#### ⚠️ Limitaciones
- **Requiere Docker**: No funciona sin Docker corriendo
- **Primer run**: Descarga imagen Docker (~5-10 min)
- **Secrets**: Requiere configuración especial (menos común)
- **Artifacts**: No sube a GitHub automáticamente

---

### Solución de Problemas

#### Error: "Docker is not running"
```powershell
# Abre Docker Desktop (Windows/macOS)
# Verify:
docker ps
```

#### Error: "act: command not found"
```powershell
# Reinstala act
choco uninstall act
choco install act

# Verifica PATH
$env:PATH
```

#### Error: "No such image"
```powershell
# Descarga imagen correcta
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:full-latest

# O especifica imagen mínima
act -P ubuntu-latest=node:18-alpine
```

#### Run lento
```powershell
# Primera ejecución es lenta (descarga imagen)
# Execuciones posteriores son rápidas (caché)

# Usa imagen más pequeña
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
```

---

### Comparación: `act` vs GitHub Actions

| Característica | `act` (Local) | GitHub Actions |
|---|---|---|
| Instalación | Manual (Docker + act) | Automática en GitHub |
| Tiempo de ejecución | Inmediato (local) | 30-60 segundos (nube) |
| Costo | Gratis (CPU local) | Gratis primeras horas/mes |
| Logging | Terminal local | GitHub web UI |
| Artifacts | Descargable manual | Disponible en GitHub |
| Secretos | Requiere configuración | Fácil en GitHub Settings |
| Escalabilidad | Limitada a tu máquina | Escalable (runners GitHub) |

---

---

## Parte 4: Validación y Logs

### Cómo Identificar Fallos en los Logs

#### 1. Fallo de Linter (ESLint)

**Patrón en logs**:
```
❌ Run failed
eslint error: [error code]
at src/file.ts:line:column
```

**Ejemplo real**:
```
❌ Linting con ESLint
error  Unexpected console statement  no-console
    src/index.ts:5:1
```

**Interpretación**: El linter encontró una línea con `console.log()` que no está permitida en la regla `no-console`.

**Solución**: 
- Remover el `console.log()` o
- Agregar comentario ESLint: `// eslint-disable-next-line no-console`

---

#### 2. Fallo de Compilación (TypeScript)

**Patrón en logs**:
```
❌ Compilar (TypeScript)
error TS[number]: [error message]
```

**Ejemplo real**:
```
❌ Compilar (TypeScript)
error TS2322: Type 'string' is not assignable to type 'number'.
    src/calculator.ts:5:3
```

**Interpretación**: El código TypeScript tiene un error de tipo. Se asignó un `string` donde se esperaba `number`.

**Solución**: Verificar los tipos de datos en la línea indicada.

---

#### 3. Fallo de Tests Unitarios

**Patrón en logs**:
```
❌ Tests unitarios / Tests con cobertura
expect(received).toBe(expected)
Expected: X
Received: Y
```

**Ejemplo real**:
```
FAIL  src/__tests__/calculator.test.ts
● Calculator › add › debe sumar correctamente

  expect(received).toBe(expected)

  Expected: 5
  Received: 4

    4 |   test('debe sumar correctamente', () => {
    5 |     const result = calc.add(2, 2);
  > 6 |     expect(result).toBe(5); // Expectativa incorrecta
```

**Interpretación**: El test espera que `2 + 2 = 5`, pero el resultado es `4`. El test tiene una expectativa incorrecta.

**Solución**: Corregir la expectativa del test o el código que está siendo testeado.

---

#### 4. Fallo de Cobertura

**Patrón en logs**:
```
❌ Validar umbral de cobertura (80%)
Coverage: Lines 72%, Branches 65%, Functions 78%, Statements 71%
❌ Error: Cobertura de 72% es menor a 80%
```

**Interpretación**: La cobertura de código está por debajo del 80% requerido.

**Solución**:
- Crear tests para las líneas no cubiertas
- Revisar `coverage/index.html` para ver qué código no está testeado
- Agregar tests para branches no cubiertos

---

### Logs de un Run Exitoso

```
✅ Checkout código
✅ Configurar Node.js 18.x
✅ Instalar dependencias
✅ Linting con ESLint
✅ Compilar (TypeScript)
✅ Tests unitarios
✅ Tests con cobertura
✅ Validar umbral de cobertura (80%)

Test Suites: 2 passed, 2 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        3.91 s

File           | % Stmts | % Branch | % Funcs | % Lines |
All files      |     100 |      100 |     100 |     100 |
 calculator.ts |     100 |      100 |     100 |     100 |
 validators.ts |     100 |      100 |     100 |     100 |

✅ Cobertura de 100% cumple el umbral mínimo (80%)
```

**Análisis**:
- ✅ Todos los pasos pasaron
- ✅ 33 tests ejecutados, todos pasaron
- ✅ 100% cobertura en todas las métricas (excepcional)
- ✅ El pipeline está listo para despliegue

---

### Logs de un Run Fallido (Test Fallido)

```
❌ Tests con cobertura

FAIL  src/__tests__/failing-test.test.ts
  ● Test fallido intencional › este test debe fallar

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: 1

      2 | describe('Test fallido intencional', () => {
      3 |   test('este test debe fallar', () => {
    > 4 |     expect(1).toBe(2); // Esto falla intencionalmente
        |               ^
      5 |   });
      6 | });

      at Object.<anonymous> (src/__tests__/failing-test.test.ts:4:15)

Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 33 passed, 34 total
Snapshots:   0 total
Time:        4.577 s
Ran all test suites.

Command exited with code 1
```

**Análisis**:
- ❌ 1 test suite falló
- ❌ 1 test falló de 34 totales
- ❌ El test esperaba que 1 sea igual a 2 (expectativa incorrecta)
- ❌ El pipeline se detiene aquí y no continúa
- ❌ El código no será desplegado hasta que se corrija

---

### Diferencias Clave entre Run Exitoso y Fallido

| Aspecto | Run Exitoso | Run Fallido |
|---------|-------------|------------|
| **Salida del comando** | `exit code 0` | `exit code 1` |
| **Color en logs** | ✅ Verde | ❌ Rojo |
| **Pipeline continúa** | Sí, a siguiente paso | No, se detiene |
| **Deployment** | Permitido | Bloqueado |
| **Artefactos** | Se suben | No se generan |
| **Test Suites** | `X passed, X total` | `X failed, Y passed` |
| **Causa típica** | - | Test fallido, cobertura baja, error de linting |

---

### Cómo Ejecutar Localmente y Capturar Logs

#### Con `npm`
```powershell
# Ejecutar tests sin cobertura
npm test 2>&1 | Tee-Object -FilePath "logs-test.txt"

# Ejecutar tests con cobertura
npm run test:coverage 2>&1 | Tee-Object -FilePath "logs-coverage.txt"

# Ejecutar linter
npm run lint 2>&1 | Tee-Object -FilePath "logs-lint.txt"

# Ejecutar build
npm run build 2>&1 | Tee-Object -FilePath "logs-build.txt"
```

#### Con `act` (GitHub Actions localmente)
```powershell
# Ejecutar workflow completo
act 2>&1 | Tee-Object -FilePath "logs-act-full.txt"

# Ejecutar solo un job
act -j quality 2>&1 | Tee-Object -FilePath "logs-act-job.txt"

# Ver logs detallados
act -v 2>&1 | Tee-Object -FilePath "logs-act-verbose.txt"
```

---

---

## Parte 5: IA y Ética en Software

### Investigación: Métodos de Detección de Código Generado por IA

#### Método 1: Análisis de Patrones Estadísticos

**Herramienta**: GPPT (GPT-Plagiarism-Detection), Turnitin, Copyscape

**Cómo funciona**:
- Compara el código contra una base de datos de modelos de IA entrenados
- Analiza patrones estadísticos característicos de LLMs (redundancias, estilos de comentarios)
- Genera un score de probabilidad (0-100%) de contenido generado por IA

**Ventajas**:
- ✅ Rápido y automatizable
- ✅ Análisis a escala

**Desventajas**:
- ❌ Falsos positivos (código humano muy bien estructurado se marca como IA)
- ❌ Falsos negativos (código generado por IA muy bien editado no se detecta)
- ❌ No es definitivo al 100%

**Ejemplo**: Un desarrollador escribe código muy limpio y repetitivo (patrón típico de IA), generando falso positivo.

---

#### Método 2: Análisis Semántico y de Complejidad

**Herramienta**: Análisis manual + ferramentas especializadas (Copyleaks, GPTZero)

**Cómo funciona**:
- Examina la coherencia conceptual del código
- Analiza si la complejidad es apropiada para el problema
- Busca inconsistencias entre diferentes secciones
- Revisa los comentarios (los LLMs tienden a comentar demasiado o muy poco)

**Ventajas**:
- ✅ Detecta código generado editado
- ✅ Mejor para código complejo

**Desventajas**:
- ❌ Requiere revisión humana experta
- ❌ Consume más tiempo
- ❌ Requiere contexto del proyecto

**Ejemplo**: Un código tiene funciones perfectas pero un comentario incoherente, o la estructura es demasiado "perfecta" para ser realista.

---

### ¿Por Qué No es Posible Asegurar al 100% la Autoría?

#### 1. Evolución de Modelos de IA
- Los modelos mejoran constantemente
- Hoy se detecta código generado por GPT-3, mañana GPT-4 puede evitar esa detección
- Es una "carrera armamentística" entre IA generativa y IA detectora

#### 2. Edición de Código
- Código generado por IA puede ser editado manualmente
- Un desarrollador puede tomar código de IA y modificarlo
- Es imposible saber qué porcentaje fue humano vs máquina

#### 3. Similitudes Naturales
- Código bien escrito tiende a seguir patrones similares
- Dos desarrolladores expertos pueden escribir código casi idéntico
- Los LLMs aprenden de código escrito por humanos
- No hay firma única que identifique IA al 100%

#### 4. Contexto Desconocido
- No sabemos qué prompt se usó para generar el código
- No sabemos cuáles fueron las ediciones posteriores
- No tenemos acceso a los LLMs internos del atacante

#### 5. Limitaciones Técnicas
- Los métodos de detección son probabilísticos, no determinísticos
- Siempre hay un margen de error
- Diferentes herramientas dan resultados diferentes

**Conclusión**: La detección de IA es un **problema estadístico sin solución perfecta**, similar a detectar plagio entre humanos.

---

### Propuesta: Políticas Razonables de Uso de IA en Educación

#### Política 1: Uso Transparente y Documentado

**Regla**: Si usas IA, debes indicarlo claramente

```markdown
## Uso de IA en este proyecto

- ✅ Se usó ChatGPT para generar estructura de tests
- ✅ Se usó GitHub Copilot para autocompletar funciones
- ❌ Se usó IA para generar toda la lógica de negocio

### Detalle:
- ESLint config: Generado por IA (100%)
- Jest setup: Basado en documentación oficial + IA (30% IA)
- Lógica de Calculator: Escrito manualmente (100% humano)
```

**Beneficio**: Transparencia y contexto para el evaluador.

---

#### Política 2: Uso Permitido en Ciertas Áreas

**Permitido**:
- ✅ Configuración de herramientas (ESLint, Jest, TypeScript)
- ✅ Boilerplate y scaffolding inicial
- ✅ Tests básicos y repetitivos
- ✅ Documentación y comentarios
- ✅ Debugging de errores específicos

**No Permitido**:
- ❌ Generar toda la lógica de negocio
- ❌ Usar IA sin mencionar
- ❌ Copiar soluciones de proyectos similares
- ❌ Generar soluciones complejas sin comprensión

**Beneficio**: Aprovechar IA como herramienta, no como reemplazo del aprendizaje.

---

#### Política 3: Evaluación por Defensa Oral

**Regla**: El estudiante debe explicar su código

```
Preguntas de Defensa:
1. "¿Por qué elegiste ESLint sobre Prettier?"
2. "¿Cómo funciona tu validador en este caso extremo?"
3. "¿Qué hubiera pasado si el threshold de cobertura fuera 90%?"
4. "¿Podrías escribir este test desde cero sin IA?"
```

**Beneficio**: Detecta si la persona realmente entiende el código.

**Nota**: Un código generado 100% por IA no puede ser explicado con profundidad.

---

#### Política 4: Análisis de Código Comparativo

**Método**: Comparar con trabajos anteriores del estudiante

```
Indicadores de IA:
- 🚩 Cambio drástico en calidad de código
- 🚩 Cambio drástico en estilo de escritura
- 🚩 Presencia de patrones nunca vistos en trabajos anteriores
- ✅ Continuidad con trabajos previos
- ✅ Evolución natural en habilidades
```

**Beneficio**: Detecta patrones anormales específicos del estudiante.

---

#### Política 5: Umbral de Autoría Mínima

**Regla**: Mínimo 60% del trabajo debe ser propio

```
Evaluación de Contribución:

Trabajo = Diseño + Implementación + Testing + Debugging

Si el estudiante:
- ✅ Diseñó la arquitectura (25%)
- ✅ Escribió la lógica principal (35%)
- ⚠️ Generó tests parcialmente con IA (15%)
- ✅ Debugged y optimizó (25%)
= 85% de autoría ✓ APROBADO

Si el estudiante:
- ❌ Copió arquitectura (25%)
- ⚠️ Generó lógica parcialmente con IA (40%)
- ⚠️ Generó tests con IA (20%)
- ⚠️ Mínimo debugging (15%)
= 15% de autoría ✗ RECHAZADO
```

**Beneficio**: Balance entre permitir herramientas y asegurar aprendizaje.

---

#### Política 6: Herramientas de Verificación Obligatorias

**Regla**: Usar múltiples herramientas de detección y documentar

```bash
# Escanear el código con varias herramientas
gppt src/ --threshold 0.7
copyleaks scan .
gptzero analyze src/

# Documentar resultados
echo "SCAN RESULTS:" > AI_SCAN_REPORT.md
```

**Beneficio**: Múltiples perspectivas dan mayor confianza.

**Nota**: Siempre habrá margen de error.

---

#### Política 7: Educación sobre Ética

**Contenido de Curso**:
- Cómo usar IA responsablemente
- Limitaciones y peligros de confiar ciegamente en IA
- Importancia de la autoría y la transparencia
- Diferencia entre "usar herramientas" vs "evadir el aprendizaje"

**Beneficio**: Desarrolladores éticos desde el inicio.

---

### Conclusión

**Punto clave**: La detección de IA **no es la solución**, sino:

1. **Transparencia**: Documentar qué se usó
2. **Contexto**: Entender el porqué de cada decisión
3. **Evaluación integral**: No solo código, sino comprensión
4. **Ética**: Fomentar uso responsable, no paranoia

**Analogía**: Es como el plagio académico. No puedes detectar al 100%, pero puedes:
- Pedir citas y referencias
- Hacer defensa oral
- Comparar con trabajos previos
- Fomentar integridad intelectual

**Visión futura**: En lugar de perseguir IA, la educación debe **adaptar cómo evaluamos**, priorizando comprensión sobre código perfecto.

---
