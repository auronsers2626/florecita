class JardinMagico {
    constructor() {
        this.estado = {
            dia: 1,
            progreso: 0,
            estadoDiario: 0,
            etapa: 1,
            regadoHoy: false,
            solHoy: false,
            limpiadoHoy: false
        };
        
        this.etapas = [
            { nombre: "Semilla", altura: 40 },
            { nombre: "Brote", altura: 60 },
            { nombre: "Tallo", altura: 100 },
            { nombre: "Hojas", altura: 140 },
            { nombre: "Botón", altura: 180 },
            { nombre: "Flor Cerrada", altura: 200 },
            { nombre: "Tulipán", altura: 220 }
        ];
        
        this.inicializar();
    }

    inicializar() {
        this.cargarProgreso();
        this.configurarEventos();
        this.actualizarInterfaz();
        this.generarPlanta();
    }

    configurarEventos() {
        document.getElementById('regar-btn').addEventListener('click', () => this.regar());
        document.getElementById('sol-btn').addEventListener('click', () => this.darSol());
        document.getElementById('hierbas-btn').addEventListener('click', () => this.quitarHierbas());
        document.getElementById('foto-btn').addEventListener('click', () => this.tomarFoto());
        document.getElementById('reiniciar-btn').addEventListener('click', () => this.mostrarModalReinicio());
        document.getElementById('confirmar-reinicio').addEventListener('click', () => this.reiniciarJuego());
        document.getElementById('cancelar-reinicio').addEventListener('click', () => this.ocultarModalReinicio());
    }

    cargarProgreso() {
        const guardado = localStorage.getItem('jardinMagico');
        if (guardado) {
            const datos = JSON.parse(guardado);
            const ahora = new Date();
            const ultimaAccion = new Date(datos.ultimaAccionTimestamp || 0);
            const horasPasadas = (ahora - ultimaAccion) / (1000 * 60 * 60);
            
            // Si pasaron más de 2 horas, resetear acciones (para testing)
            if (horasPasadas >= 2) {
                this.estado.dia = Math.min(datos.dia + 1, 7);
                this.estado.estadoDiario = 0;
                this.estado.regadoHoy = false;
                this.estado.solHoy = false;
                this.estado.limpiadoHoy = false;
                this.mostrarMensaje("🕑 ¡Nuevo día! Puedes cuidar tu planta otra vez");
            } else {
                // Mismo día, mantener estado
                this.estado = { ...this.estado, ...datos };
            }
        }
        this.actualizarProgresoTotal();
        this.guardarProgreso();
    }

    guardarProgreso() {
        const datosGuardar = {
            ...this.estado,
            ultimaAccionTimestamp: Date.now(),
            ultimoDia: new Date().toDateString()
        };
        localStorage.setItem('jardinMagico', JSON.stringify(datosGuardar));
    }

    actualizarProgresoTotal() {
        const progresoPorDia = 100 / 7;
        this.estado.progreso = Math.min((this.estado.dia - 1) * progresoPorDia + (this.estado.estadoDiario / 3) * (progresoPorDia / 100 * 30), 100);
        this.estado.etapa = Math.min(Math.floor(this.estado.progreso / 14) + 1, 7);
        if (this.estado.dia === 7 && this.estado.progreso >= 100) {
            setTimeout(() => {
                this.mostrarMensaje("Nuesto amor ha llegado a su maxima belleza, Siempre seras mi eterna Primavera")
            }, 2000);
        }    
    }

    regar() {
        if (this.estado.regadoHoy) {
            this.mostrarMensaje("💧 ¡Mi amor por ti es tan costante como el agua que hace crecer esta flor");
            return;
        }
        this.estado.regadoHoy = true;
        this.estado.estadoDiario += 1;
        this.ejecutarAccion('agua');
        this.mostrarMensaje("💧 ¡Cada gota de agua es un te amo que te digo!");
    }

    darSol() {
        if (this.estado.solHoy) {
            this.mostrarMensaje("☀️ ¡Tu Sonrisa son los rayos del sol que calientan esta flor!");
            return;
        }
        this.estado.solHoy = true;
        this.estado.estadoDiario += 1;
        this.ejecutarAccion('sol');
        this.mostrarMensaje("☀️ ¡Eres el Sol que ilumina mi vida!");
    }

    quitarHierbas() {
        if (this.estado.limpiadoHoy) {
            this.mostrarMensaje("🌱 ¡Ya limpiaste hoy!");
            return;
        }

        const hierbas = document.querySelectorAll('.mala-hierba');
        if (hierbas.length === 0) {
            this.generarMalasHierbas();
            this.mostrarMensaje("🌱 ¡Han aparecido malas hierbas! Tócalas para eliminarlas.");
            return;
        }

        this.estado.limpiadoHoy = true;
        this.estado.estadoDiario += 1;
        this.eliminarMalasHierbas();
        this.mostrarMensaje("🌱 ¡Juntos quitaremos todo lo malo de nuestra relacion!");
    }

    ejecutarAccion(tipo) {
        this.actualizarProgresoTotal();
        this.actualizarInterfaz();
        this.generarPlanta();
        this.guardarProgreso();

        if (tipo === 'agua') this.animarAgua();
        if (tipo === 'sol') this.animarSol();
        
        this.verificarCompletadoDiario();
    }

    animarAgua() {
        const efectoAgua = document.getElementById('efecto-agua');
        efectoAgua.innerHTML = '';
        efectoAgua.style.opacity = '1';

        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const gota = document.createElement('div');
                gota.className = 'gota';
                gota.style.left = `${45 + Math.random() * 10}%`;
                efectoAgua.appendChild(gota);
                setTimeout(() => gota.remove(), 1500);
            }, i * 150);
        }

        setTimeout(() => efectoAgua.style.opacity = '0', 2000);
    }

    animarSol() {
        const efectoSol = document.getElementById('efecto-sol');
        efectoSol.innerHTML = '';
        efectoSol.style.opacity = '1';

        const rayo = document.createElement('div');
        rayo.className = 'rayo';
        rayo.style.width = '300px';
        rayo.style.height = '300px';
        rayo.style.left = '50%';
        rayo.style.top = '50%';
        rayo.style.transform = 'translate(-50%, -50%)';
        efectoSol.appendChild(rayo);

        setTimeout(() => {
            efectoSol.style.opacity = '0';
            rayo.remove();
        }, 2000);
    }

    generarMalasHierbas() {
        const contenedor = document.getElementById('malas-hierbas');
        contenedor.innerHTML = '';
        
        const numHierbas = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < numHierbas; i++) {
            setTimeout(() => {
                const hierba = document.createElement('div');
                hierba.className = 'mala-hierba';
                hierba.style.left = `${30 + Math.random() * 40}%`;
                hierba.style.height = `${25 + Math.random() * 20}px`;
                hierba.style.bottom = `${60 + Math.random() * 30}px`;
                
                hierba.addEventListener('click', () => {
                    if (!this.estado.limpiadoHoy) {
                        hierba.style.opacity = '0';
                        hierba.style.transform = 'scale(0.5) rotate(45deg)';
                        setTimeout(() => {
                            if (hierba.parentNode) {
                                hierba.remove();
                            }
                            const hierbasRestantes = document.querySelectorAll('.mala-hierba');
                            if (hierbasRestantes.length === 0) {
                                this.estado.limpiadoHoy = true;
                                this.estado.estadoDiario += 1;
                                this.ejecutarAccion('limpiar');
                                this.mostrarMensaje("🌱 ¡Malas hierbas eliminadas! La planta puede respirar mejor.");
                            }
                        }, 300);
                    }
                });
                
                contenedor.appendChild(hierba);
            }, i * 200);
        }
    }

    eliminarMalasHierbas() {
        const hierbas = document.querySelectorAll('.mala-hierba');
        hierbas.forEach((hierba, index) => {
            setTimeout(() => {
                hierba.style.opacity = '0';
                hierba.style.transform = 'scale(0.5) rotate(45deg)';
                setTimeout(() => hierba.remove(), 300);
            }, index * 200);
        });
    }

    generarPlanta() {
        const planta = document.getElementById('planta');
        
        // SOLO cambiamos la clase - los sprites se encargan del resto
        planta.className = `planta etapa${this.estado.etapa}`;
        
        // Ajustar altura del contenedor
        const altura = this.etapas[this.estado.etapa - 1].altura;
        planta.style.height = `${altura}px`;
        
        console.log(`🌱 Mostrando sprite etapa ${this.estado.etapa}`);
    }

    actualizarInterfaz() {
        document.getElementById('relleno-estado').style.width = `${(this.estado.estadoDiario / 3) * 100}%`;
        document.getElementById('relleno-progreso').style.width = `${this.estado.progreso}%`;
        document.getElementById('dia-actual').textContent = this.estado.dia;
        
        document.getElementById('regar-btn').disabled = this.estado.regadoHoy;
        document.getElementById('sol-btn').disabled = this.estado.solHoy;
        document.getElementById('hierbas-btn').disabled = this.estado.limpiadoHoy;
        
        // Mostrar/Ocultar malas hierbas
        if (!this.estado.limpiadoHoy && this.estado.etapa >= 3) {
            setTimeout(() => {
                const hierbas = document.querySelectorAll('.mala-hierba');
                if (hierbas.length === 0) {
                    this.generarMalasHierbas();
                }
            }, 100);
        } else {
            this.eliminarMalasHierbas();
        }
    }

    verificarCompletadoDiario() {
        if (this.estado.estadoDiario >= 3) {
            const mensajeCompletado = (
                "Haz hecho de hoy un dia magico, vuelve mañana"
            )
        }
    }

    tomarFoto() {
        this.mostrarMensaje("📸 ¡Foto tomada! 💜");
    }

    mostrarModalReinicio() {
        document.getElementById('modal-reinicio').style.display = 'flex';
    }

    ocultarModalReinicio() {
        document.getElementById('modal-reinicio').style.display = 'none';
    }

    reiniciarJuego() {
        localStorage.removeItem('jardinMagico');
        this.estado = {
            dia: 1,
            progreso: 0,
            estadoDiario: 0,
            etapa: 1,
            regadoHoy: false,
            solHoy: false,
            limpiadoHoy: false
        };
        this.ocultarModalReinicio();
        this.actualizarInterfaz();
        this.generarPlanta();
        this.mostrarMensaje("🌱 ¡Nueva flor plantada!");
    }

    mostrarMensaje(texto) {
        const mensajes = document.getElementById('mensajes');
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje';
        mensaje.textContent = texto;
        mensajes.appendChild(mensaje);
        
        setTimeout(() => mensaje.remove(), 3000);
    }
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    window.jardinMagico = new JardinMagico();
});

// Comandos para avanzar días (para testing)
function avanzarDia() {
    const juego = document.jardinMagico;
    juego.estado.dia += 1;
    juego.estado.regadoHoy = false;
    juego.estado.solHoy = false;
    juego.estado.limpiadoHoy = false;
    juego.estado.estadoDiario = 0;
    juego.actualizarInterfaz();
    juego.generarPlanta();
    juego.guardarProgreso();
    alert(`Avanzado al día ${juego.estado.dia}`);
}

function irAlDia(dia) {
    const juego = document.jardinMagico;
    juego.estado.dia = dia;
    juego.estado.etapa = dia;
    juego.estado.regadoHoy = false;
    juego.estado.solHoy = false;
    juego.estado.limpiadoHoy = false;
    juego.estado.estadoDiario = 0;
    juego.actualizarInterfaz();
    juego.generarPlanta();
    juego.guardarProgreso();
    alert(`Saltado al día ${dia}`);
}

function reiniciarTodo() {
    localStorage.removeItem('jardinMagico');
    location.reload();
}