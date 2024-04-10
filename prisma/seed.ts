import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';

const JAN_1ST_2000 = 946684800;

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
        birthDate: JAN_1ST_2000,
        firstName: 'Brigham',
        lastName: 'Andersen',
        latitude: 38.90343,
        locationLastUpdated: 1706832000,
        longitude: -77.0541
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
        bio: 'I love some good English',
        birthDate: JAN_1ST_2000,
        firstName: 'Taylor',
        lastName: 'English',
        latitude: 37.33490417052106,
        locationLastUpdated: 1710031975,
        longitude: -122.00879734210524
      }
    });
    await prisma.user.create({
      data: {
        bio: 'The name is Joe Bob, not Jim Bob',
        birthDate: JAN_1ST_2000,
        firstName: 'Joe',
        lastName: 'Bob',
        latitude: 37.33476720715561,
        locationLastUpdated: 1710031975,
        longitude: -122.00837388626947
      }
    });
    await prisma.user.create({
      data: {
        bio: 'Catch me shmoozing dinoco',
        birthDate: JAN_1ST_2000,
        firstName: 'Suzy',
        lastName: 'Shmoozy',
        latitude: 37.33432494345617,
        locationLastUpdated: 1710031975,
        longitude: -122.00865021585727
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
