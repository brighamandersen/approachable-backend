import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';

const prisma = new PrismaClient();

async function main() {
  // Clear out profile pictures
  exec('rm -f uploads/profile-pictures/*', (err, _stdout, stderr) => {
    if (err || stderr) {
      console.error('Error deleting files:', err, stderr);
      return;
    }
    console.log('Files deleted successfully');
  });

  // Clear user table
  try {
    await prisma.user.deleteMany({});
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }

  // Populate user table
  try {
    await prisma.user.create({
      data: {
        bio: 'Talk to me about Tagalog',
        birthDate: '1998-01-01',
        email: 'brigham@gmail.com',
        firstName: 'Brigham',
        lastName: 'Andersen',
        latitude: 38.90343,
        locationLastUpdated: 1706832000,
        longitude: -77.0541,
        password: 'password'
      }
    });
    await prisma.user.create({
      data: {
        bio: 'I like cabbage',
        birthDate: '1985-01-01',
        email: 'trader@gmail.com',
        firstName: 'Trader',
        lastName: 'Joe',
        latitude: 38.90412,
        locationLastUpdated: 1710031975,
        longitude: -77.05303,
        password: 'password'
      }
    });
    await prisma.user.create({
      data: {
        bio: 'I love some good English',
        birthDate: '2000-01-01',
        email: 'taylor@gmail.com',
        firstName: 'Taylor',
        lastName: 'English',
        latitude: 37.33490417052106,
        locationLastUpdated: 1710031975,
        longitude: -122.00879734210524,
        password: 'password'
      }
    });
    await prisma.user.create({
      data: {
        bio: 'The name is Joe Bob, not Jim Bob',
        birthDate: '1995-01-01',
        email: 'joe@gmail.com',
        firstName: 'Joe',
        lastName: 'Bob',
        latitude: 37.33476720715561,
        locationLastUpdated: 1710031975,
        longitude: -122.00837388626947,
        password: 'password'
      }
    });
    await prisma.user.create({
      data: {
        bio: 'Catch me shmoozing dinoco',
        birthDate: '2004-01-01',
        email: 'suzy@gmail.com',
        firstName: 'Suzy',
        lastName: 'Shmoozy',
        latitude: 37.33432494345617,
        locationLastUpdated: 1710031975,
        longitude: -122.00865021585727,
        password: 'password'
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
