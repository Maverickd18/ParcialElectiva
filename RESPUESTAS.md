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

[Se completará después de crear el workflow]

---

## Parte 3: Uso de nektos/act

[Se completará después de documentar]

---

## Parte 4: Validación y Logs

[Se completará después de ejecutar los tests]

---

## Parte 5: IA y Ética

[Se completará con investigación]
