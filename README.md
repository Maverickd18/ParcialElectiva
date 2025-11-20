# Parcial de Calidad de Software Avanzado - CI/CD Pipeline

Proyecto de implementación de CI/CD con GitHub Actions, linters, cobertura de código y pruebas automatizadas en **TypeScript**.

## 📋 Contenido

1. **Estructura del Proyecto**
2. **Configuración de Herramientas**
3. **Pipeline CI/CD**
4. **Ejecutar localmente con `act`**
5. **Comandos útiles**

---

## 🏗️ Estructura del Proyecto

```
ParcialElectiva/
├── .github/
│   └── workflows/
│       └── ci-quality.yml        # Workflow de GitHub Actions
├── src/
│   ├── calculator.ts             # Clase con lógica de negocio
│   ├── validators.ts             # Funciones de validación
│   ├── index.ts                  # Punto de entrada
│   └── __tests__/
│       ├── calculator.test.ts    # Tests de Calculator
│       └── validators.test.ts    # Tests de Validators
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración TypeScript
├── jest.config.js               # Configuración Jest
├── .eslintrc.json               # Configuración ESLint
├── .gitignore                   # Archivos ignorados
└── README.md                    # Este archivo
```

---

## 🛠️ Configuración de Herramientas

### TypeScript
- **Versión**: 5.3.3+
- **Compilador**: tsc
- **Configuración**: `tsconfig.json`
- **Salida**: `dist/` (transpilado a ES2020)

### ESLint (Linter)
- **Versión**: 8.56.0+
- **Parser**: @typescript-eslint/parser
- **Plugins**: @typescript-eslint
- **Configuración**: `.eslintrc.json`
- **Reglas**: 
  - No variables sin usar
  - No console (excepto index.ts)
  - Semicolons obligatorios
  - Convenciones de TypeScript

### Jest (Testing Framework)
- **Versión**: 29.7.0+
- **Preset**: ts-jest
- **Tests**: `src/__tests__/**/*.test.ts`
- **Cobertura**: Incluida nativamente

### Cobertura de Código
- **Herramienta**: Jest Coverage
- **Umbral mínimo**: **80%** (líneas, branches, funciones, statements)
- **Salida**: `coverage/` (HTML + LCOV)
- **Archivos excluidos**: `index.ts`, `*.test.ts`

---

## 🚀 Pipeline CI/CD

### Workflow: `ci-quality.yml`

El workflow se activa en:
- **Push** a ramas `main` o `develop`
- **Pull Request** contra `main` o `develop`

### Pasos del Pipeline

| # | Paso | Descripción | Falla si |
|---|------|-------------|----------|
| 1 | **Checkout** | Descarga el código del repositorio | No aplica |
| 2 | **Setup Node.js** | Configura Node.js 18.x | No aplica |
| 3 | **Install Dependencies** | Ejecuta `npm ci` | `package-lock.json` no existe |
| 4 | **Linting** | Ejecuta `npm run lint` (ESLint) | Errores de linting |
| 5 | **Build** | Ejecuta `npm run build` (tsc) | Errores de TypeScript |
| 6 | **Unit Tests** | Ejecuta `npm run test` | Tests que fallan |
| 7 | **Coverage Check** | Ejecuta `npm run test:coverage` | Cobertura < 80% |
| 8 | **Validate Threshold** | Valida umbral 80% | Alguna métrica < 80% |
| 9 | **Upload Artifacts** | Sube reportes de cobertura | No aplica (informativo) |
| 10 | **Summary** | Resumen del run | No aplica (informativo) |

**Importante**: Si cualquier paso falla, el pipeline se detiene inmediatamente.

---

## 🐳 Ejecutar Localmente con `act`

### ¿Qué es `act`?

**`act`** es una herramienta que permite ejecutar workflows de GitHub Actions localmente. 

- **Repositorio**: https://github.com/nektos/act
- **Utilidad**: Testear workflows sin hacer push a GitHub
- **Ventaja**: Ciclos de desarrollo más rápidos
- **Funcionamiento**: Usa Docker para simular el entorno de GitHub Actions

### Requisitos Previos

1. **Docker** debe estar instalado y corriendo
   ```powershell
   docker --version  # Verificar instalación
   ```

2. **act** debe estar instalado
   ```powershell
   choco install act  # En Windows con Chocolatey
   # O descargar de: https://github.com/nektos/act/releases
   ```

### Instalar `act` en Windows

#### Opción 1: Chocolatey (Recomendado)
```powershell
choco install act
```

#### Opción 2: Descargar desde GitHub
```powershell
# Descargar el archivo .zip desde
# https://github.com/nektos/act/releases

# Extraer y agregar a PATH del sistema
```

### Ejecutar el Workflow Localmente

#### Ejecutar todo el workflow
```powershell
act
```

#### Ejecutar solo un job específico
```powershell
act -j quality
```

#### Ejecutar con imagen predeterminada más pequeña (sin Docker Desktop completo)
```powershell
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
```

#### Ver logs detallados
```powershell
act -v
```

### Ejemplo de uso

```powershell
# 1. Navegar al directorio del proyecto
cd C:\Users\josep\Documents\GitHub\ParcialElectiva

# 2. Ejecutar el workflow localmente
act

# 3. Salida esperada:
# [CI - Calidad de Software/quality] ✅ Run completed
# Mostrará cada paso del pipeline
```

### Diferencias entre `act` y GitHub Actions

| Aspecto | `act` (Local) | GitHub Actions (Nube) |
|--------|---------------|-----------------------|
| Velocidad | Inmediata | 30-60 segundos |
| Entorno | Tu máquina | Servidores GitHub |
| Artifacts | Limitados | Completos |
| Costo | Gratuito | Gratuito (primeras horas) |
| Debugging | Fácil | Más complicado |

---

## 📋 Comandos Útiles

### Desarrollo Local

```powershell
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar linter
npm run lint

# Ejecutar linter con auto-fix
npm run lint:fix

# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Limpiar archivos generados
npm run clean
```

### Con `act` (Local CI/CD)

```powershell
# Ejecutar el workflow completo localmente
act

# Ejecutar solo el job 'quality'
act -j quality

# Ejecutar con logs detallados
act -v

# Listar jobs disponibles
act --list
```

### En GitHub Actions (Nube)

1. Hacer push a rama `main` o `develop`
2. Ver el workflow en la pestaña "Actions" del repositorio
3. Hacer clic en el run para ver detalles
4. Descargar artifacts desde la sección de "Artifacts"

---

## 📊 Reportes de Cobertura

### Generar reportes locales

```powershell
npm run test:coverage
```

Esto genera:
- `coverage/index.html` - Reporte HTML interactivo
- `coverage/lcov.info` - Formato LCOV para integraciones
- `coverage/coverage-final.json` - JSON con datos completos

### Ver reporte en el navegador

```powershell
# Windows
start coverage/index.html

# macOS
open coverage/index.html

# Linux
xdg-open coverage/index.html
```

---

## ✅ Checklist de Ejecución

- [ ] Clonar el repositorio
- [ ] Instalar Node.js 18+
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm run lint` (sin errores)
- [ ] Ejecutar `npm run build` (sin errores)
- [ ] Ejecutar `npm run test` (todos los tests pasan)
- [ ] Ejecutar `npm run test:coverage` (cobertura >= 80%)
- [ ] Instalar Docker
- [ ] Instalar `act`
- [ ] Ejecutar `act` localmente
- [ ] Ver logs de un run exitoso y uno fallido
- [ ] Documentar en RESPUESTAS.md

---

## 🔍 Interpretación de Logs

### Logs de un Run Exitoso

```
✅ [CI - Calidad de Software/quality] ✓ Checkout código
✅ [CI - Calidad de Software/quality] ✓ Configurar Node.js 18.x
✅ [CI - Calidad de Software/quality] ✓ Instalar dependencias
✅ [CI - Calidad de Software/quality] ✓ Linting con ESLint
✅ [CI - Calidad de Software/quality] ✓ Compilar (TypeScript)
✅ [CI - Calidad de Software/quality] ✓ Tests unitarios
✅ [CI - Calidad de Software/quality] ✓ Tests con cobertura
✅ [CI - Calidad de Software/quality] ✓ Validar umbral de cobertura (80%)
```

### Logs de un Run Fallido

```
❌ [CI - Calidad de Software/quality] ✗ Linting con ESLint
Error: ESLint found 1 error:
  src/calculator.ts:5:1  error  Unexpected console statement  no-console
```

---

## 📝 Notas Adicionales

- El proyecto está configurado para validar **umbrales de cobertura del 80%**
- Los tests cubren casos normales, errores y límites
- ESLint está configurado de forma estricta para calidad de código
- El archivo `index.ts` está excluido de cobertura (es solo demostración)

---

## 🎓 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [nektos/act Repository](https://github.com/nektos/act)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Jest Documentation](https://jestjs.io/)

---

**Autor**: Estudiante  
**Fecha**: Noviembre 2025  
**Examen**: Calidad de Software Avanzado
