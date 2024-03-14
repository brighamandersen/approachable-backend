import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.create({
      data: {
        firstName: 'Taylor',
        lastName: 'English',
        latitude: 40.0,
        bio: 'I am fluent in English',
        longitude: 50.0,
        locationLastUpdated: 1704067200
      }
    });
    await prisma.user.create({
      data: {
        firstName: 'Brigham',
        lastName: 'Andersen',
        bio: 'Talk to me about Tagalog',
        latitude: 80.0,
        longitude: 90.0,
        locationLastUpdated: 1706832000
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
