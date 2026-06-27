const conexiones = new Map();

export const sseManager = {
  agregar(usuario_id, res) {
    conexiones.set(usuario_id, res);
  },

  eliminar(usuario_id) {
    conexiones.delete(usuario_id);
  },

  // Emite a un usuario específico
  emitir(usuario_id, data) {
    const res = conexiones.get(usuario_id);
    if (res) {
      res.write(`event: notificacion\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  },

  // Emite a todos los conectados
  emitirATodos(data) {
    for (const [, res] of conexiones) {
      res.write(`event: notificacion\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  },
};