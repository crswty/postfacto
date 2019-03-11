#!/bin/bash

API_HOST_NAME=$1

cat << EOF > /postfacto-web/public/config.js
window.Retro = {
  config: {
    "globalNamespace": "Retro",
    "title": "Postfacto",
    "scripts": ["application.js"],
    "stylesheets": ["application.css"],
    "useRevManifest": true,
    "api_base_url": "${POSTFACTO_API_SERVICE_HOST}:${POSTFACTO_API_SERVICE_PORT}",
    "websocket_url": "wss://${POSTFACTO_API_SERVICE_HOST}:443/cable",
    "contact": "",
    "terms": "",
    "privacy": ""
  }
}
EOF

npm start
