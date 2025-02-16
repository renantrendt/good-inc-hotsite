#!/bin/bash

# Navegar para o diretório do projeto
cd "$(dirname "$0")/.."

# Executar o script de teste
npm run bigquery-test
