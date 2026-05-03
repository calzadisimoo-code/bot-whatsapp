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

const INVENTARIO_FILE = './inventario.txt'
const VENTAS_FILE = './ventas.json'
const GASTOS_FILE = './gastos.json'
const NOMINA_FILE = './nomina.json'

// =====================================================
// 📦 PRODUCTOS (NO TOCAR)
// =====================================================
const productosDB = {
    af1_doble_a: {
        nombre: 'AIR FORCE 1 DOBLE A',
        precio: '$50.000',
        antes: '$80.000',
        imagen: './src/img/af1.jpg',
        tieneTalla: true
    },

    chanclas_ozuna: {
        nombre: 'CHANCLAS OZUNA PREMIUM',
        precio: '$69.900',
        antes: '$100.000',
        imagen: './src/img/PhotoCollage_1776480765316.jpg',
        tieneTalla: true
    }
}

 // 🔚 FIN productos



// =====================================================
// 💰 GASTOS / NOMINA
// =====================================================

const obtenerGastosPorMes = (msg) => {

    if (!fs.existsSync(GASTOS_FILE)) return "sin datos"

    const gastos = JSON.parse(fs.readFileSync(GASTOS_FILE))

    const meses = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    }

    const partes = msg.split(' ')
    const mes = meses[partes[1]]
    const year = parseInt(partes[2])

    let totalGastos = 0
    let lista = ""

    gastos.forEach(g => {
        const fecha = new Date(g.fecha)

        if (fecha.getMonth() === mes && fecha.getFullYear() === year) {

            if (g.tipo === "gasto") {
                totalGastos += g.valor
                lista += `${g.nombre} ${g.valor}\n`
            }
        }
    })

    if (lista === "") lista = "sin gastos\n"

    return `GASTOS ${partes[1]} ${year}

${lista}
Total gastos ${totalGastos}`
} // 🔚 FIN obtenerGastosPorMes


//inicio obtenernominapormes
const obtenerNominaPorMes = (msg) => {

    if (!fs.existsSync(NOMINA_FILE)) return "sin nomina"

    const nomina = JSON.parse(fs.readFileSync(NOMINA_FILE))

    const meses = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    }

    const partes = msg.split(' ')
    const mes = meses[partes[1]]
    const year = parseInt(partes[2])

    let total = 0
    let lista = ""

    nomina.forEach(n => {
        const fecha = new Date(n.fecha)

        if (fecha.getMonth() === mes && fecha.getFullYear() === year) {
            total += n.valor
            lista += `${n.nombre} ${n.valor}\n`
        }
    })

    if (lista === "") lista = "sin nomina\n"

    return `NOMINA ${partes[1]} ${year}

${lista}
Total nomina ${total}`
} // 🔚 FIN obtenerNominaPorMes


// =====================================================
// 📊 INVENTARIO Y RESUMEN
// =====================================================

const resumenInventario = () => {

    const INVENTARIO_INICIAL = 200 // 🔥 CAMBIA ESTE NUMERO

    if (!fs.existsSync(VENTAS_FILE)) {
        return `Ayer habían ${INVENTARIO_INICIAL}\n\nSin ventas hoy`
    }

    const ventas = JSON.parse(fs.readFileSync(VENTAS_FILE))
    const hoy = getFechaLocal()

    const hoyVentas = ventas.filter(v => v.fecha === hoy)

    if (hoyVentas.length === 0) {
        return `Ayer habían ${INVENTARIO_INICIAL}\n\nSin ventas hoy\n\nHoy deben haber ${INVENTARIO_INICIAL}`
    }

    let totalVendidos = 0
    let textoVentas = ""

    hoyVentas.forEach(v => {
        totalVendidos += v.cantidad
        textoVentas += `${v.cantidad} ${v.producto}\n`
    })

    const inventarioFinal = INVENTARIO_INICIAL - totalVendidos

    return `Ayer habían ${INVENTARIO_INICIAL}

Ventas hoy:
${textoVentas}
Hoy deben haber ${inventarioFinal}`
} // 🔚 FIN resumenInventario



// =====================================================
// 💾 GUARDADO (GASTOS, INVENTARIO, VENTAS)
// ============

// =====================================================
// 💰 GUARDAR NOMINA
// =====================================================


// 📦 INVENTARIO CON COSTO
let inventario = {
    af1b: { nombre: "Nike Air Force 1 Blanca", stock: 0, costo: 30 },
    c120: { nombre: "Cargador 120W", stock: 0, costo: 20 },
    zapatilla: { nombre: "zapatilla", stock: 0, costo: 25 },
    tecnologia: { nombre: "tecnologia", stock: 0, costo: 40 }
} // 🔚 FIN inventario


// =====================================================
// 📊 VENTAS HOY
// ===========
// =====================================================
// 📊 VENTAS POR MES
// =====================================================

const obtenerVentasPorMes = (mesTexto) => {

    if (!fs.existsSync(VENTAS_FILE)) return "sin datos"

    const ventas = JSON.parse(fs.readFileSync(VENTAS_FILE))
    const gastos = fs.existsSync(GASTOS_FILE)
        ? JSON.parse(fs.readFileSync(GASTOS_FILE))
        : []

    const meses = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    }

    const partes = mesTexto.split(' ')
    const mes = meses[partes[1]]
    const year = parseInt(partes[2])

    let totalProd = 0
    let totalVenta = 0
    let totalGanancia = 0

    let totalGastos = 0
    let totalNomina = 0
    let totalAds = 0

    ventas.forEach(v => {
        const fecha = new Date(v.fecha)

        if (fecha.getMonth() === mes && fecha.getFullYear() === year) {
            totalProd += v.cantidad
            totalVenta += v.precio * v.cantidad
            totalGanancia += v.ganancia * v.cantidad
        }
    })

    gastos.forEach(g => {
        const fecha = new Date(g.fecha)

        if (fecha.getMonth() === mes && fecha.getFullYear() === year) {

            if (g.tipo === "gasto") totalGastos += g.valor
            if (g.tipo === "anuncio") totalAds += g.valor
        }
    })

    const totalGeneralGastos = totalGastos + totalNomina + totalAds

    return `Mes ${partes[1]} ${year}

TotalProd ${totalProd}
TotalVenta ${totalVenta}
TotalGanancia ${totalGanancia}

Gastos ${totalGastos}
Nomina ${totalNomina}
Ads ${totalAds}

Neto ${totalGanancia - totalGeneralGastos}`
} // 🔚 FIN obtenerVentasPorMes



// =====================================================
// 🔥 PROCESAR VENTA FLEXIBLE
// =====================================================

const procesarVentaFlexible = (msg) => {

    const partes = msg.split(' ')

    let cantidad = 1
    let codigo = null
    let precio = 0
	let tipo = 'normal' // 🔥 AQUÍ EXACTAMENTE

    partes.forEach(p => {
		
		if (['local','envio','anuncio','cliente'].includes(p)) {
    tipo = p
}

        if (!isNaN(p)) {
            const num = parseInt(p)

            if (num <= 10 && cantidad === 1) {
                cantidad = num
            } else {
                precio = num
            }
        }

        if (inventario[p]) {
            codigo = p
        }
    })

    if (!codigo) {
        return `⚠️ Producto no existe

Escribe:
crear nombre costo

Ej:
crear crocs 20`
    }

    let producto = inventario[codigo].nombre
    let costo = inventario[codigo].costo

    inventario[codigo].stock -= cantidad
    guardarInventario()

    const ganancia = precio - costo

    const venta = {
    id: Date.now(),
    fecha: getFechaLocal(),
    hora: getHoraLocal(),
    producto,
    cantidad,
    precio,
    ganancia,
    tipo // 🔥 ESTO
}

    guardarVenta(venta)

    return `✅ Venta guardada

ID: ${venta.id}
${cantidad} ${producto}
$${precio * 1000}`
} // 🔚 FIN procesarVentaFlexible



// =====================================================
// 🆕 CREAR PRODUCTO
// =====================================================

// =====================================================
// 📖 HELP ADMIN
// =====================================================

const ayudaAdmin = () => {
return `🧠 COMANDOS ADMIN:

👉 venta ...
Ej: venta af1b envio 50
Ej: venta af1b 2 local 60

(No importa el orden ni si faltan cosas)

👉 ventas
Ver resumen del día

👉 compra codigo
Aumentar stock

👉 inventario
Ver stock

👉 eliminar ID
Elimina una venta

Ej:
eliminar 17123456789

`
} // 🔚 FIN ayudaAdmin



// =====================================================
// 🧠 MANEJADOR ADMIN
// =====================================================

// =====================================================
// 🤖 FLOWS
// =====================================================
const flowRecoger = addKeyword([
    'voy','paso','recoger','recogo','retiro','voy a pasar'
])
.addAnswer(
    `...`,
    null,
    async (ctx, { flowDynamic }) => {

        const nombre = ctx.pushName || 'parcero'
        
		await delay()
        await flowDynamic(`🔥 Perfecto ${nombre}

📍 Estamos en Palmira - Calle 29 #26-34 cc villa de las palmas, Local 291

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
//
// 🔥 CONTROL
const seguimientoAF111 = {}
const timersAF111 = {}

const flowAf111 = addKeyword([
    'af1 1.1','air force 1.1','Hola quiero las AF1 blancas 1.1','af1 blanca 1.1','airforce 1.1','air force 1 blanca 1.1'
])

// 🔥 1. PRIMER MENSAJE
.addAnswer(
    `🔥 50% OFF HOY 🔥

👟 AIR FORCE 1.1 PREMIUM

⭐ Más vendidas esta semana  
⭐ Calidad superior garantizada  

✅ Acabados premium  
✅ Súper cómodas todo el día  
✅ Resistentes y duraderas`,
    null,
    async (ctx, { flowDynamic }) => {

        const user = ctx.from

        estadoUsuarios[user] = {
            producto: 'af1_11'
        }

        await delay()

        await flowDynamic([
            {
                body: `
💰 PRECIO HOY: $110.000  
❌ Antes: $140.000  

🚚 Envío RAPIDO en Palmira  
📦 Valle: $15.000  
💸 Pagas al recibir  

⏳ Entrega rápida 1-3 días`,
                media: './src/img/WhatsApp-Image-2024-08-05-at-15.29.38.jpeg'
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
    { capture: true, idle: 0 },
    async (ctx, { flowDynamic }) => {

        const msg = ctx.body.toLowerCase()
        const user = ctx.from

        // limpiar
        if (seguimientoAF111[user]) delete seguimientoAF111[user]

        if (timersAF111[user]) {
            timersAF111[user].forEach(t => clearTimeout(t))
            delete timersAF111[user]
        }

        const numero = msg.match(/\d{2}/)

        // 🔥 SI ENVÍA TALLA
        if (numero) {

            estadoUsuarios[user] = {
                producto: 'af1_11',
                talla: numero[0]
            }

            await delay()
            await flowDynamic(`🔥 Perfecto, talla ${numero[0]} disponible

💰 $110.000  
🚚 Envío RAPIDO en Palmira  
📦 Valle: $15.000  

💸 Pagas al recibir  

👉 Para enviártelas necesito:
Nombre - Ciudad - Dirección - Teléfono  

🚀 Te despacho hoy mismo`)

            seguimientoAF111[user] = 'direccion'
            timersAF111[user] = []

            timersAF111[user].push(setTimeout(async () => {
                if (seguimientoAF111[user] !== 'direccion') return
                await flowDynamic(`👀 Solo me faltan tus datos para enviarlas`)
            }, 180000))

            timersAF111[user].push(setTimeout(async () => {
                if (seguimientoAF111[user] !== 'direccion') return
                await flowDynamic(`⚠️ Últimos cupos de envío hoy

👉 Envíame tus datos ahora`)
                delete seguimientoAF111[user]
            }, 600000))

            return
        }

        // 🔥 SI NO ENVÍA TALLA
        return flowDynamic(`👀 Para pedirlas rápido

👉 Escríbeme tu talla (ej: 40, 42)`)
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
    { capture: true, idle: 0 },
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
                media: './src/img/PhotoCollage_1776480765316.jpg'
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

// =====================================================
// 🚀 INIT
// =====================================================

createBot({
    flow: createFlow([
	flow,           // saludo
	    flowAf111,      // af1 1.1
        flowAF1,        // AF1
        flowOzuna,      // chanclas
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