# Sonar-qube proxy app

### Environment variables
- **PORT** (default: 8080)
- **SONAR_QUBE_KEY** - Api key generated in sonarQube
- **SONAR_QUBE_URL**
- **WEBHOOK_TOKEN** - Token that should be added to webhook url (if you set `WEBHOOK_TOKEN=123` the webhook should be sent to the `webhook/123` url)
- **TOKEN** - Token to access the app. All endpoints (except webhook) require this token to be present in the `authentication` header

### Run development build
`npm run dev`

### Run production build
`npm run start`

