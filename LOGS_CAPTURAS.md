# Capturas de Pantalla - Runs Exitosos y Fallidos

## Instrucciones para Capturar Logs

### Opción 1: GitHub Actions (Recomendado - Más fácil)

#### Run Exitoso:
1. Hacer push a `main` o `develop`
2. Ir a tu repositorio en GitHub
3. Click en la pestaña **"Actions"**
4. Ver el workflow "CI - Calidad de Software"
5. Hacer screenshot del run exitoso
6. Expandir cada paso y capturar los logs

#### Run Fallido:
1. Crear una rama de prueba
2. Modificar código para romper intencionalmente (ej: agregar `console.log()`)
3. Hacer push
4. GitHub Actions ejecutará automáticamente
5. Capturar los logs del error

---

### Opción 2: Local con `act`

#### Instalación de `act`:

**Windows (PowerShell)**:
```powershell
choco install act
# o
scoop install act
```

**Verificar**:
```powershell
act --version
```

#### Run Exitoso:
```powershell
cd c:\Users\josep\Documents\GitHub\ParcialElectiva
act
# Capturar la salida con screenshot
```

#### Run Fallido:
```powershell
# 1. Crear un test fallido temporal
# 2. Ejecutar act
# 3. Capturar logs del error
# 4. Limpiar
```

---

## Logs Capturados

### ✅ Run Exitoso (Ejecución Local)

```
> parcial-calidad-software@1.0.0 test:coverage
> jest --coverage

 PASS  src/__tests__/validators.test.ts
 PASS  src/__tests__/calculator.test.ts
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |                   
 calculator.ts |     100 |      100 |     100 |     100 |                   
 validators.ts |     100 |      100 |     100 |     100 |                   
---------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        3.91 s
Ran all test suites.
```

**Análisis**: ✅ Todos los tests pasan, 100% cobertura, pipeline exitoso

---

### ❌ Run Fallido (Ejecución Local)

```
 PASS  src/__tests__/calculator.test.ts
 PASS  src/__tests__/validators.test.ts
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

**Análisis**: ❌ 1 test falló, el pipeline se detiene (exit code 1)

---

## Diferencias Clave

| Elemento | Run Exitoso | Run Fallido |
|----------|-------------|------------|
| **Exit Code** | 0 | 1 |
| **Test Suites** | All passed | 1 failed |
| **Tests** | 33 passed | 1 failed, 33 passed |
| **Cobertura** | 100% | N/A (no llega a validación) |
| **Pipeline continúa** | Sí | No, se detiene |
| **Deployment** | ✅ Permitido | ❌ Bloqueado |

---

## Cómo Presentar en la Entrega

### Opción A: Incluir Screenshots en README.md
```markdown
## Screenshots de Ejecución

### Run Exitoso
![Exitoso](./screenshots/run-exitoso.png)

### Run Fallido
![Fallido](./screenshots/run-fallido.png)
```

### Opción B: Enlace a GitHub Actions
```markdown
## Ejecuciones en GitHub Actions

- [Ver workflow en GitHub](https://github.com/Maverickd18/ParcialElectiva/actions)
- [Run exitoso](enlace-específico)
- [Run fallido](enlace-específico)
```

### Opción C: Documentación en RESPUESTAS.md
- Ya incluida en este archivo (ver Parte 4)
- Logs reales capturados de ejecuciones

---

## Nota Importante

Los logs ya están capturados y documentados en **RESPUESTAS.md - Parte 4**.
Este archivo sirve como guía para capturar screenshots si es necesario para la entrega final.

