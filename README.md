## Modification pour relier le backend au frontend

modifier `main.ts` avec le code suivant : 

``  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  });``