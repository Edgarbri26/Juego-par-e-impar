const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const partidas = {}; // { codigo: { jugadores: [socketId, ...], estadoTablero: null, turno: 1 } }

io.on('connection', (socket) => {
    socket.on('unirse-partida', (codigo) => {
        if (!partidas[codigo]) partidas[codigo] = { jugadores: [], estadoTablero: null, turno: 1 };
        if (partidas[codigo].jugadores.length < 2) {
            partidas[codigo].jugadores.push(socket.id);
            socket.join(codigo);
            socket.emit('unido', partidas[codigo].jugadores.length); // 1 = impar, 2 = par
            io.to(codigo).emit('actualizar-tablero', partidas[codigo].estadoTablero);
        } else {
            socket.emit('sala-llena');
        }
    });

    socket.on('movimiento', ({ codigo, estadoTablero, turno }) => {
        if (partidas[codigo]) {
            partidas[codigo].estadoTablero = estadoTablero;
            partidas[codigo].turno = turno;
            socket.to(codigo).emit('actualizar-tablero', estadoTablero);
            io.to(codigo).emit('actualizar-turno', turno);
        }
    });

    socket.on('disconnect', () => {
        // Limpiar partidas si es necesario
        for (const codigo in partidas) {
            partidas[codigo].jugadores = partidas[codigo].jugadores.filter(id => id !== socket.id);
            if (partidas[codigo].jugadores.length === 0) {
                delete partidas[codigo];
            }
        }
    });
});

server.listen(3000, () => console.log('Servidor Socket.IO en puerto 3000'));