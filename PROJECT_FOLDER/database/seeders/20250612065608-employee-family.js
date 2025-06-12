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
    await queryInterface.bulkInsert('employee_family', [
      {
        employee_id: 1,
        name: 'Susan',
        identifier: '20010',
        job: 'Ibu Rumah Tangga',
        place_of_birth: 'Jakarta',
        date_of_birth: '1993-04-22',
        religion: 'Islam',
        is_life: true,
        is_divorced: false,
        relation_status: 'Istri',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 1,
        name: 'Ahmad',
        identifier: '20011',
        job: 'Pelajar',
        place_of_birth: 'Jakarta',
        date_of_birth: '2017-09-15',
        religion: 'Islam',
        is_life: true,
        is_divorced: false,
        relation_status: 'Anak',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 1,
        name: 'Fatimah',
        identifier: '20012',
        job: '-',
        place_of_birth: 'Bandung',
        date_of_birth: '2020-08-13',
        religion: 'Islam',
        is_life: true,
        is_divorced: false,
        relation_status: 'Anak',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 3,
        name: 'Ani',
        identifier: '20031',
        job: 'Ibu Rumah Tangga',
        place_of_birth: 'Bandar Lampung',
        date_of_birth: '1996-02-03',
        religion: 'Katolik',
        is_life: true,
        is_divorced: false,
        relation_status: 'Istri',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 3,
        name: 'Grace',
        identifier: '20032',
        job: 'Pelajar',
        place_of_birth: 'Bandar Lampung',
        date_of_birth: '2016-04-19',
        religion: 'Katolik',
        is_life: true,
        is_divorced: false,
        relation_status: 'Anak',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 5,
        name: 'Billy',
        identifier: '20050',
        job: 'Dosen',
        place_of_birth: 'Pontianak',
        date_of_birth: '1994-05-29',
        religion: 'Buddha',
        is_life: true,
        is_divorced: false,
        relation_status: 'Suami',
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
    await queryInterface.bulkDelete('employee_family', {
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
