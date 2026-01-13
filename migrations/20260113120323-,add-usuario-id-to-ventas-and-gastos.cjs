'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //======================== Primero Agregamos campo a las tablas ======
    //Agregar a Ventas permite null
    await queryInterface.addColumn('ventas', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    //Idem en Gastos
    await queryInterface.addColumn('gastos', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    //======================== Segundo relacion lo que haya al Admin ======

    await queryInterface.sequelize.query(
      'UPDATE ventas SET usuario_id = 8 WHERE usuario_id IS NULL'
    );

    await queryInterface.sequelize.query(
      'UPDATE gastos SET usuario_id = 8 WHERE usuario_id IS NULL'
    );

    //======================== Tercer Editar el campo, no puede ser null ====

    await queryInterface.changeColumn('ventas', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.changeColumn('gastos', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface, Sequelize) {
    //Eliminar las columnas
    await queryInterface.removeColumn('ventas', 'usuario_id');
    await queryInterface.removeColumn('gastos', 'usuario_id');
  },
};
