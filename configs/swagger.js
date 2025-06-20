import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title: "COPEREX API",
            version: "1.0.0",
            description: "API for QuickShop",
            contact:{
                name: "Diego Santandrea",
                email: "dsantandrea-2021518@kinal.edu.gt"
            }
        },
        servers:[
          //  {
              //  url: ruta del server
           // }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis:[
        "./src/usuario/user.routes.js",
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi }