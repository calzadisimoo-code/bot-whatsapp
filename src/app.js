const estadoUsuarios = {}
const seguimiento = {}
const clientesActivos = {}

const ABTest = {
    A: { enviados: 0, respuestas: 0 },
    B: { enviados: 0, respuestas: 0 }
}
//

const usuariosAB = {}
//
const mostrarAB = () => {
    const totalA = ABTest.A.enviados || 1
    const totalB = ABTest.B.enviados || 1

    const ratioA = (ABTest.A.respuestas / totalA * 100).toFixed(1)
    const ratioB = (ABTest.B.respuestas / totalB * 100).toFixed(1)

    console.log(`
📊 TEST A/B

A → enviados: ${ABTest.A.enviados} | respuestas: ${ABTest.A.respuestas} | ${ratioA}%
B → enviados: ${ABTest.B.enviados} | respuestas: ${ABTest.B.respuestas} | ${ratioB}%

🏆 GANADOR: ${ratioA > ratioB ? 'A' : 'B'}
`)
}
//
const delay = async () => {
    const tiempo = Math.floor(Math.random() * 1000) + 1000
    return new Promise(resolve => setTimeout(resolve, tiempo))
}

// =====================================================
// 🧠 UTILIDADES (FECHA Y HORA)
// =====================================================

const getFechaLocal = () => {
    const now = new Date()
    return now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0')
} // 🔚 FIN getFechaLocal


const getHoraLocal = () => {
    const now = new Date()
    return String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0')
} // 🔚 FIN getHoraLocal

// =====================================================
// 📦 IMPORTS Y CONFIG
// =====================================================

import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

import fs from 'fs'

const PORT = process.env.PORT ?? 3008

// 📦 PRODUCTOS (NO TOCAR)
// =====================================================
const productosDB = {
    af1_doble_a: {
        nombre: 'AIR FORCE 1 DOBLE A',
        precio: '$50.000',
       // imagen: './src/img/af1.jpeg',
        keywords: ['af1','air force','air force 1']
    },

    chanclas_ozuna: {
        nombre: 'CHANCLAS OZUNA PREMIUM',
        precio: '$70.000',
        //imagen: './src/img/ozuna.jpeg',
        keywords: ['ozuna','chanclas','sandalias']
    }
}

 // 🔚 FIN productos
// =====================================================
// 🤖 FLOWS
// ====================================================
//// 🔥 KEYWORDS
const flowAf111 = addKeyword([
    'af1 1.1',
    'air force 1.1',
    'quiero las af1 blancas 1.1',
    '1.1',
    'af1 blancas 1.1'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `🔥 AIR FORCE 1.1 PREMIUM

💰 $100.000

👉 ¿Qué talla necesitas?`,
                media: './src/img/af111.jpeg'
            }
        ])
    }
)


// 🔥 2. CAPTURA TALLA + CIERRE
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const numero = msg.match(/\d{2}/)

        // 🔥 SOLO RESPONDE SI HAY TALLA
        if (!numero) return

        const talla = numero[0]
        const precio = 100000

        await delay()

        await flowDynamic(`✅ Pedido confirmado

📦 Air Force 1.1 talla ${talla}

💸 Precio: $${precio.toLocaleString('es-CO')}  
🚚 Envío
Palmira: $4.000 a $7.000  
Valle: $15.000  

💰 Total aprox:
👉 Palmira: $${(precio + 5000).toLocaleString('es-CO')}  
👉 Valle: $${(precio + 15000).toLocaleString('es-CO')}

🚀 Para enviártelas hoy mismo necesito:

Nombre:
Dirección:
Teléfono:

⚠️ Tengo varias solicitudes en esa talla, apenas me envíes los datos te las despacho de una`)
    }
)

// 🔥 KEYWORDS
const flowAF1 = addKeyword([
    'af1','quiero las air force 1 blanca','air force barata','air force 1'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `🔥 AIR FORCE 1 DOBLE A

💰 $50.000

👉 ¿Qué talla necesitas?`,
                media: './src/img/af1.jpeg'
            }
        ])
    }
)


// 🔥 2. CAPTURA TALLA + CIERRE
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const numero = msg.match(/\d{2}/)

        // 🔥 SOLO RESPONDE SI HAY TALLA
        if (!numero) return

        const talla = numero[0]
        const precio = 50000

        await delay()

        await flowDynamic(`✅ Pedido confirmado

📦 Air Force 1 talla ${talla}

💸 Precio: $${precio.toLocaleString('es-CO')}  
🚚 Envío:
Palmira: $4.000 a $7.000  
Valle: $15.000  

💰 Total aprox:
👉 Palmira: $${(precio + 5000).toLocaleString('es-CO')}  
👉 Valle: $${(precio + 15000).toLocaleString('es-CO')}

🚀 Para enviártelas hoy mismo necesito:

Nombre:
Dirección:
Teléfono:

⚠️ Tengo varias solicitudes en esa talla, apenas me envíes los datos te las despacho de una`)
    }
)


const flowCatalogo = addKeyword(['catalogo','catálogo','modelo','modelos'])
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        
		await delay()
        await flowDynamic(`📲 Aquí puedes ver el catálogo completo:

👉 https://wa.me/c/573217204017

🔥 Producto más vendido:
Nike Air Force 1 Blanca

¿Te interesa Nike Air Force 1 Blanca?`)
    }
)



const flowNequi = addKeyword([
    'nequi','numero','pago nequi'
])
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        
		await delay()
        await flowDynamic(`💰 Perfecto ${nombre}

Puedes hacer el pago por Nequi:
📱 3217204017  
👤 Juan Galarraga

👉 Envíame el comprobante y te despacho de una 🚀`)
    }
)


const flowUbicacion = addKeyword([
    'donde','ubicacion','en donde estas ubicado','en que parte de palmira esta?','estan en palmira','eres','ubicado','ubicación','direccion','dirección','ubicados','encuentra','encuentran','local'
])
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        
		await delay()
        await flowDynamic(`${nombre} 📍 Estamos en Palmira - Calle 29 #26-34 cc villa de las palmas, Local 291 (Diagonal al banco de Bogota)

👉 Te lo dejo separado de una

¿a qué hora vienes?`)
    }
)



const flow = addKeyword(['hola','buenas','info','buenas tardes','buenos dias'])

.addAnswer(
    `Hola`,
    null,
    async (ctx, { flowDynamic }) => {

        const user = ctx.from

        // 🔥 calcular rendimiento
        let opcion

const total = ABTest.A.enviados + ABTest.B.enviados

// 🔥 PRIMEROS MENSAJES → 50/50 REAL
if (total < 20) {
    opcion = Math.random() < 0.5 ? 'A' : 'B'
} else {
    const ratioA = ABTest.A.respuestas / (ABTest.A.enviados || 1)
    const ratioB = ABTest.B.respuestas / (ABTest.B.enviados || 1)

    if (ratioA > ratioB) {
        opcion = Math.random() < 0.8 ? 'A' : 'B'
    } else {
        opcion = Math.random() < 0.8 ? 'B' : 'A'
    }
}

        // 🔥 guardar usuario
        usuariosAB[user] = opcion
        ABTest[opcion].enviados++

        let mensaje = ''

        if (opcion === 'A') {
            mensaje = `En que producto estas interesado 👇`
        } else {
            mensaje = `En que ciudad te encuentras?`
        }
        
		await delay()
        await flowDynamic(mensaje)
    }
)


// 🔥 AQUÍ DETECTA SI RESPONDE
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const user = ctx.from

        if (usuariosAB[user]) {
    const opcion = usuariosAB[user]
    ABTest[opcion].respuestas++
    delete usuariosAB[user]

    mostrarAB()
}

        // aquí sigue tu flujo normal
    }
)


const flowHorario = addKeyword([
    'atiende','horario','abierto',
    'domingo','lunes','martes','miercoles','miércoles','jueves','viernes','sabado','sábado',
    'hasta que hora','hasta qué hora','abren','cierran'
])

.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        const hora = new Date().getHours()

        if (hora >= 9 && hora < 19) {
            
			await delay()
            await flowDynamic(`${nombre}, estamos atendiendo HOY 🔥

📅 Lunes a sabados: 9:00am - 7:00pm  
📅 Domingo: 9:00am - 2:00pm  

📍 Palmira - Calle 29 #26-34  
CC Villa de las Palmas, Local 291 (Diagonal al banco de Bogota)

🚀 Puedes venir ahora mismo y te atiendo de una  
⚠️ Lo que más está saliendo hoy se está agotando rápido  

👉 Te lo dejo separado para que no pierdas el viaje  

¿vienes ahora o prefieres que te lo envíe hoy mismo?`)
        
        } else {
            
			await delay()
            await flowDynamic(`${nombre}, el horario es:

📅 Lunes a sabados: 9:00am - 7:00pm  
📅 Domingo: 9:00am - 2:00pm  

📍 Palmira - Calle 29 #26-34  
CC Villa de las Palmas, Local 291 (Diagonal al banco de Bogota)

🚀 Si quieres, te dejo el pedido listo desde ya  
⚠️ Así aseguras disponibilidad y precio de hoy  

👉 Apenas abramos te lo entrego o despacho primero  

¿te lo separo de una?`)
        }
    }
)
// 🔥 KEYWORDS
const flowOzuna = addKeyword([
    'chanclas','chancla','quiero chanclas ozuna','ozuna','chanclas ozuna','ozuna 1.1','sandalias ozuna'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `🔥 CHANCLAS OZUNA PREMIUM 1.1

💰 $70.000

👉 ¿Qué talla necesitas?`,
                media: './src/img/ozuna.jpg'
            }
        ])
    }
)


// 🔥 2. CAPTURA TALLA + CIERRE
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const numero = msg.match(/\d{2}/)

        // 🔥 SOLO RESPONDE SI HAY TALLA
        if (!numero) return

        const talla = numero[0]
        const precio = 70000

        await delay()

        await flowDynamic(`✅ Pedido confirmado

📦 Chanclas Ozuna talla ${talla}

💸 Precio: $70.000  
🚚 Envío
Palmira: $4.000 a $7.000  
Valle: $15.000  

💰 Total aprox:
👉 Palmira: $${(precio + 5000).toLocaleString('es-CO')}  
👉 Valle: $${(precio + 15000).toLocaleString('es-CO')}

🚀 Para enviártelas hoy mismo necesito:

Nombre:
Dirección:
Teléfono:

⚠️ Tengo varias solicitudes en esa talla, apenas me envíes los datos te las despacho de una`)
    }
)

/// 🔥 KEYWORDS
const flowPantalonetas = addKeyword([
    'pantaloneta','pantalonetas','short','shorts','bermuda','bermudas'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `🔥 PANTALONETAS`,
    null,
    async (ctx, { flowDynamic }) => {

        // 🔥 primero envía las imágenes
        await flowDynamic([
            {
                media: './src/img/pantaloneta1.jpeg'
            },
            {
                media: './src/img/pantaloneta2.jpeg'
            },
            {
                media: './src/img/pantaloneta3.jpeg'
            },
            {
                media: './src/img/pantaloneta4.jpeg'
            },
            {
                media: './src/img/pantaloneta5.jpeg'
            },
            {
                media: './src/img/pantaloneta6.jpeg'
            }
        ])

        // 🔥 luego envía el mensaje final
        await flowDynamic(`👉 Dime tu talla (S, M, L o XL)`)
    }
)


// 🔥 2. CAPTURA TALLA
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()

        const tallas = ['s','m','l','xl']
        const encontroTalla = tallas.some(t => msg.includes(t))

        if (encontroTalla) {
            await flowDynamic(`Perfecto 👌

📦 Envíame tu dirección completa para despacharte hoy mismo 🚚`)
            return
        }

        await flowDynamic(`👉 Dime cual te gusto?`)
    }
)

/// 🔥 KEYWORDS
const flowMaletines = addKeyword([
    'maletines','maletin','vendes maletines','tienes maletines','un maletin','bolsos'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `🔥 MALETINES`,
    null,
    async (ctx, { flowDynamic }) => {

        // 🔥 primero envía las imágenes
        await flowDynamic([
            {
                media: './src/img/maletin1.jpeg'
            },
            {
                media: './src/img/maletin2.jpeg'
            },
            {
                media: './src/img/maletin3.jpeg'
            },
            {
                media: './src/img/maletin4.jpeg'
            },
            {
                media: './src/img/maletin5.jpeg'
            },
            {
                media: './src/img/maletin6.jpeg'
            },
            {
                media: './src/img/maletin7.jpeg'
            }
        ])

        // 🔥 luego envía el mensaje final
        await flowDynamic(`👉 Dime cual te gusto?`)
    }
)


// 🔥 2. CAPTURA TALLA
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()

        const tallas = ['s','m','l','xl']
        const encontroTalla = tallas.some(t => msg.includes(t))

        if (encontroTalla) {
            await flowDynamic(`Perfecto 👌

📦 Envíame tu dirección completa para despacharte hoy mismo 🚚`)
            return
        }

        await flowDynamic(`¿Qué talla necesitas?

👉 S, M, L o XL`)
    }
)

const flowguayos = addKeyword([
    'guayo','vendes guayos','guayos','tienes guayos','necesito unos guayos','guayos para sintetica'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `🔥 GUAYOS`,
    null,
    async (ctx, { flowDynamic }) => {

        // 🔥 primero envía las imágenes
        await flowDynamic([
            {
                media: './src/img/guayo1.jpeg'
            },
            {
                media: './src/img/guayo2.jpeg'
            },
            {
                media: './src/img/guayo3.jpeg'
            },
            {
                media: './src/img/guayo4.jpeg'
            },
            {
                media: './src/img/guayo5.jpeg'
            },
            {
                media: './src/img/guayo6.jpeg'
            },
            {
                media: './src/img/guayo7.jpeg'
            },
            {
                media: './src/img/guayo8.jpeg'
            }
        ])

        // 🔥 luego envía el mensaje final
        await flowDynamic(`👉 Dime cual te gusto?`)
    }
)

/// 🔥 KEYWORDS
const flowZapatillas = addKeyword([
    'zapatillas','Solo manejan esas','modelos','Solo tiene ese modelo','que otros modelos tienes','asi en este modelo','hola tiene zapatillas nike','zapatillas para hombre','que estilos de zapatillas tiene',
	'me gustaria ver lso estilos de zapatillas que tengan','tiene estas zapatillas'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `🔥 ZAPATILLAS`,
    null,
    async (ctx, { flowDynamic }) => {

        // 🔥 primero envía las imágenes
        await flowDynamic([
            {
                media: './src/img/af1.jpeg'
            },
            {
                media: './src/img/af111.jpeg'
            },
            {
                media: './src/img/zapatilla1.jpeg'
            },
            {
                media: './src/img/zapatilla2.jpeg'
            },
            {
                media: './src/img/zapatilla3.jpeg'
            },
            {
                media: './src/img/zapatilla4.jpeg'
            },
            {
                media: './src/img/zapatilla5.jpeg'
            },
            {
                media: './src/img/zapatilla6.jpeg'
            },
            {
                media: './src/img/zapatilla7.jpeg'
            },
            {
                media: './src/img/zapatilla8.jpeg'
            },
            {
                media: './src/img/zapatilla9.jpeg'
            },
            {
                media: './src/img/zapatilla10.jpeg'
            },
            {
                media: './src/img/zapatilla11.jpeg'
            },
            {
                media: './src/img/zapatilla12.jpeg'
            },
            {
                media: './src/img/zapatilla13.jpeg'
            },
            {
                media: './src/img/zapatilla14.jpeg'
            },
            {
                media: './src/img/zapatilla15.jpeg'
            },
            {
                media: './src/img/zapatilla16.jpeg'
            },
            {
                media: './src/img/zapatilla17.jpeg'
            },
            {
                media: './src/img/zapatilla18.jpeg'
            },
            {
                media: './src/img/zapatilla19.jpeg'
            },
            {
                media: './src/img/zapatilla20.jpeg'
            },
            {
                media: './src/img/zapatilla21.jpeg'
            },
            {
                media: './src/img/zapatilla22.jpeg'
            },
            {
                media: './src/img/zapatilla23.jpeg'
            },
            {
                media: './src/img/zapatilla24.jpeg'
            },
            {
                media: './src/img/zapatilla25.jpeg'
            },
            {
                media: './src/img/zapatilla26.jpeg'
            },
            {
                media: './src/img/zapatilla27.jpeg'
            },
            {
                media: './src/img/zapatilla28.jpeg'
            },
            {
                media: './src/img/zapatilla29.jpeg'
            },
            {
                media: './src/img/zapatilla30.jpeg'
            },
            {
                media: './src/img/zapatilla31.jpeg'
            },
            {
                media: './src/img/zapatilla32.jpeg'
            },
            {
                media: './src/img/zapatilla33.jpeg'
            },
            {
                media: './src/img/zapatilla34.jpeg'
            },
            {
                media: './src/img/zapatilla35.jpeg'
            },
            {
                media: './src/img/zapatilla36.jpeg'
            },
            {
                media: './src/img/zapatilla37.jpeg'
            },
            {
                media: './src/img/zapatilla38.jpeg'
            },
            {
                media: './src/img/zapatilla39.jpeg'
            }
        ])

        // 🔥 luego envía el mensaje final
        await flowDynamic(`👉 Dime cual te gusto y la talla?`)
    }
)


// 🔥 KEYWORDS
const flowPro2 = addKeyword([
    'airpods','air pods pro 2','Quiero AirPods Pro 2','airpods pro','audifonos airpods','airpods 1.1','pro 2'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `🔥 AirPods Pro 2`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `🔥 AirPods Pro 2 - 1.1 - Sonido Súper Nítido 🎧  
				
✅ Con cancelación de ruido

💰 $60.000

👉 ¿Para qué ciudad sería el envío? 🚚`,
                media: './src/video/airpodspro2.mp4'
            }
        ])
    }
)


// 🔥 2. CAPTURA CIUDAD + CIERRE
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const ciudad = ctx.body.toLowerCase().trim()

        // ❌ SI NO ESCRIBE NADA
        if (!ciudad) return

        const precio = 60000

        await delay()

        await flowDynamic(`✅ Pedido confirmado

📦 AirPods Pro 2 1.1 con cancelación de ruido

📍 Envío para: ${ciudad}

💸 Precio: $60.000  

🚚 Envío
Palmira: $4.000 a $7.000  
Valle: $15.000  

💰 Total aprox:
👉 Palmira: $${(precio + 5000).toLocaleString('es-CO')}
👉 Valle: $${(precio + 15000).toLocaleString('es-CO')}

🚀 Para enviártelos hoy mismo necesito:

Nombre:
Dirección:
Teléfono:

⚠️ Tengo varias solicitudes hoy, apenas me envíes los datos te los despacho de una`)
    }
)

// =====================================================
// 🚀 INIT
// =====================================================

createBot({
    flow: createFlow([
	flow,      
        flowPantalonetas,
        flowMaletines,
		flowguayos,
		flowAf111, 
		flowPro2, 
		flowZapatillas,     // af1 1.1
        flowAF1,        // AF1
        flowOzuna,      // chanclas      // fotos
        flowCatalogo,
        flowUbicacion,
        flowHorario,
        flowNequi
    ]),
    provider: createProvider(Provider, { version: [2, 3000, 1035824857] }),
    database: new Database(),
}).then(({ httpServer }) => httpServer(PORT))

// 🔚 FIN BOT