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
    await queryInterface.bulkInsert('employee_profile', [
      {
        employee_id: 1,
        place_of_birth: 'Jakarta',
        date_of_birth: '1991-06-23',
        gender: 'Laki-Laki',
        is_married: true,
        prof_pict: 'default_profile.png',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 2,
        place_of_birth: 'Bandung',
        date_of_birth: '1998-02-14',
        gender: 'Laki-Laki',
        is_married: false,
        prof_pict: 'default_profile.png',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 3,
        place_of_birth: 'Jakarta',
        date_of_birth: '1994-10-02',
        gender: 'Laki-Laki',
        is_married: true,
        prof_pict: 'default_profile.png',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 4,
        place_of_birth: 'Surabaya',
        date_of_birth: '2000-12-05',
        gender: 'Perempuan',
        is_married: false,
        prof_pict: 'default_profile.png',
        created_by: 'Admin',
        updated_by: 'Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employee_id: 5,
        place_of_birth: 'Medan',
        date_of_birth: '1999-05-30',
        gender: 'Perempuan',
        is_married: true,
        prof_pict: 'default_profile.png',
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
    await queryInterface.bulkDelete('employee_profile', {
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
