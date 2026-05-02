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

// =====================================================
// 📦 IMPORTS Y CONFIG
// =====================================================

import { createBot, createProvider, createFlow, addKeyword } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

import fs from 'fs'

const PORT = process.env.PORT ?? 3008

// =====================================================
// 🤖 FLOWS
// =====================================================
const flowRecoger = addKeyword([
    'voy','paso','recoger','recogo','retiro','voy a pasar'
])
.addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        
		await delay()
        await flowDynamic(`🔥 Perfecto ${nombre}

📍 Estamos en Palmira - Cra27 #29-34 cc villa de las palmas, Local 291

👉 Te lo dejo separado de una

¿a qué hora vienes hoy?`)
    }
)


const flowEnvio = addKeyword([
    'envio','enviar','enví','mandalo','mandamelo','mandar',
    'domicilio','a domicilio','me lo envias','me lo envía',
    'si envio','para envio','con envio','envio porfa',
    'envialo','enviamelo','enviame','lo quiero con envio'
])
.addAnswer(
    null, // 👈 SIEMPRE algo aquí
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'

        await delay()
        await flowDynamic(`Perfecto ${nombre}, te lo envío hoy mismo

👉 Solo necesito:
Ciudad - Dirección - Barrio - Nombre

💰 El producto lo pagas por adelantado
📦 El envío lo pagas cuando lo recibes

Puedes pagar por Nequi:
📱 3217204017  
👤 Juan Galarraga  

👉 Me envías el comprobante y te despacho de una 🚀

🔥 ¿me pasas los datos para enviártelo hoy?`)
    }
)


const flowCargador = addKeyword([
    'cargador','67w'
])

// 🔥 MENSAJE PRINCIPAL
.addAnswer(
    null,
    null,
    async (ctx, ctxFn) => {

        const nombre = ctx.pushName || 'parcero'

        await ctxFn.flowDynamic([
            {
                body: `⚡ ${nombre}, este cargador carga súper rápido, es de los que más salen

💰 Precio: $45.000

¿qué celular tienes?`,
                media: './src/img/WhatsApp Image 2026-04-13 at 5.16.32 AM.jpeg'
            }
        ])
    }
)

// 🔥 CAPTURA RESPUESTA
.addAnswer(
    null,
    { capture: true },
    async (ctx, ctxFn) => {
        return manejarRespuesta(ctx, ctxFn)
    }
)



// 🔥 CONTROL
const seguimientoAF1AA = {}
const timersAF1AA = {}

const flowAF1 = addKeyword([
    'af1','air force','af1 50 mil','af1 baratas','af1 economicas','air force economicas'
])

// 🔥 1. PRIMER MENSAJE (SIEMPRE SE ENVÍA)
.addAnswer(
    `🔥 50% OFF HOY 🔥

👟 AIR FORCE 1 DOBLE A

⭐ Más vendidas esta semana  
⭐ Excelente calidad por el precio  

✅ Cocidas (no se despegan fácil)  
✅ Súper cómodas todo el día  
✅ Resistentes y duraderas`,
    null,
    async (ctx, { flowDynamic }) => {

        const user = ctx.from

        estadoUsuarios[user] = {
            producto: 'af1_doble_a'
        }

        await delay()

        await flowDynamic([
            {
                body: `
💰 PRECIO HOY: $50.000  
❌ Antes: $80.000  

🚚 Envío RAPIDO en Palmira  
📦 Valle: $15.000  
💸 Pagas al recibir  

⏳ Entrega rápida 1-3 días`,

                media: './src/img/WhatsApp Image 2026-04-05 at 2.50.01 PM.jpeg'
            }
        ])
    }
)

// 🔥 2. CAPTURA (SOLO DESPUÉS DEL PRIMER MENSAJE)
.addAnswer(
    `⚠️ STOCK LIMITADO

🔥 Últimas unidades disponibles

👉 Pide las tuyas ahora

Escríbeme tu talla (38, 40, 42)`,
    { capture: true },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const user = ctx.from

        // limpiar
        if (seguimientoAF1AA[user]) delete seguimientoAF1AA[user]

        if (timersAF1AA[user]) {
            timersAF1AA[user].forEach(t => clearTimeout(t))
            delete timersAF1AA[user]
        }

        const numero = msg.match(/\d{2}/)

        // 🔥 SI ENVÍA TALLA
        if (numero) {

            estadoUsuarios[user] = {
                producto: 'af1_doble_a',
                talla: numero[0]
            }

            await delay()
            await flowDynamic(`🔥 Perfecto, talla ${numero[0]} disponible

💰 $50.000  
🚚 Envío RAPIDO en Palmira  
📦 Valle: $15.000  

💸 Pagas al recibir  

👉 Para enviártelas necesito:
Nombre - Ciudad - Dirección - Barrio - Teléfono  

🚀 Te despacho hoy mismo`)

            seguimientoAF1AA[user] = 'direccion'
            timersAF1AA[user] = []

            timersAF1AA[user].push(setTimeout(async () => {
                if (seguimientoAF1AA[user] !== 'direccion') return
                await flowDynamic(`👀 Solo me faltan tus datos para enviarlas`)
            }, 180000))

            timersAF1AA[user].push(setTimeout(async () => {
                if (seguimientoAF1AA[user] !== 'direccion') return
                await flowDynamic(`⚠️ Últimos cupos de envío hoy

👉 Envíame tus datos ahora`)
                delete seguimientoAF1AA[user]
            }, 600000))

            return
        }

        // 🔥 SI NO ENVÍA TALLA
        return flowDynamic(`👀 Para pedirlas rápido

👉 Escríbeme tu talla (ej: 40, 42)`)
    }
)


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
    { capture: true },
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


const flowContraentrega = addKeyword([
    'contraentrega',
    'contra entrega',
    'pago contra entrega'
])

.addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

        await delay()
        await flowDynamic(`Te explico 👇

💰 Pagas SOLO el producto por adelantado  
📦 El envío lo pagas cuando lo recibes  

Tarifas:
📍 Palmira: $6.000  
📍 Valle: $13.000
📍 Fuera del Valle: $23.000  

🔐 Somos tienda física:
📍 Palmira - Cra 27 #29-34 CC Villa de las Palmas, Local 291 (alfrente del banco de Bogotá)

Puedes hacer el pago por Nequi:
📱 3217204017  
👤 Juan Galarraga

👉 Solo necesito:
Ciudad - Dirección - Nombre

👉 Me envias el comprobante y te despacho de una 🚀`)
    }
)



const flowCiudades = addKeyword([
    'palmira','cali','buga','tulua','tuluá','valle',
    'bogota','bogotá',
    'medellin','medellín',
    'barranquilla',
    'cartagena',
    'cucuta','cúcuta',
    'bucaramanga',
    'pereira',
    'manizales',
    'armenia',
    'ibague','ibagué',
    'neiva',
    'villavicencio',
    'pasto',
    'monteria','montería',
    'santa marta'
])
.addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

        const ciudad = ctx.body.toLowerCase().trim()
        const nombre = ctx.pushName || 'parcero'

        // 🔥 HORA COLOMBIA (ARREGLADO)
        const hora = new Date().toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
            hour: 'numeric',
            hour12: false
        })
        const horaNumero = parseInt(hora)

        // =========================
        // 🔥 PALMIRA EXACTO
        // =========================
        const esPalmira =
            ciudad === 'palmira' ||
            ciudad === 'soy de palmira' ||
            ciudad === 'estoy en palmira' ||
            ciudad === 'vivo en palmira' ||
            ciudad === 'palmira valle del cauca' ||
            ciudad === 'para palmira'

        if (esPalmira) {

            if (horaNumero >= 5 && horaNumero <= 19) {
                return flowDynamic(`Perfecto ${nombre} 👍 Te llega en 15 minutos y pagas al recibir.
                
Para enviarlo necesito:
nombre + dirección`)
            }

            if (horaNumero > 19 && horaNumero <= 23) {
                return flowDynamic(`Perfecto ${nombre} 👍 Te llega mañana tipo 9:30am y pagas al recibir.
                
Para enviarlo necesito:
nombre + dirección`)
            }

            return flowDynamic(`Perfecto ${nombre} 👍 Te llega hoy tipo 9:30am y pagas al recibir.
            
Para enviarlo necesito:
nombre + dirección`)
        }

        // =========================
        // 🔥 VALLE EXACTO
        // =========================
        const esValle =
            ciudad === 'cali' ||
            ciudad === 'soy de cali' ||
            ciudad === 'estoy en cali' ||
            
            ciudad === 'rozo' ||
            ciudad === 'soy de rozo' ||
            ciudad === 'estoy en rozo' ||

            ciudad === 'buga' ||
            ciudad === 'soy de buga' ||

            ciudad === 'tulua' ||
            ciudad === 'tuluá' ||
            ciudad === 'soy de tulua'

        if (esValle) {
            return flowDynamic(`Perfecto ${nombre} 👍 Te llega en 2 días y pagas al recibir.
            
Para enviarlo necesito:
nombre + dirección + teléfono`)
        }

        // =========================
        // 🔥 RESTO EXACTO
        // =========================
        const esColombia =
            ciudad === 'bogota' || ciudad === 'bogotá' ||
            ciudad === 'medellin' || ciudad === 'medellín' ||
            ciudad === 'barranquilla' ||
            ciudad === 'cartagena' ||
            ciudad === 'cucuta' || ciudad === 'cúcuta' ||
            ciudad === 'bucaramanga' ||
            ciudad === 'pereira' ||
            ciudad === 'manizales' ||
            ciudad === 'armenia' ||
            ciudad === 'ibague' || ciudad === 'ibagué' ||
            ciudad === 'neiva' ||
            ciudad === 'villavicencio' ||
            ciudad === 'pasto' ||
            ciudad === 'monteria' || ciudad === 'montería' ||
            ciudad === 'santa marta'

        if (esColombia) {
            return flowDynamic(`Perfecto ${nombre} 👍 Te llega en 3 días y pagas al recibir.
            
Para enviarlo necesito:
nombre + dirección + teléfono`)
        }
    }
)
//
const flowAf111 = addKeyword([
    'af1 1.1','air force 1.1','airforce 1.1','af1 blanca 1.1','air force 1 blanca 1.1'
])
.addAnswer(null, null, async (ctx, { flowDynamic }) => {

    const mensaje = ctx.body.toLowerCase()
    const nombre = ctx.pushName || 'parcero'
    const user = ctx.from

    // 🔥 GUARDAR PRODUCTO (CLAVE)
    estadoUsuarios[user] = {
        producto: 'af1_11'
    }

    // 🔥 SI PIDE PRECIO
    if (
        mensaje.includes('precio') ||
        mensaje.includes('cuanto') ||
        mensaje.includes('valor')
    ) {

        await delay()
        return flowDynamic(`💰 Las AF1 blancas 1.1 están en $110.000

🔥 Me quedan pocas en promocion hoy
👉 ¿Me regalas la direccion exacta para enviartelas de una?`)
    }

    // 🔥 SI SOLO MUESTRA INTERÉS (NO PRESIONES DURO)
    await delay()
    return flowDynamic(`💰 Las AF1 blancas 1.1 están en $110.000

🔥 Me quedan pocas en promocion hoy
👉 ¿Me regalas la direccion exacta para enviartelas de una?`)
})


//
const flowFoto = addKeyword(['foto','fotos','imagen','muestrame','manda foto'])
.addAnswer(
    null,
    null,
    async (ctx, { flowDynamic }) => {

        const user = ctx.from
        const estado = estadoUsuarios[user]

        if (!estado) return

        // 🔥 CHANCLAS
        if (estado.producto === 'chanclas_ozuna') {
            await delay()
            return flowDynamic([
                {
                    body: `🔥 Estas son las chanclas Ozuna

💰 Están en $70.000

📦 Disponibles hoy

👉 ¿Para qué ciudad serían?`,
                    media: './src/img/WhatsApp Image 2026-04-05 at 2.50.01 PM.jpeg'
                }
            ])
        }

        // 🔥 AF1
        if (estado.producto === 'af1_11') {
            await delay()
            return flowDynamic([
                {
                    body: `🔥 Estas son las AF1 blancas 1.1

💰 Están en $110.000

📦 Disponibles hoy

👉 ¿Para qué ciudad serían?`,
                    media: './src/img/WhatsApp Image 2026-04-05 at 2.50.01 PM.jpeg'
                }
            ])
        }

        // 🔥 OTROS PRODUCTOS (opcional)
    }
)
//
// 🔥 CONTROL
const seguimientoOzuna = {}
const timersOzuna = {}

const flowOzuna = addKeyword([
    'chanclas','chancla','ozuna','chanclas ozuna','ozuna 1.1','sandalias ozuna'
])

// 🔥 1. PRIMER MENSAJE
.addAnswer(
    `🔥 50% OFF HOY 🔥

🩴 CHANCLAS OZUNA 1.1

⭐ Más vendidas esta semana  
⭐ Calidad premium garantizada  

✅ Súper cómodas todo el día  
✅ Antideslizantes (no resbalan)  
✅ Resistentes y ligeras`,
    null,
    async (ctx, { flowDynamic }) => {

        const user = ctx.from

        estadoUsuarios[user] = {
            producto: 'chanclas_ozuna'
        }

        await delay()

        await flowDynamic([
            {
                body: `
💰 PRECIO HOY: $70.000  
❌ Antes: $100.000  

🚚 Envío GRATIS en Palmira  
📦 Valle: $15.000  
💸 Pagas al recibir  

⏳ Entrega rápida 1-3 días`,
                media: './src/img/PhotoCollage_1776480765316.jpg'
            }
        ])
    }
)


// 🔥 2. CAPTURA
.addAnswer(
    `⚠️ STOCK LIMITADO

🔥 Últimas unidades disponibles

👉 Pide las tuyas ahora

Escríbeme tu talla (38, 40, 42)`,
    { capture: true },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const user = ctx.from

        // limpiar
        if (seguimientoOzuna[user]) delete seguimientoOzuna[user]

        if (timersOzuna[user]) {
            timersOzuna[user].forEach(t => clearTimeout(t))
            delete timersOzuna[user]
        }

        const numero = msg.match(/\d{2}/)

        // 🔥 SI ENVÍA TALLA
        if (numero) {

            estadoUsuarios[user] = {
                producto: 'chanclas_ozuna',
                talla: numero[0]
            }

            await delay()
            await flowDynamic(`🔥 Perfecto, talla ${numero[0]} disponible

💰 $70.000  
🚚 Envío GRATIS en Palmira  
📦 Valle: $15.000  

💸 Pagas al recibir  

👉 Para enviártelas necesito:
Nombre - Ciudad - Dirección - Barrio - Teléfono  

🚀 Te despacho hoy mismo`)

            seguimientoOzuna[user] = 'direccion'
            timersOzuna[user] = []

            timersOzuna[user].push(setTimeout(async () => {
                if (seguimientoOzuna[user] !== 'direccion') return
                await flowDynamic(`👀 Solo me faltan tus datos para enviarlas`)
            }, 180000))

            timersOzuna[user].push(setTimeout(async () => {
                if (seguimientoOzuna[user] !== 'direccion') return
                await flowDynamic(`⚠️ Últimos cupos de envío hoy

👉 Envíame tus datos ahora`)
                delete seguimientoOzuna[user]
            }, 600000))

            return
        }

        // 🔥 SI NO ENVÍA TALLA
        return flowDynamic(`👀 Para pedirlas rápido

👉 Escríbeme tu talla (ej: 40, 42)`)
    }
)



// =====================================================
// 🚀 INIT
// =====================================================

cargarInventario()

createBot({
    flow: createFlow([
	flow,           // saludo
        flowAF1,        // AF1
        flowOzuna,      // chanclas
        flowAf111,      // af1 1.1
        flowFoto,       // fotos
        flowCatalogo,
        flowUbicacion,
        flowHorario,
        flowNequi
    ]),
    provider: createProvider(Provider, { version: [2, 3000, 1035824857] }),
    database: new Database(),
}).then(({ httpServer }) => httpServer(PORT))

// 🔚 FIN BOT