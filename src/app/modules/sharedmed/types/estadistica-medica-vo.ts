export interface EstadisticaMedicaVo {
    medicos: Array<string>;
    tipo: number; // 1 conjuntas, 2 individual
    consultas: Array<number>;
    cantidad: number;
}
