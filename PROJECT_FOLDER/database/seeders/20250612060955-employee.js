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
    await queryInterface.bulkInsert('employee', [
      {
        nik: '11011',
        name: 'Adi',
        is_active: true,
        start_date: new Date('2025-01-01'),
        end_date: new Date('2030-12-31'),
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nik: '11012',
        name: 'Farhan',
        is_active: true,
        start_date: new Date('2025-06-01'),
        end_date: new Date('2027-06-01'),
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nik: '11013',
        name: 'Budi',
        is_active: false,
        start_date: new Date('2020-01-01'),
        end_date: new Date('2024-12-31'),
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nik: '11014',
        name: 'Citra',
        is_active: true,
        start_date: new Date('2022-01-01'),
        end_date: new Date('2027-12-31'),
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nik: '11015',
        name: 'Laura',
        is_active: false,
        start_date: new Date('2019-01-01'),
        end_date: new Date('2025-01-01'),
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date()
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
    await queryInterface.bulkDelete('employee', {
      [Op.or]: [
        { nik: '11011' },
        { nik: '11012' },
        { nik: '11013' },
        { nik: '11014' },
        { nik: '11015' },
      ]
    });
  }
};
