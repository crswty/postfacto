#!/bin/bash

cat << EOF > /postfacto-web/public/config.js
window.Retro = {
  config: {
    "globalNamespace": "Retro",
    "title": "Postfacto",
    "scripts": ["application.js"],
    "stylesheets": ["application.css"],
    "useRevManifest": true,
    "api_base_url": "${API_URL}",
    "websocket_url": "${WS_URL}",
    "contact": "",
    "terms": "",
    "privacy": ""
  }
}
EOF

npm run build
npm run serve-built
