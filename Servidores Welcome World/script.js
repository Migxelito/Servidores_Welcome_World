const http = require('http')
const url = require('url')
const fs = require('fs')

// Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato “dd/mm/yyyy”. Considera que si el día o el mes es menor a 10 concatenar un “0” a la izquierda. (Opcional)
var fecha = new Date().toLocaleDateString('en-GB')

const PORT = '8080';
// Crear un servidor en Node con el módulo http.

http
    .createServer((req, res) => {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        const params = url.parse(req.url, true).query
        const archivo = params.archivo
        const nombre = params.nombre
        const nuevoNombre = params.nuevoNombre
        const contenido = params.contenido
        // Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida. TODOS tienen un mensaje en caso de error.

        // Disponibilizar una ruta para crear un archivo a partir de los parámetros de la consulta recibida.

        if (req.url.includes('/crear')) {
            fs.writeFile(archivo, `Fecha: ${fecha}, \n ${contenido}`, () => {
                res.write(`El Archivo: ${archivo} fue Creado Satisfactoriamente`)
                res.end()
            })
        }
        // Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es declarado en los parámetros de la consulta recibida.

        if (req.url.includes('/leer')) {

            fs.readFile(archivo, (err, data) => {
                if (err) {
                    res.write('el archivo no existe')
                    res.end()

                } else {
                    res.write(data)
                    res.end()
                }

            })
        }
        // Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es declarado en los parámetros de la consulta recibida.

        if (req.url.includes('/renombrar')) {
            fs.rename(nombre, nuevoNombre, (err, data) => {
                if (err) {
                    res.write('el archivo no existe')
                    res.end()

                } else {
                    // En la ruta para renombrar, devuelve un mensaje de éxito incluyendo el nombre anterior del archivo y su nuevo nombre de forma dinámica . (Opcional)

                    res.write(`Archivo ${nombre} renombrado por ${nuevoNombre}`)
                    res.end()
                }

            })
        }
        // Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los parámetros de la consulta recibida.
        if (req.url.includes('/eliminar')) {
            fs.unlink(archivo, (err, data) => {
                if (err) {
                    res.write('el archivo no existe')
                    res.end()

                } else {
                    res.write(`tu solicitud para eliminar el archivo : ${archivo} se esta procesando `);

                    setTimeout(() => {
                        res.write(` \n se ha eliminado el archivo ${archivo} de manera exitosa `, () => res.end())

                    }, 3000);

                }

            })
        }
    })
    .listen(PORT, () => console.log('Escuchando el puerto' + PORT));