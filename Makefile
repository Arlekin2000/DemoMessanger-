VIRTUAL_ENV ?= venv

.PHONE: db
db:
	python -m backend -init_db

.PHONY: back
back:
	poetry run uvicorn backend:app --reload --reload-dir backend --host 0.0.0.0 --port 8000

.PHONY: t test
t test:
	pytest
