import { PrismaClient } from '@prisma/client';

const JAN_1ST_2000 = 946684800;

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.create({
      data: {
        firstName: 'Brigham',
        lastName: 'Andersen',
        birthDate: JAN_1ST_2000,
        bio: 'Talk to me about Tagalog',
        latitude: 38.90343,
        longitude: -77.0541,
        locationLastUpdated: 1706832000
      }
    });
    await prisma.user.create({
      data: {
        firstName: 'Trader',
        lastName: 'Joe',
        birthDate: JAN_1ST_2000,
        bio: 'I like cabbage',
        latitude: 38.90412,
        longitude: -77.05303,
        locationLastUpdated: 1710031975
      }
    });
    await prisma.user.create({
      data: {
        firstName: 'Taylor',
        lastName: 'English',
        birthDate: JAN_1ST_2000,
        bio: 'I love some good English',
        latitude: 37.33490417052106,
        longitude: -122.00879734210524,
        locationLastUpdated: 1710031975
      }
    });
    await prisma.user.create({
      data: {
        firstName: 'Joe',
        lastName: 'Bob',
        birthDate: JAN_1ST_2000,
        bio: 'The name is Joe Bob, not Jim Bob',
        latitude: 37.33476720715561,
        longitude: -122.00837388626947,
        locationLastUpdated: 1710031975
      }
    });
    await prisma.user.create({
      data: {
        firstName: 'Suzy',
        lastName: 'Shmoozy',
        birthDate: JAN_1ST_2000,
        bio: 'Catch me shmoozing dinoco',
        latitude: 37.33432494345617,
        longitude: -122.00865021585727,
        locationLastUpdated: 1710031975
      }
    });

    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
