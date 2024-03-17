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
        latitude: 38.90343,
        longitude: -77.0541,
        locationLastUpdated: 1706832000
      }
    });
    await prisma.user.create({
      data: {
        firstName: 'Trader',
        lastName: 'Joe',
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
