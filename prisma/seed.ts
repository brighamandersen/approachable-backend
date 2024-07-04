import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { hashPassword } from '../src/utils';

const prisma = new PrismaClient();

async function main() {
  // Clear out profile pictures
  exec('rm -f public/profile-pictures/*', (err, _stdout, stderr) => {
    if (err || stderr) {
      console.error('Error deleting files:', err, stderr);
      return;
    }
    console.log('Files deleted successfully');
  });

  try {
    await prisma.user.deleteMany({});

    await prisma.user.create({
      data: {
        age: 25,
        bio: 'Talk to me about Tagalog',
        email: 'brigham@gmail.com',
        firstName: 'Brigham',
        lastName: 'Andersen',
        latitude: 38.90343,
        locationLastUpdated: 1706832000,
        longitude: -77.0541,
        password: await hashPassword('password')
      }
    });
    await prisma.user.create({
      data: {
        age: 45,
        bio: 'I like cabbage',
        email: 'trader@gmail.com',
        firstName: 'Trader',
        lastName: 'Joe',
        latitude: 38.90412,
        locationLastUpdated: 1710031975,
        longitude: -77.05303,
        password: await hashPassword('password')
      }
    });
    await prisma.user.create({
      data: {
        age: 23,
        bio: 'I love some good English',
        email: 'taylor@gmail.com',
        firstName: 'Taylor',
        lastName: 'English',
        latitude: 37.33490417052106,
        locationLastUpdated: 1710031975,
        longitude: -122.00879734210524,
        password: await hashPassword('password')
      }
    });
    await prisma.user.create({
      data: {
        age: 60,
        bio: 'The name is Joe Bob, not Jim Bob',
        email: 'joe@gmail.com',
        firstName: 'Joe',
        lastName: 'Bob',
        latitude: 37.33476720715561,
        locationLastUpdated: 1710031975,
        longitude: -122.00837388626947,
        password: await hashPassword('password')
      }
    });
    await prisma.user.create({
      data: {
        age: 32,
        bio: 'Catch me shmoozing dinoco',
        email: 'suzy@gmail.com',
        firstName: 'Suzy',
        lastName: 'Shmoozy',
        latitude: 37.33432494345617,
        locationLastUpdated: 1710031975,
        longitude: -122.00865021585727,
        password: await hashPassword('password')
      }
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
