const estadoUsuarios = {}
const seguimiento = {}
const clientesActivos = {}

const ABTest = {
    A: { enviados: 0, respuestas: 0 },
    B: { enviados: 0, respuestas: 0 }
}

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


// =============================
// 🔥 SEGUIMIENTO
// =============================
//const iniciarSeguimiento = async (ctx, flowDynamic) => {
  //  const user = ctx.from
//
  //  if (seguimiento[user]) return

//    seguimiento[user] = true

    // ⏱️ MENSAJE 1 - 5 MIN
  //  setTimeout(async () => {

    //    if (!seguimiento[user]) return // 🔥 si respondió, no enviar

      //  await flowDynamic(`👀 Ey, se están vendiendo bastante hoy

//👉 ¿te lo separo de una?`)

  //  }, 300000)

    // ⏱️ MENSAJE 2 - 10 MIN
    //setTimeout(async () => {

        //if (!seguimiento[user]) return

      //  await flowDynamic(`⚠️ Últimas unidades disponibles

//👉 Si la quieres hoy dime YA`)

  //      delete seguimiento[user]

    //}, 600000)
//}

// =============================
// 🔥 RECUPERACIÓN
// =============================
//const recuperarCliente = async (ctx, flowDynamic) => {
  //  const user = ctx.from
    //if (clientesActivos[user]) return

    //clientesActivos[user] = true

    //setTimeout(async () => {
      //  await flowDynamic(`👀 Oye, no sé si sigues interesado

//👉 ¿te confirmo disponibilidad?`)
  //  }, 900000)

    //setTimeout(async () => {
      //  await flowDynamic(`🔥 Último mensaje

//👉 Si las quieres hoy dime "sí"`)
  //      delete clientesActivos[user]
    //}, 1800000)
//}



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

// 🔐 ADMIN
const ADMIN = '573145823872'


import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: "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"
})

const responderIA = async (mensaje) => {
    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "Eres un vendedor por WhatsApp, respondes corto, directo y siempre intentas cerrar."
            },
            {
                role: "user",
                content: mensaje
            }
        ]
    })

    return res.choices[0].message.content
}



// =====================================================
// 📦 PRODUCTOS (NO TOCAR)
// =====================================================

const productos = [
{
    nombre: 'chanclas,sandalias, ozuna',
    titulo: 'CHANCLAS OZUNA',
    precio: '$68.000',
    descripcion: '\n👣 Súper cómodas todo el día\n🔥 No se resbalan\n😎 Se ven duras con cualquier outfit',
    imagen: './src/img/WhatsApp Image 2026-04-05 at 2.50.01 PM.jpeg'
},
{
    nombre: 'audifonos,airpods,pro 2',
    titulo: 'AIRPODS PRO 2 CANCELACION DE RUIDO ',
    descripcion: '\n🎧 Cancelación de ruido\n🔊 Sonido potente\n🔥 De los más pedidos',
    precio: '$65.000',
    imagen: './src/img/WhatsApp Image 2026-04-05 at 3.48.54 PM.jpeg'
},
{
    nombre: 'cargador,120w',
    titulo: 'CARGADOR 120W CARGA ULTRA RAPIDA',
    precio: '$45.000',
    descripcion: '\n⚡ Carga tu celular en minutos\n🔋 Ideal para uso diario\n🔥 Se están vendiendo mucho',
    imagen: './src/img/WhatsApp Image 2026-04-05 at 2.55.57 PM.jpeg'
},
{
    nombre: 'zapatillas,zapatos,zapatillas blancas,tennis,tenis,zapatilla,calzado,air force 1,af1,air force',
    titulo: 'Nike Air Force 1 Blanca',
    precio: '$65.000',
    descripcion: '\n🔥 Súper cómodas\n👣 Suela resistente y cocida\n🔥 De las más vendidas',
    imagen: './src/img/WhatsApp Image 2026-04-05 at 2.50.01 PM.jpeg'
}
] // 🔚 FIN productos


const flowAdminVentas = addKeyword(['ventas'])
.addAnswer('📊 Cargando ventas...', null, async (ctx, ctxFn) => {

    if (!ctx.from.includes(ADMIN)) return

    return ctxFn.flowDynamic(obtenerVentasHoy())
})


const flowAdminCrear = addKeyword(['crear'])
.addAnswer('Procesando...', { capture: true }, async (ctx, ctxFn) => {

    if (!ctx.from.includes(ADMIN)) return

    return ctxFn.flowDynamic(crearProductoDesdeAdmin(ctx.body))
})


const flowAdminGasto = addKeyword(['gasto'])
.addAnswer('Procesando gasto...', { capture: true }, async (ctx, ctxFn) => {

    if (!ctx.from.includes(ADMIN)) return

    return ctxFn.flowDynamic(
        manejarRespuesta(ctx, ctxFn)
    )
})


const flowAdminHelp = addKeyword(['help'])
.addAnswer('Mostrando comandos...', null, async (ctx, ctxFn) => {

    if (!ctx.from.includes(ADMIN)) return

    return ctxFn.flowDynamic(ayudaAdmin())
})





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
// =====================================================

const guardarGasto = (tipo, nombre, valor) => {

    let gastos = []

    if (fs.existsSync(GASTOS_FILE)) {
        gastos = JSON.parse(fs.readFileSync(GASTOS_FILE))
    }

    gastos.push({
        fecha: getFechaLocal(), // 🔥 CLAVE
        tipo,
        nombre,
        valor
    })

    fs.writeFileSync(GASTOS_FILE, JSON.stringify(gastos, null, 2))
} // 🔚 FIN guardarGasto


// =====================================================
// 💰 GUARDAR NOMINA
// =====================================================

const guardarNomina = (nombre, valor) => {

    let nomina = []

    if (fs.existsSync(NOMINA_FILE)) {
        nomina = JSON.parse(fs.readFileSync(NOMINA_FILE))
    }

    nomina.push({
        fecha: getFechaLocal(),
        nombre,
        valor
    })

    fs.writeFileSync(NOMINA_FILE, JSON.stringify(nomina, null, 2))
}



// 📦 INVENTARIO CON COSTO
let inventario = {
    af1b: { nombre: "Nike Air Force 1 Blanca", stock: 0, costo: 30 },
    c120: { nombre: "Cargador 120W", stock: 0, costo: 20 },
    zapatilla: { nombre: "zapatilla", stock: 0, costo: 25 },
    tecnologia: { nombre: "tecnologia", stock: 0, costo: 40 }
} // 🔚 FIN inventario



// =========================
// 💾 INVENTARIO
const guardarInventario = () => {
    const data = {}
    for (const codigo in inventario) {
        data[codigo] = inventario[codigo]
    }
    fs.writeFileSync(INVENTARIO_FILE, JSON.stringify(data, null, 2))
} // 🔚 FIN guardarInventario


const cargarInventario = () => {
    if (!fs.existsSync(INVENTARIO_FILE)) return

    const data = JSON.parse(fs.readFileSync(INVENTARIO_FILE, 'utf-8'))

    for (const codigo in data) {
        inventario[codigo] = data[codigo]
    }

    guardarInventario()
} // 🔚 FIN cargarInventario



// =========================
// 💰 GUARDAR VENTAS
const guardarVenta = (venta) => {
    let ventas = []

    if (fs.existsSync(VENTAS_FILE)) {
        ventas = JSON.parse(fs.readFileSync(VENTAS_FILE))
    }

    ventas.push(venta)

    fs.writeFileSync(VENTAS_FILE, JSON.stringify(ventas, null, 2))
} // 🔚 FIN guardarVenta



// =====================================================
// 🗑️ ELIMINAR VENTA
// =====================================================

const eliminarVenta = (msg) => {

    const id = msg.split(' ')[1]

    if (!id) return "❌ Usa: eliminar ID"

    if (!fs.existsSync(VENTAS_FILE)) return "❌ No hay ventas"

    let ventas = JSON.parse(fs.readFileSync(VENTAS_FILE))

    const nuevas = ventas.filter(v => v.id != id)

    if (ventas.length === nuevas.length) {
        return "❌ ID no encontrado"
    }

    fs.writeFileSync(VENTAS_FILE, JSON.stringify(nuevas, null, 2))

    return "🗑️ Venta eliminada correctamente"
} // 🔚 FIN eliminarVenta



// =====================================================
// 📊 VENTAS HOY
// =====================================================

const obtenerVentasHoy = () => {
    if (!fs.existsSync(VENTAS_FILE)) return "sin ventas"

    const ventas = JSON.parse(fs.readFileSync(VENTAS_FILE))
    const hoyObj = new Date()
    const hoy = getFechaLocal()

    const hoyVentas = ventas.filter(v => v.fecha === hoy)

    if (hoyVentas.length === 0) return "sin ventas hoy"

    let totalProductos = 0
    let totalVentas = 0
    let totalGanancia = 0

    let texto = `VENTAS ${hoyObj.toLocaleDateString()}\n\n`

    hoyVentas.forEach(v => {
        totalProductos += v.cantidad
        totalVentas += v.precio * v.cantidad
        totalGanancia += v.ganancia * v.cantidad

        texto += `${v.cantidad} ${v.producto} ${v.precio} G${v.ganancia} ${v.hora || ''} ${v.id}\n`
    })

    let totalGastos = 0
    let totalNomina = 0
    let totalAds = 0

    if (fs.existsSync(GASTOS_FILE)) {
        const gastos = JSON.parse(fs.readFileSync(GASTOS_FILE))

        gastos.forEach(g => {
            if (g.fecha === hoy) {

                if (g.tipo === "gasto") totalGastos += g.valor
                if (g.tipo === "nomina") totalNomina += g.valor
                if (g.tipo === "anuncio") totalAds += g.valor
            }
        })
    }
	
	// 🔥 NOMINA DEL DIA (NUEVO ARCHIVO)
if (fs.existsSync(NOMINA_FILE)) {
    const nomina = JSON.parse(fs.readFileSync(NOMINA_FILE))

    nomina.forEach(n => {
        if (n.fecha === hoy) {
            totalNomina += n.valor
        }
    })
}

    const totalGeneral = totalGastos + totalNomina + totalAds

    texto += `\nProductos ${totalProductos}
Venta ${totalVentas}
Ganancia ${totalGanancia}

Gastos ${totalGastos}
Nomina ${totalNomina}
Ads ${totalAds}

Neto ${totalGanancia - totalGeneral}`

    return texto
} // 🔚 FIN obtenerVentasHoy


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

const crearProductoDesdeAdmin = (msg) => {

    const partes = msg.split(' ')

    const nombre = partes[1]
    const costo = parseFloat(partes[2])

    if (!nombre || isNaN(costo)) {
        return "❌ Usa: crear nombre costo\nEj: crear crocs 20"
    }

    const codigo = nombre.toLowerCase()

    inventario[codigo] = {
        nombre: nombre,
        stock: 0,
        costo: costo
    }

    guardarInventario()

    return `✅ Producto creado

${nombre}
Costo: $${costo * 1000}`
} // 🔚 FIN crearProductoDesdeAdmin



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

const manejarRespuesta = async (ctx, { flowDynamic }) => {
	
	

    if (ctx.from.includes(ADMIN)) {
        const msg = ctx.body.toLowerCase().trim()
		
		
		if (msg.startsWith('gastos ') && msg.split(' ').length === 3) {
            return flowDynamic(obtenerGastosPorMes(msg))
          }
		
	if (msg === 'inventario') {
        return flowDynamic(resumenInventario())
    }
		
		// 📢 PAGO ANUNCIO
if (msg.startsWith('pago anuncio ')) {
    const partes = msg.split(' ')

    const valor = Math.abs(parseInt(partes[2]))

    if (isNaN(valor)) {
        return flowDynamic("usa: pago anuncio -100")
    }

    guardarGasto("anuncio", "ads", valor)

    return flowDynamic(`pago anuncio registrado`)
}

        if (msg.startsWith('ventas ') && msg.split(' ').length === 3) {
            return flowDynamic(obtenerVentasPorMes(msg))
        }

        if (msg === 'ventas') {
            return flowDynamic(obtenerVentasHoy())
        }

        if (msg === 'venta' || msg.startsWith('venta ')) {
            return flowDynamic(procesarVentaFlexible(msg))
        }
		
		if (msg.startsWith('crear ')) {
            return flowDynamic(crearProductoDesdeAdmin(msg))
}

if (msg.startsWith('gasto ')) {
    const partes = msg.split(' ')
    const nombre = partes[1]
    const valor = Math.abs(parseInt(partes[2]))

    if (!nombre || isNaN(valor)) {
        return flowDynamic("usa: gasto nombre -20")
    }

    guardarGasto("gasto", nombre, valor)
    return flowDynamic(`✅gasto registrado`)
}

// 🔥 VER NOMINA POR MES (PRIMERO)
const mesesValidos = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
]

// 🔥 VER NOMINA POR MES
if (
    msg.startsWith('nomina ') &&
    mesesValidos.includes(msg.split(' ')[1])
) {
    return flowDynamic(obtenerNominaPorMes(msg))
}

// 🔥 REGISTRAR NOMINA (DESPUÉS)
if (msg.startsWith('nomina ')) {
    const partes = msg.split(' ')
    const nombre = partes[1]
    const valor = Math.abs(parseFloat(partes[2]))

    if (!nombre || isNaN(valor)) {
        return flowDynamic("usa: nomina nombre -50")
    }

    guardarNomina(nombre, valor)

    return flowDynamic(`✅ nomina registrada`)
}
        if (msg.startsWith('eliminar ')) {
            return flowDynamic(eliminarVenta(msg))
        }

        if (msg.startsWith('compra ')) {
            const codigo = msg.split(' ')[1]

            if (inventario[codigo]) {
                inventario[codigo].stock++
                guardarInventario()
                return flowDynamic(`stock actualizado`)
            }
        }

        if (msg === 'help') {
            return flowDynamic(`comandos:

venta ...
ventas
ventas abril 2026
gasto nombre -20
nomina nombre -50
eliminar id
compra codigo`)
        }
    }
} // 🔚 FIN manejarRespuesta



// =====================================================
// 🤖 FLOWS
// =====================================================
const flowRecoger = addKeyword([
    'voy','paso','recoger','recogo','retiro','voy a pasar'
])
.addAnswer(
    '...',
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
    '...', // 👈 SIEMPRE algo aquí
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
    '...',
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

const flowAF1AA = addKeyword([
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



// 🔥 CONTROL
const seguimientoOzuna = {}
const timersOzuna = {}

const flowOzuna = addKeyword([
    'chanclas','chancla','sandalias','ozuna'
])

// 🔥 1. PRIMER MENSAJE (SIEMPRE SE ENVÍA)
.addAnswer(
    `🔥 50% OFF HOY 🔥

🩴 CHANCLAS OZUNA PREMIUM

⭐ Más vendidas esta semana  
⭐ Calidad superior garantizada  

✅ Súper cómodas todo el día  
✅ Antideslizantes (no resbalan)  
✅ Resistentes y ligeras`, // ⚠️ ESTO ES CLAVE (NO LO DEJES NULL)
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

// 🔥 2. CAPTURA (SOLO DESPUÉS DEL PRIMER MENSAJE)
.addAnswer(
    `⚠️ STOCK LIMITADO

🔥 Últimas unidades disponibles

👉 Pide las tuyas ahora

Escríbeme tu talla (38, 40, 42)`, // ⚠️ TAMBIÉN IMPORTANTE
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


const flowCatalogo = addKeyword(['catalogo','catálogo','modelo','modelos'])
.addAnswer(
    '...',
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
    '...',
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
    '...',
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
    '...',
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
    '...',
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
    '...',
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
Ciudad - Dirección - Barrio - Nombre

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
    '...',
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
.addAnswer('...', null, async (ctx, { flowDynamic }) => {

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

// =====================================================
// 🚀 INIT
// =====================================================

cargarInventario()

createBot({
    flow: createFlow([
	flowUbicacion,
	flowCiudades,
	//flowContraentrega,
	    flowHorario,
        flowCatalogo,
		flowAf111,
       // flowZapatillas,
	    flowOzuna,
      //  flowCargador,
		flowNequi,
		//flowEnvio,
        flowRecoger,
        flow
    ]),
    provider: createProvider(Provider, { version: [2, 3000, 1035824857] }),
    database: new Database(),
}).then(({ httpServer }) => httpServer(PORT))

// 🔚 FIN BOT