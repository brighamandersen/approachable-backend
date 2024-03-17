import { PrismaClient } from '@prisma/client';

const JAN_1ST_2000 = 946684800;

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.create({
      data: {
        firstName: 'Taylor',
        lastName: 'English',
        birthDate: JAN_1ST_2000,
        bio: 'I am fluent in English',
        latitude: 40.0,
        longitude: 50.0,
        locationLastUpdated: 1704067200
      }
    });
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
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
