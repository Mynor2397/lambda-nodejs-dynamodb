# lambda-nodejs-dynamodb

_Adjunto al proyecto se encuentra un archivo .http, puede instalar la extension para VSCODE y realizar las pruebas ahi mismo_

Esta es la llamada a los puntos finales:

### Para ingresar un registro
POST https://hks256mx04.execute-api.us-east-2.amazonaws.com/dev/candidates
Content-Type: application/json

{
	"fullname":"",
	"email": "", 
	"experience":3
}

### Para leer todos los registros
GET  https://hks256mx04.execute-api.us-east-2.amazonaws.com/dev/candidates


### Para buscar un registro por id
GET https://hks256mx04.execute-api.us-east-2.amazonaws.com/dev/candidates/{id}

### Para actualizar un registro por su id
PUT https://hks256mx04.execute-api.us-east-2.amazonaws.com/dev/candidates/{id}
Content-Type: application/json

{
	"fullname":"",
	"email": ""
}

### Para borrar un registro por su id
DELETE https://hks256mx04.execute-api.us-east-2.amazonaws.com/dev/candidates/{id}

---
⌨️realizado por [Mynor Castrillo](https://github.com/Mynor2397) 😊
