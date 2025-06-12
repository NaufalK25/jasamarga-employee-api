'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('education', [
      {
        employee_id: 1,
        name: 'Universitas Indonesia',
        level: 'Strata 1',
        description: 'Sarjana',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 1,
        name: 'SMAN 8 Jakarta',
        level: 'Sma',
        description: 'Sekolah Menengah Atas',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 2,
        name: 'Institut Teknologi Bandung',
        level: 'Strata 1',
        description: 'Sarjana',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 2,
        name: 'SMAN 3 Bandung',
        level: 'Sma',
        description: 'Sekolah Menengah Atas',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 3,
        name: 'Universitas Negeri Jakarta',
        level: 'Strata 1',
        description: 'Sarjana',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 4,
        name: 'SMAN 5 Surabaya',
        level: 'Sma',
        description: 'Sekolah Menengah Atas',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 5,
        name: 'Universitas Sumatera Utara',
        level: 'Strata 1',
        description: 'Sarjana',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 5,
        name: 'SMAS St. Ignasius Medan',
        level: 'Sma',
        description: 'Sekolah Menengah Atas',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('education', {
      [Op.or]: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ]
    });
  }
};
