# Comandos de Git y GitHub

Guía rápida de los comandos más usados en este proyecto.

## Configuración inicial (solo la primera vez)

```bash
git init
git remote add origin <url-del-repositorio>
```

## Clonar el repositorio

```bash
git clone <url-del-repositorio>
```

## Ver el estado de los cambios

```bash
git status
```

## Ver a dónde apunta el repositorio

```bash
git remote -v
```

Muestra la URL del repositorio remoto (origin) configurado para hacer `push`/`pull`.

## Subir cambios al repositorio

```bash
git add .
git commit -m "mensaje descriptivo del cambio"
git push
```

- `git add .` agrega todos los archivos modificados y nuevos al área de staging.
- `git add <archivo>` agrega solo un archivo específico.
- `git commit -m "mensaje"` guarda los cambios con un mensaje descriptivo.
- `git push` sube los cambios al repositorio remoto (GitHub).

## Bajar los últimos cambios del repositorio

```bash
git pull
```

Úsalo para actualizar tu copia local con los cambios que otros (o tú desde otro equipo) hayan subido.

## Ver el historial de cambios

```bash
git log
git log --oneline
```

## Ver las diferencias antes de confirmar

```bash
git diff
```

## Deshacer cambios

```bash
# Descartar cambios no confirmados en un archivo
git restore <archivo>

# Quitar un archivo del área de staging (sin perder los cambios)
git restore --staged <archivo>
```

## Ramas (branches)

```bash
git branch                  # ver ramas locales
git checkout -b <nombre>    # crear y cambiar a una nueva rama
git checkout <nombre>       # cambiar de rama
git merge <nombre>          # fusionar una rama en la actual
```

## Colaboradores

```bash
git remote -v               # ver el repositorio remoto configurado
```

Para gestionar quién puede subir cambios directamente al repositorio, ve a **Settings → Collaborators and teams** en GitHub.
