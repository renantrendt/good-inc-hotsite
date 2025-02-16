#!/bin/bash

# Navegar para o diretório do projeto
cd "$(dirname "$0")/.."

# Executar o script de verificação de schema
npx ts-node scripts/bigquery-schema-check.ts
