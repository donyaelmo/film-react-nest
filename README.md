# FILM!

Сервис бронирования билетов в кино: React + Vite, NestJS + TypeORM и PostgreSQL 16. Nginx раздаёт frontend, передаёт запросы API и статические изображения в backend.

Адрес развёрнутого проекта: http://kaptum.ru.

## Запуск через Docker Compose

Требуются Docker и Docker Compose v2. Команды выполняются из корня репозитория.

Для первого запуска создайте `.env`, если его ещё нет:

```bash
cp -n .env.example .env
```

Задайте собственные `POSTGRES_PASSWORD` и `PGADMIN_DEFAULT_PASSWORD`, а также `PGADMIN_DEFAULT_EMAIL`. Файл `.env` не добавляется в Git.

Параметры подключения backend:

- `DATABASE_DRIVER=postgres` - драйвер БД.
- `DATABASE_HOST=database` - имя сервиса PostgreSQL в сети Compose.
- `DATABASE_PORT=5432` - внутренний порт PostgreSQL.
- `DATABASE_NAME=${POSTGRES_DB}` - имя БД.
- `DATABASE_USERNAME=${POSTGRES_USER}` - пользователь БД.
- `DATABASE_PASSWORD=${POSTGRES_PASSWORD}` - пароль БД.

Для frontend используются относительные адреса `VITE_API_URL=/api/afisha` и `VITE_CDN_URL=/content/afisha`. Они передаются при сборке и работают с HTTP и HTTPS на одном домене.

```bash
docker compose config --quiet
docker compose up -d --build frontend backend server
docker compose ps
```

PostgreSQL запускается как зависимость backend. Приложение доступно по адресу http://localhost. При необходимости отдельно запустите pgAdmin командой `docker compose up -d pgadmin`; его адрес - http://localhost:8080.

При первом запуске на пустом томе PostgreSQL последовательно выполняет существующие SQL-файлы из `backend/test`: `prac.init.sql`, `prac.films.sql`, `prac.shedules.sql`. Они создают таблицы и загружают демонстрационные фильмы и сеансы. На существующем томе эти скрипты повторно не выполняются.

## Проверка API

```bash
curl -f http://localhost/api/afisha/films
curl -f http://localhost/api/afisha/films/0e33c7f6-27a7-4aa0-8e61-65d7e5effecf/schedule
```

Бронирование: `POST /api/afisha/order`. Тело запроса содержит `email`, `phone` и массив `tickets`; каждый билет содержит `film`, `session`, `daytime`, `row`, `seat`, `price`. Используйте идентификаторы и доступные места из ответа API сеансов. Все билеты заказа сохраняются в одной транзакции; при ошибке бронирование всего заказа отменяется.

## Локальные сборки и проверки

Используется npm. У backend и frontend собственные `package-lock.json`, соответствующие их `package.json`; установка зависимостей выполняется через `npm ci`.

В каталоге `backend`:

```bash
npm ci
npm run build
npm test -- --runInBand
npm run lint
```

В каталоге `frontend`:

```bash
npm ci
npm run build
npm run lint
```

Линтинг проверяет код без автоматического изменения файлов.

Для разработки backend вне Docker используйте `backend/.env.example`, указав адрес, порт и учётные данные отдельно запущенного PostgreSQL с инициализированными таблицами. Затем выполните `npm run start:dev` в `backend`. Для frontend создайте `frontend/.env.local` с `VITE_API_URL=http://localhost:3000/api/afisha` и `VITE_CDN_URL=http://localhost:3000/content/afisha`, затем выполните `npm run dev` в `frontend`.
