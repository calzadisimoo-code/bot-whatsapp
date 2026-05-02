const estadoUsuarios = {}
const seguimiento = {}
const clientesActivos = {}

const ABTest = {
    A: { enviados: 0, respuestas: 0 },
    B: { enviados: 0, respuestas: 0 }
}
//


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


// 📦 IMPORTS Y CONFIG
import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

import fs from 'fs'

const PORT = process.env.PORT ?? 3008

const INVENTARIO_FILE = './inventario.txt'
const VENTAS_FILE = './ventas.json'
const GASTOS_FILE = './gastos.json'
const NOMINA_FILE = './nomina.json'

// 🔐 ADMIN const ADMIN = '573145823872'

// 📦 PRODUCTOS
const productosDB = {
    af1_doble_a: {
        nombre: 'AIR FORCE 1 DOBLE A',
        precio: '$50.000',
        antes: '$80.000',
        //imagen: './src/img/af1.jpg',
        tieneTalla: true
    },

    chanclas_ozuna: {
        nombre: 'CHANCLAS OZUNA PREMIUM',
        precio: '$69.900',
        antes: '$100.000',
        //imagen: './src/img/PhotoCollage_1776480765316.jpg',
        tieneTalla: true
    }
}

 // 🔚 FIN productos



// =====================================================
// 🤖 FLOWS
// =====================================================
const flow = addKeyword(['hola','buenas','info','precio','menu','menú'])
.addAnswer(null, null, async (ctx, { flowDynamic }) => {

    const nombre = ctx.pushName || 'parcero'

    await delay()

    await flowDynamic(`🔥 Hola ${nombre}

👉 Escríbeme el producto que quieres ver:`)
})

const flowUbicacion = addKeyword([
    'donde','ubicacion','en que parte de palmira esta?','estan en palmira','eres','ubicado','ubicación','direccion','dirección','ubicados','encuentra','encuentran','local'
])
.addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        
		await delay()
        await flowDynamic(`${nombre} 📍 Estamos en Palmira - Calle 29 #26-34 cc villa de las palmas, Local 291 (Diagonal al banco de Bogota)

👉 Te lo dejo separado de una

¿a qué hora vienes hoy?`)
    }
)
//
const flowHorario = addKeyword([
    'atiende','horario','abierto',
    'domingo','lunes','martes','miercoles','miércoles','jueves','viernes','sabado','sábado',
    'hasta que hora','hasta qué hora','abren','cierran'
])

.addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        const hora = new Date().getHours()

        if (hora >= 9 && hora < 19) {
            
			await delay()
            await flowDynamic(`${nombre}, estamos atendiendo HOY 🔥

📅 Lunes a sabados: 9:00am - 7:00pm  
📅 Domingo: 9:00am - 2:00pm  

📍 Palmira - Calle 29 #27-34  
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

📍 Palmira - Calle 29 #27-34  
CC Villa de las Palmas, Local 291 (Diagonal al banco de Bogota)

🚀 Si quieres, te dejo el pedido listo desde ya  
⚠️ Así aseguras disponibilidad y precio de hoy  

👉 Apenas abramos te lo entrego o despacho primero  

¿te lo separo de una?`)
        }
    }
)
//
const flowNequi = addKeyword([
    'nequi','numero','pago nequi'
])
.addAnswer(
    null,
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
//
const flowCatalogo = addKeyword(['catalogo','catálogo','modelo','modelos'])
.addAnswer(
    null,
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
//
const flowProducto = addKeyword([
    'af1','chanclas','sandalias','air force'
])

// 🔥 MENSAJE INICIAL
.addAnswer(null, null, async (ctx, { flowDynamic }) => {

    const msg = ctx.body.toLowerCase()
    const user = ctx.from

    let producto = null

    if (msg.includes('af1') || msg.includes('air force')) {
        producto = 'af1_doble_a'
    }

    if (msg.includes('chancla') || msg.includes('sandalia')) {
        producto = 'chanclas_ozuna'
    }

    // ❌ si no detecta producto no responde
    if (!producto) return

    const data = productosDB[producto]

    // 🔥 guardar producto
    estadoUsuarios[user] = { producto }

    await delay()

    await flowDynamic([
        {
            body: `🔥 50% OFF HOY 🔥

${data.nombre}

💰 PRECIO HOY: ${data.precio}  
❌ Antes: ${data.antes}

⭐ Producto en promoción hoy`}
    ])

    await delay()

    if (data.tieneTalla) {
        await flowDynamic(`👉 Escríbeme tu talla (38, 40, 42)`)
    } else {
        await flowDynamic(`👉 ¿Para qué ciudad sería el envío?`)
    }
})


// 🔥 CAPTURA UNIVERSAL
.addAnswer(null, { capture: true }, async (ctx, { flowDynamic }) => {

    const msg = ctx.body.toLowerCase()
    const user = ctx.from

    const producto = estadoUsuarios[user]?.producto
    if (!producto) return

    const data = productosDB[producto]

    const numero = msg.match(/\d{2}/)

    // 🔥 SI TIENE TALLA
    if (data.tieneTalla) {

        if (!numero) {
            return flowDynamic(`👉 Escríbeme tu talla (ej: 40)`)
        }

        estadoUsuarios[user].talla = numero[0]

        await delay()

        return flowDynamic(`🔥 Perfecto, talla ${numero[0]} disponible

💰 ${data.precio}

👉 Para enviártelo necesito:
Nombre - Ciudad - Dirección - Barrio - Teléfono`)
    }

    // 🔥 SI NO TIENE TALLA
    if (!data.tieneTalla) {

        await delay()

        return flowDynamic(`🔥 Perfecto

👉 Envíame:
Nombre - Ciudad - Dirección - Barrio - Teléfono`)
    }
})

// 🚀 INIT
createBot({
    flow: createFlow([
	     flow,
         flowProducto,
         flowCatalogo,
         flowNequi,
         flowUbicacion,
         flowHorario
    ]),
    provider: createProvider(Provider, { version: [2, 3000, 1035824857] }),
    database: new Database(),
}).then(({ httpServer }) => httpServer(PORT))

// 🔚 FIN BOT