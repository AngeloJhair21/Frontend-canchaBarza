export interface Resena {
    id?: number;
    nombreJugador: string;
    calificacion: number; // Del 1 al 5
    comentario: string;
    fecha?: string;
    avatarUrl?: string; // Para la foto de perfil 
}