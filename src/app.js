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
        imagen: './src/img/af1.jpg',
        keywords: ['af1','air force','air force 1']
    },

    chanclas_ozuna: {
        nombre: 'CHANCLAS OZUNA PREMIUM',
        precio: '$70.000',
        imagen: './src/img/ozuna.jpg',
        keywords: ['ozuna','chanclas','sandalias']
    }
}

 // 🔚 FIN productos
// =====================================================
// 🤖 FLOWS
// ====================================================
//
/// 🔥 KEYWORDS
const flowAf111 = addKeyword([
    'Hola quiero las AF1 blancas 1.1','air force 1.1'
])

// 🔥 1. MENSAJE INICIAL (TEXTO + IMAGEN JUNTOS)
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `Hola $110.000 ¿En qué talla?`,
                media: './src/img/af111.jpg'
            }
        ])
    }
)


// 🔥 2. CAPTURA TALLA
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const numero = msg.match(/\d{2}/)

        if (numero) {
            await flowDynamic(`Vale, envíame porfa la dirección para hacerte el envio`)
            return
        }

        // ❌ sin respuesta si no manda talla
    }
)

/// 🔥 KEYWORDS
const flowAF1 = addKeyword([
    'air force','af1','quiero las air force 1 blanca','air force one'
])

// 🔥 1. MENSAJE INICIAL (TEXTO + IMAGEN JUNTOS)
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `Hola $50.000 ¿En qué talla?`,
                media: './src/img/af1.jpeg'
            }
        ])
    }
)


// 🔥 2. CAPTURA TALLA
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const numero = msg.match(/\d{2}/)

        if (numero) {
            await flowDynamic(`Vale, envíame porfa la dirección para hacerte el envio`)
            return
        }

        // ❌ sin respuesta si no manda talla
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
    null,
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
            mensaje = `¡Hola! 👋 Este producto está disponible con entrega inmediata 🚚

🔥 Hoy lo tenemos en promoción

👉 ¿Para qué ciudad sería el envío?`
        } else {
            mensaje = `Hola, en que ciudad te encuentras?`
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


//
/// 🔥 KEYWORDS
const flowOzuna = addKeyword([
    'chanclas','chancla','Quiero chanclas ozuna para envio','ozuna','chanclas ozuna','ozuna 1.1','sandalias ozuna'
])

// 🔥 1. MENSAJE INICIAL (TEXTO + IMAGEN JUNTOS)
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                body: `Hola $69.900 ¿En qué talla?`,
                media: './src/img/ozuna.jpg'
            }
        ])
    }
)


// 🔥 2. CAPTURA TALLA
.addAnswer(
    null,
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const numero = msg.match(/\d{2}/)

        if (numero) {
            await flowDynamic(`Vale, envíame porfa la dirección para hacerte el envio`)
            return
        }

        // ❌ sin respuesta si no manda talla
    }
)
/// 🔥 KEYWORDS
const flowPantalonetas = addKeyword([
    'pantaloneta','pantalonetas','short','shorts','bermuda','bermudas'
])

// 🔥 1. MENSAJE INICIAL
.addAnswer(
    `🔥 PANTALONETAS PREMIUM`,
    null,
    async (ctx, { flowDynamic }) => {

        await flowDynamic([
            {
                media: './src/img/pantaloneta1.jpeg'
            },
            {
                media: './src/img/af1.jpeg'
            },
            {
                media: './src/img/af111.jpeg'
            }
        ])
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

// =====================================================
// 🚀 INIT
// =====================================================

createBot({
    flow: createFlow([
	flow,      
        flowPantalonetas,	// saludo
	    flowAf111,      // af1 1.1
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