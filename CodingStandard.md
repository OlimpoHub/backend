# Estándar de codificación

En éste archivo se pueden ver los estándares de codificación que **Olimpo** usará para programar en los siguientes lenguajes:
 - [Todos los lenguajes](#general)
     - [Formato y espaciado](#formato-y-espaciado)
     - [Llaves](#llaves)
     - [Comentarios](#comentarios)
     - [Nombres e identificadores](#nombres-e-identificadores)
     - [Declaraciones de control](#declaraciones-de-control)
 - [JavaScript](#exclusivos-javascript)
     - [Objetos](#objetos)
     - [Arreglos](#arreglos)
     - [Strings](#strings)
     - [Funciones de flecha](#funciones-de-flecha)
 - [SQL](#exclusivos-sql)
     - [Formato](#formato)
     - [Nombres e identificadores](#nombres-e-identificadores-1)
     - [Joins](#joins)
 - [Seguridad en consultas SQL](#seguridad-en-consultas-sql-nodejs--mariadb)
    - [Principios generales](#principios-generales)
    - [Ejemplo correcto](#ejemplo-correcto)
    - [Ejemplo incorrecto](#ejemplo-incorrecto)
    - [Múltiples parámetros](#multiples-parametros)
    - [Manejo de identificadores dinámicos](#manejo-de-identificadores-dinamicos)
    - [Validación de entrada](#validacion-de-entrada)
    - [Manejo de errores](#manejo-de-errores)
    - [Liberación de conexiones](#liberacion-de-conexiones)
    - [Checklist de seguridad SQL](#checklist-de-seguridad-sql)
    - [Payloads de prueba comunes](#payloads-de-prueba-comunes)
    - [Conclusión](#conclusion)



Éstos estándares están basados de manera parcial en:
 - [Estándar de Airbnb para JavaScript](https://github.com/airbnb/javascript)

## General:
 > [!NOTE]
 > En este apartado se usará JavaScript como ejemplo en los bloques de código

 - [Formato y espaciado](#formato-y-espaciado)
 - [Llaves](#llaves)
 - [Comentarios](#comentarios)
 - [Nombres e identificadores](#nombres-e-identificadores)
 - [Declaraciones de control](#declaraciones-de-control)

### Formato y espaciado:
 - Utilizar 4 espacios por cada tabulación.
    ```js
    // mal
    if (isTrue()) {
    if (isTrue()) {
        if (isTrue()) {
            // ...
        }
    }
    }

    // bien
    if (isTrue()) {
        if (isTrue()) {
            if (isTrue()) {
                // ...
            }
        }
    }
    ```

 - Al asignarle un valor a una variable o usar operadores en general, separar con espacios cada valor y operador.
    ```js
    // mal
    let sum=10+20+30

    // mal
    let sum = 10+20+30

    // bien
    let sum = 10 + 20 + 30
    ```

 - Dejar una línea en blanco al término de cada bloque.
    ```js
    // mal
    if (isTrue()) {
        // ...
    }
    if (isFalse()) {
        // ...
    }

    // bien
    if (isTrue()) {
        // ...
    }

    if (isFalse()) {
        // ...
    }
    ```

 - Si al declarar una función se ocupan muchos parámetros y se vuelve imposible que todo esté en una sola línea, declarar cada parámetro en su propia línea.
    ```js
    // mal
    function processData(let variable1, let variable2, let variable3, let variable4, let variable5, let variable6) {
        // ...
    }

    // bien
    function processData(
        let variable1,
        let variable2,
        let variable3,
        let variable4,
        let variable5,
        let variable6
    ) {
        // ...
    }
    ```

 - Si el lenguaje no lo necesita, no usar `;`.


### Llaves:
 - Para expresiones if y when, siempre usar llaves, aunque solo tengan una línea (a excepción que sea un operador ternario):
    ```js
    // mal
    if (value > 10) value = 0

    // bien
    if (value > 10) {
        value = 0
    }
    ```


 - Seguir el estilo de llaves de _Kernighan y Ritchie_ para bloques con llaves (a excepción que sea un operador ternario).
     - Sin salto de línea antes de la llave de apertura.
     - Salto de línea después de la llave de apertura.
     - Salto de línea antes de la llave de cierre.
     - Salto de línea después de la llave de cierre (solo si esa llave termina, en caso contrario un espacio).

    ```js
    // mal
    if (value > 10)
    {
        // ...
    }
    else
    {
        // ...
    }

    // bien
    if (value > 10) {
        // ...
    } else {
        // ...
    }
    ```


### Declaraciones de control:
 - Separar los paréntesis de la palabra reservada y las llaves con espacio.
    ```js
    // mal
    if(isTrue()){
        // ...
    }

    // bien
    if (isTrue()) {
        // ...
    }
    ```

 - Separar cada condición con espacios.
    ```js
    // mal
    if (isTrue()&&isTrueAgain()) {
        // ...
    }

    // bien
    if (isTrue() && isTrueAgain()) {
        // ...
    }
    ```

 - Si tus declaraciones de control terminan siendo muy largas, separar en varias líneas, y asegurar de que inicien con su operador lógico; e iniciar las declaraciones en una línea extra.
    ```js
    // mal
    if ( firstCond() && secondCond() && thirdCond() ) {
        // ...
    }

    // mal
    if ( 
        firstCond() && 
        secondCond() && 
        thirdCond() 
    ) {
        // ...
    }

    // mal
    if ( firstCond() 
        && secondCond() 
        && thirdCond() ) {
        // ...
    }

    // bien
    if ( 
        firstCond() 
        && secondCond() 
        && thirdCond() 
    ) {
        // ...
    }
    ```


### Comentarios:
 - Si el comentario es de varias líneas, usar el comentario multilinea de dicho lenguaje.
    ```js
    // mal
    // Voy a hacer varios comentarios
    // Comentario 1
    // Comentario 2

    // bien
    /**
     * Voy a hacer varios comentarios
     * Comentario 1
     * Comentario 2
    */
    ```

 - Iniciar cada comentario con un espacio para que sea fácil de leer.
    ```js
    // mal
    //esto es mi comentario

    // bien
    // esto es mi comentario
    ```

 - Para comentarios de una sola línea poner una línea vacía antes del comentario a menos de que sea la primer línea del bloque, o que se estén encadenando funciones, en cuyo caso sí se puede comentar sobre la misma línea.
    ```js
    // mal
    if (isTrue) {

        // Significa que es verdadero
        const zero = 0
        // Le pongo un valor
        const one = 1
    }

    // mal
    if (isTrue) {

        // Significa que es verdadero
        const zero = 0
        
        // Le pongo un valor
        const one = 1
    }

    // bien
    if (isTrue) {
        // Significa que es verdadero
        const zero = 0

        // Le pongo un valor
        const one = 1
    }

    // bien
    funcionA // Comentario sobre la línea
    .funcionB // Comentario sobre la línea
    .funcionC // Comentario sobre la línea
    ```

### Nombres e identificadores:
 - Usar `SCREAMING_SNAKE_CASE` para nombrar constantes.
    ```js
    // mal
    const pi = 3.14
    const ourName = "Olimpo"

    // bien
    const PI = 3.14
    const OUR_NAME = "Olimpo"
    ```

 - Usar `PascalCase` para nombrar clases, estructuras, interfaces, protocolos, enum o tipos.
    ```js
    // mal
    class mountOlympus {
        // ...
    }

    // bien
    class MountOlympus {
        // ...
    }
    ```

 - Usar `camelCase` para nombrar métodos y variables.
    ```js
    // mal
    let FreeDay = "Wednesay"

    // bien
    let freeDay = "Wednesday"
    ```

 - Ser descriptivo con los nombres que hagas.
    ```js
    // mal
    let x = 5

    // bien
    let teamAmount = 5
    ```

 - Si usas un booleano, asegegurar de incluir una palabra como `is` o `has` para denotar que es un predicado.
    ```js
    // mal
    let active = true

    // bien
    let isActive = true
    ```

 - En lenguajes tipados, siempre especificar de forma explícita el tipo de cada variable.
    ```kotlin
    // Ejemplo en Kotlin

    // mal
    var ourName = "Olimpo"

    // bien
    val ourName: String = "Olimpo"
    ```


### Strings:
 - Usar comillas dobles `" "`, salvo de que la situación no lo permita.
    ```js
    // mal
    const ourName = 'Olimpo'

    // bien
    const ourName = "Olimpo"
    ```

 - Usar string multilinea solo en caso de que sea estrictamente necesario.
    ```js
    // mal (string corto innecesariamente en multilínea)
    const greeting = `
    Hola
    Olimpo
    `;

    // mal (string de una sola línea)
    const message = `Nothing.`

    // bien (string extenso donde mejora la legibilidad)
    const errorMessage = `
    Error: No se pudo conectar con el servidor.
    Posibles causas:
    - La red no está disponible.
    - El servidor no responde.
    - La configuración es incorrecta.
    `;
    ```

## Exclusivos JavaScript:

 - [Objetos](#objetos)
 - [Arreglos](#arreglos)
 - [Strings](#strings)
 - [Funciones de flecha](#funciones-de-flecha)

### Objetos:
 - Al añadir funciones dentro de un objeto, no definir que es una función.
    ```js
    // mal
    const obj = {
        value: 1,

        add: function (valor) {
            return obj.valor + valor;
        },
    };

    // bien
    const obj = {
        value: 1,

        add(valor) {
            return obj.valor + valor;
        },
    };
    ```

 - Al añadirle atributos al objeto, si tiene el mismo nombre que la variable, no repetir, solo abreviarlo.
    ```js
    const name = 'John Smith';

    // mal
    const obj = {
        name: name,
    };

    // bien
    const obj = {
        name,
    };
    ```

 - Al añadir atributos abreviados a un objeto, poner dichos atributos al inicio de la declaración del objeto.
    ```js
    const name = 'John';
    const lastName = 'Smith';

    // mal
    const obj = {
        age: 20,
        address: 'New Jersey Av. #34',
        name,
        weight: 68,
        lastName,
    };

    // bien
    const obj = {
        name,
        lastName,
        age: 20,
        address: 'New Jersey Av. #34',
        weight: 68,
    };
    ```


### Arreglos:
 - Al declarar arreglos, solo marcar con corchetes.
    ```js
    // mal
    const elements = new Array();

    // bien
    const elements = [];
    ```

 - Para añadir nuevos elementos al arreglos usar push.
    ```js
    const elements = [];

    // mal
    elements[elements.length] = 'newElement';

    // bien
    elements.push('newElement');
    ```

 - Para copiar arreglos, usar `...`.
    ```js
    // mal
    const size = elements.length;
    const copy = [];

    for (let i = 0; i < lon; i++) {
        copy[i] = elements[i];
    }

    // bien
    const copy = [...elements];
    ```


### Strings:
 - En caso de querer añadir variables a la string, usar plantillas literales.
    ```js
    // mal
    const myName = (name, lastName) => {
        return 'My name is ' + name + ' ' + lastName;
    }

    // bien
    const myName = (name, lastName) => {
        return `My name is ${name} ${lastName}`;
    }
    ```

 - En caso de tener una string muy larga, separar conservando la identación original.
    ```js
    // mal
    function largeText() {
        const text = 'este es un texto muy muy largo que si lo sigo leyendo se me va hacer muy difícil leerlo completo.';
        // ...
    }

    // mal
    function largeText() {
        const text = `este es un texto muy muy largo 
    que si lo sigo leyendo se me va 
    hacer muy difícil leerlo completo.`;
        // ...
    }

    // bien
    function largeText() {
        const text = `este es un texto muy muy largo 
        que si lo sigo leyendo se me va 
        hacer muy difícil leerlo completo.`;
        // ...
    }
    ```

### Funciones de flecha:
 - Cuando se ocupe usar una función anónima, usar funciones de flecha.
    ```js
    // mal
    array.forEach(function (element) {
        // ...
    });

    // bien
    array.forEach((element) => {
        // ...
    });
    ```

 - Añadir paréntesis a los parámetros usados.
    ```js
    // mal
    const greet = person => {
        console.log(person);
    };

    // bien
    const greet = (persona) => {
        console.log(person);
    };
    ```

## Exclusivos SQL:

 - [Formato](#formato-1)
 - [Nombres e identificadores](#nombres-e-identificadores-1)
 - [Joins](#joins)

### Formato
- Usar mayúsculas para palabras reservadas y minúsculas para lo demás.
    ```sql
    -- mal
    select Name, Age from Users;

    -- bien
    SELECT name, age
    FROM users;
    ```

- Usar una línea para cada cláusula de la consulta.
    ```sql
    -- mal
    SELECT name, age FROM users WHERE age > 18 ORDER BY name;

    -- bien
    SELECT name, age
    FROM users
    WHERE age > 18
    ORDER BY name;
    ```


### Nombres e identificadores
- Para las tablas y columnas usar `snake_case`.
    ```sql
    -- mal
    SELECT Name, Age FROM Users;

    -- bien
    SELECT name, age
    FROM users;
    ```

- Evitar abreviaturas en medida de lo posible.
    ```sql
    -- mal
    SELECT fn, ln FROM usr;

    -- bien
    SELECT first_name, last_name
    FROM users;
    ```


### Joins
- Usar `INNER JOIN` de forma explícita.
    ```sql
    -- mal
    SELECT u.name, o.total FROM users u, orders o WHERE u.id = o.user_id;

    -- bien
    SELECT u.name, o.total
    FROM users u
    INNER JOIN orders o
        ON u.id = o.user_id;
    ```

- Agrupar condiciones con paréntesis y saltos de línea
    ```sql
    -- mal
    SELECT * FROM users WHERE age > 18 AND active = 1 OR role = 'admin';

    -- bien
    SELECT *
    FROM users
    WHERE (
            age > 18
            AND active = 1
        )
        OR role = 'admin';
    ```

# Seguridad en consultas SQL (Node.js + MariaDB)

> [!IMPORTANT]
> Este apartado define las **buenas prácticas para evitar inyección SQL** al desarrollar con Node.js y MariaDB.  
> Toda consulta que involucre datos del usuario debe construirse mediante **parámetros o prepared statements**.

## Principios generales
- **Nunca** concatenar valores del usuario dentro del texto SQL.  
- **Siempre** usar consultas parametrizadas (placeholders `?`).  
- **Nunca** permitir que el usuario controle nombres de tablas, columnas u ordenamiento directamente.  
- **Validar y sanear** toda entrada de datos antes de enviarla a la base de datos.  
- **No** retornar al cliente mensajes de error del motor de base de datos.  
- Usar un **usuario de base de datos con privilegios mínimos**.

## Ejemplo correcto
```js
import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: "localhost",
    user: "app_user",
    password: process.env.DB_PASS,
    database: "app_db",
});

async function getUserByEmail(email) {
    const conn = await pool.getConnection();
    try {
        // Consulta parametriza (placeholder ?)
        const rows = await conn.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        return rows;
    } finally {
        conn.release();
    }
}
```

## Ejemplo incorrecto
```js
// Vulnerable
const email = req.query.email;
const query = `SELECT * FROM users WHERE email = '${email}'`; 

// Concatenación directa
const rows = await conn.query(query);
```
> Si el usuario envía `' OR 1=1 --`, la consulta devolverá todos los registros.  
> **Nunca** concatenar datos del usuario en el texto SQL.

## Múltiples parámetros
```js
const rows = await conn.query(
    "SELECT * FROM users WHERE age > ? AND city = ?",
    [18, city]
);
```

## Manejo de identificadores dinámicos (orden o columnas)
- Los **identificadores no pueden parametrizarse**.  
- Si necesitas permitir ordenamiento o selección de columna dinámica, usa una **lista blanca (whitelist)**.

```js
const allowedColumns = {
    name: "name",
    createdAt: "created_at",
};

const allowedDirections = {
    asc: "ASC",
    desc: "DESC",
};

const sort = allowedColumns[req.query.sort] || "name";
const dir = allowedDirections[req.query.dir] || "ASC";

const query = `SELECT * FROM users ORDER BY ${sort} ${dir}`;
const rows = await conn.query(query);
```

## Validación de entrada
Antes de ejecutar cualquier consulta, valida la entrada con una librería como `Joi`.

```js
import Joi from "joi";

const schema = Joi.object({
    email: Joi.string().email().required(),
});

const { error, value } = schema.validate(req.query);
if (error) return res.status(400).json({
    message: "Invalid input"
});
```

## Manejo de errores
```js
try {
    const rows = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
    res.json(rows);
} catch (err) {
    // Log interno
    console.error("[DB ERROR]", err);

    // Mensaje genérico
    res.status(500).json({ message: "Database error" });
}
```

## Liberación de conexiones
```js
const conn = await pool.getConnection();
try {
    // Ejecutar consultas
} finally {
    // Siempre liberar la conexión
    conn.release();
}
```

## Checklist de seguridad SQL

- [ ] Todas las consultas usan placeholders (`?`) y parámetros.
- [ ] No se concatena texto del usuario en el SQL.
- [ ] Identificadores dinámicos usan whitelist.
- [ ] Entradas validadas antes de ejecutarse.
- [ ] Conexiones siempre se liberan.
- [ ] Errores del motor no se exponen al cliente.
- [ ] Usuario de DB con permisos mínimos.
- [ ] Pruebas realizadas con payloads de inyección.


## Payloads de prueba comunes

Usar estos valores en entornos de desarrollo para verificar que las consultas no son vulnerables:

```
' OR 1=1 --
"; DROP TABLE users; --
admin' #
```

## Conclusión

La única forma segura de realizar consultas SQL en Node.js con MariaDB es usando:
1. **Prepared statements / parámetros**,  
2. **Validación estricta de datos**, y  
3. **Manejo responsable de errores y permisos**.

Cualquier concatenación de strings o query construida manualmente se considera una **vulnerabilidad crítica**.