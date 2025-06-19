#!/bin/bash
# Script para comentar todos los console.log, console.warn y console.error en el proyecto

echo "Comentando todo el código de depuración en archivos .js, .ts y .vue..."

# Función para procesar los archivos
cleanup_file() {
  local file=$1
  echo "Procesando: $file"
  
  # Comentar console.log, console.warn, console.error que no estén ya comentados
  sed -i 's/\(console\.log\)/\/\/ \1/g' "$file"
  sed -i 's/\(console\.warn\)/\/\/ \1/g' "$file"
  sed -i 's/\(console\.error\)/\/\/ \1/g' "$file"
  
  # Evitar comentarios duplicados (// // console.log)
  sed -i 's/\/\/ \/\/ console/\/\/ console/g' "$file"
}

# Buscar y procesar todos los archivos .js, .ts y .vue
find /home/jarvis/CascadeProjects/cms-marketing-vue -type f \( -name "*.js" -o -name "*.ts" -o -name "*.vue" \) | while read file; do
  cleanup_file "$file"
done

echo "Limpieza de código de depuración completada."
