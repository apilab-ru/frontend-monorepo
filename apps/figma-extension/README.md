# Figma Extension
Расширение для Figma заменяющее токены фигмы по настраиваемой мапе.

## Команды
```
"copy": "copyfiles -f ./apps/figma-extension/extension/* ./apps/figma-extension/dist",

"cabinet:dev": "nx run figma-extension-cabinet:build:development --watch",
"popup:dev": "nx run figma-extension-popup:build:development --watch",
"ts:dev": "webpack --mode development --config ./apps/figma-extension/background/webpack.config.js --env=development -w",

"cabinet:build": "nx run figma-extension-cabinet:build:production",
"popup:build": "nx run figma-extension-popup:build:production",
"ts:build": "webpack --config ./apps/figma-extension/background/webpack.config.js --env=production --devtool=false",
```