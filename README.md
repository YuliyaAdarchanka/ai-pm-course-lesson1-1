# ai-pm-course-lesson1-1

Абстрактная анимация на тему «каково это — быть AI Product Manager».
React + Vite, рендер через canvas — flow-field из частиц + проступающие
слова-смыслы.

## Локально

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
```

## Деплой на Render

Приложение упаковано в Docker (multi-stage: Vite-билд → nginx). Render
подхватит сборку сам — Docker локально устанавливать не нужно.

### Первый запуск

1. https://dashboard.render.com → **New +** → **Web Service**
2. Подключить репозиторий `YuliyaAdarchanka/ai-pm-course-lesson1-1`
3. Render увидит `render.yaml` и предложит создать сервис как Blueprint —
   принять. Параметры (Docker runtime, free plan, регион Frankfurt) уже
   прописаны в файле.
4. Нажать **Apply** / **Create Web Service** и подождать первый билд
   (~3-5 минут).

### Дальше

`autoDeploy: true` — каждый push в `main` триггерит новый билд автоматически.

### Локальный тест Docker (опционально)

```bash
docker build -t ai-pm-anim .
docker run --rm -p 8080:10000 ai-pm-anim
# открыть http://localhost:8080
```
