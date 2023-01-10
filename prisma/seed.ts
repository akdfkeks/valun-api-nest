import { PrismaClient } from '@prisma/client';
const randomWords = require('random-words');
const prisma = new PrismaClient();

const cat = [
  'plastic',
  'pet',
  'metal',
  'paper',
  'trash',
  'styrofoam',
  'glass',
  'garbage',
  'waste',
  'lumber',
  'vinyl',
  'etc',
];

async function main() {
  // await createUsers(10);
  // await createCategories(cat);
  await createIssues(2000);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

async function createCategories(data: Array<string>) {
  await prisma.issueCategory.createMany({
    data: data.map((c) => {
      return { name: c };
    }),
  });
}

async function createIssues(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.issue.create({
      data: {
        user: { connect: { id: 'test' + getRandomInt(1, 11) } },
        description: i + randomWords(5).toString(),
        lat: getRandomArbitrary(37.2, 37.8),
        lng: getRandomArbitrary(126.7, 127.5),
        category: {
          connect: {
            name: cat[getRandomInt(0, cat.length)],
          },
        },
        image: {
          create: {
            format: 'png',
            sourceName: 'sample',
            regularName: 'sample',
            sourceSize: 12345,
            compdSize: 12345,
            location:
              'https://towncleaner.s3.ap-northeast-2.amazonaws.com/sample.png',
          },
        },
      },
    });
  }
}

async function createUsers(count: number) {
  for (let i = 1; i < count + 1; i++) {
    await prisma.user.upsert({
      where: { id: 'test' + i },
      update: {},
      create: {
        id: 'test' + i,
        nick: 'nick' + i,
        profileImage:
          'https://towncleaner.s3.ap-northeast-2.amazonaws.com/profile.png',
        //"test1234"
        pw: '$argon2i$v=19$m=65536,t=3,p=4$yhjzG91URgANW0fTZ/mNlw$NIwhau/LYrjA7Q1Zk3Z/tF50PRDmPv6CIhR74B8HCDU',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
  });

// // 정문 차단기
// 37.45054573288935;
// 127.12752624352402;

// // IT 주차장 입구
// 37.45161346184302;
// 127.1274998020069;

// // 차이
// 0.001;
// -0.00002;
