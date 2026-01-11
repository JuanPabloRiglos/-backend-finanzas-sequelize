import { fn, col, literal } from 'sequelize';

import { Gasto } from '../models/gasto.model';
import { Venta } from '../models/venta.model';

// Tipo para el resultado de agregación por mes
type AgregadoPorMes = {
  mes: string;
  total: string;
};

// =================== GET LINE CHART DATA ===================
export async function getLineChartData() {
  const [ventasPorMes, gastosPorMes] = await Promise.all([
    Venta.findAll({
      attributes: [
        [
          fn('TO_CHAR', fn('DATE_TRUNC', 'month', col('fecha')), 'YYYY-MM-DD'),
          'mes',
        ],
        [fn('SUM', col('monto')), 'total'],
      ],
      group: ['mes'],
      order: [[literal('mes'), 'ASC']],
      raw: true,
    }) as unknown as Promise<AgregadoPorMes[]>,

    Gasto.findAll({
      attributes: [
        [
          fn('TO_CHAR', fn('DATE_TRUNC', 'month', col('fecha')), 'YYYY-MM-DD'),
          'mes',
        ],
        [fn('SUM', col('monto')), 'total'],
      ],
      group: ['mes'],
      order: [[literal('mes'), 'ASC']],
      raw: true,
    }) as unknown as Promise<AgregadoPorMes[]>,
  ]);

  const balancePorMes = calcularBalance(ventasPorMes, gastosPorMes);

  return {
    ventas_por_mes: ventasPorMes,
    gastos_por_mes: gastosPorMes,
    balance_por_mes: balancePorMes,
  };
}

// =================== FUNCIÓN AUXILIAR ===================
function calcularBalance(ventas: AgregadoPorMes[], gastos: AgregadoPorMes[]) {
  const gastosMap = new Map(gastos.map(g => [g.mes, parseFloat(g.total)]));

  const ventasMap = new Map(ventas.map(v => [v.mes, parseFloat(v.total)]));

  const todosMeses = new Set([
    ...ventas.map(v => v.mes),
    ...gastos.map(g => g.mes),
  ]);

  const balance = Array.from(todosMeses).map(mes => {
    const totalVentas = ventasMap.get(mes) || 0;
    const totalGastos = gastosMap.get(mes) || 0;

    return {
      mes,
      balance: (totalVentas - totalGastos).toFixed(2),
    };
  });

  return balance.sort((a, b) => a.mes.localeCompare(b.mes));
}
