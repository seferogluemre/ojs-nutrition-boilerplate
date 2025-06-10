import { SystemAdministrationService } from '#modules/system-administration/service';
import { Gender } from '#prisma/enums';
import { loadEnv } from '#config/env';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import prisma from '#core/prisma';

loadEnv();

async function main() {
  // Clear existing data
  /* await prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "countries" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "states" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "cities" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "school_brands" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "categories" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "tags" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "product_brands" CASCADE`; */

  await SystemAdministrationService.setupInitialUser();

  await seedWorldData();

  // Create users
  await Promise.all(
    Array(150)
      .fill(null)
      .map(() => {
        const firstName = faker.person.firstName().slice(0, 50);
        const lastName = faker.person.lastName().slice(0, 50);
        return prisma.user.create({
          data: {
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.slice(0, 101),
            email: faker.internet.email().slice(0, 255),
            gender: faker.helpers.arrayElement(Object.values(Gender)),
            rolesSlugs: ['user'],
            emailVerified: true,
            image: faker.image.avatar().slice(0, 255),
          },
        });
      }),
  );

  console.log('Seeding completed successfully!');
}

async function seedWorldData() {
  const [regionsData, subregionsData, countriesData, statesData, citiesData] = [
    JSON.parse(fs.readFileSync(path.join(__dirname, 'seeders/world/regions.json'), 'utf-8')),
    JSON.parse(fs.readFileSync(path.join(__dirname, 'seeders/world/subregions.json'), 'utf-8')),
    JSON.parse(fs.readFileSync(path.join(__dirname, 'seeders/world/countries.json'), 'utf-8')),
    JSON.parse(fs.readFileSync(path.join(__dirname, 'seeders/world/states.json'), 'utf-8')),
    JSON.parse(fs.readFileSync(path.join(__dirname, 'seeders/world/cities.json'), 'utf-8')),
  ];

  await prisma.region.createMany({
    data: regionsData.map((region: any) => ({
      sourceId: region.id,
      name: region.name,
      translations: region.translations,
      wikiDataId: region.wikiDataId,
    })),
  });

  const regions = await prisma.region.findMany();

  const regionsMap = new Map(
    regions.map((region) => [
      region.sourceId,
      {
        id: region.id,
        name: region.name,
        sourceId: region.sourceId,
      },
    ]),
  );

  await prisma.subregion.createMany({
    data: subregionsData
      .map((subregion: any) => {
        const region = regionsMap.get(subregion.region_id);

        if (!region) return null;

        return {
          sourceId: subregion.id,
          name: subregion.name,
          translations: subregion.translations,
          wikiDataId: subregion.wikiDataId,
          regionName: region.name,
          regionId: region.id,
        };
      })
      .filter(Boolean),
  });

  const subregions = await prisma.subregion.findMany();

  const subregionsMap = new Map(
    subregions.map((subregion) => [
      subregion.sourceId,
      {
        id: subregion.id,
        name: subregion.name,
        sourceId: subregion.sourceId,
      },
    ]),
  );

  await prisma.country.createMany({
    data: countriesData
      .map((country: any) => {
        const region = regionsMap.get(country.region_id);
        const subregion = subregionsMap.get(country.subregion_id);

        return {
          sourceId: country.id,
          name: country.name,
          iso3: country.iso3,
          iso2: country.iso2,
          numericCode: country.numeric_code,
          phoneCode: country.phonecode,
          capital: country.capital,
          currency: country.currency,
          currencyName: country.currency_name,
          currencySymbol: country.currency_symbol,
          tld: country.tld,
          native: country.native,
          regionName: country.region !== '' ? country.region : undefined,
          regionId: region ? region.id : null,
          subregionName: country.subregion !== '' ? country.subregion : undefined,
          subregionId: subregion ? subregion.id : null,
          latitude: country.latitude,
          longitude: country.longitude,
          emoji: country.emoji,
          emojiU: country.emojiU,
          timezones: country.timezones,
          translations: country.translations,
          wikiDataId: country.wikiDataId,
        };
      })
      .filter(Boolean),
  });

  const countries = await prisma.country.findMany();

  const countriesMap = new Map(
    countries.map((country: any) => [
      country.sourceId,
      {
        id: country.id,
        name: country.name,
        sourceId: country.sourceId,
      },
    ]),
  );

  await prisma.state.createMany({
    data: statesData
      .map((state: any) => {
        const country = countriesMap.get(state.country_id);

        if (!country) return null;

        return {
          sourceId: state.id,
          name: state.name,
          stateCode: state.state_code,
          type: state.type,
          latitude: state.latitude,
          longitude: state.longitude,
          wikiDataId: state.wikiDataId,

          countryCode: state.country_code,
          countryName: state.country_name,
          countryId: country.id,
        };
      })
      .filter(Boolean),
  });

  const states = await prisma.state.findMany();

  const statesMap = new Map(
    states.map((state) => [
      state.sourceId,
      {
        id: state.id,
        name: state.name,
        sourceId: state.sourceId,
      },
    ]),
  );

  await prisma.city.createMany({
    data: citiesData
      .map((city: any) => {
        const country = countriesMap.get(city.country_id);
        const state = statesMap.get(city.state_id);

        if (!country) return undefined;
        if (!state) return undefined;

        return {
          sourceId: city.id,
          name: city.name,
          stateCode: city.state_code,
          countryCode: city.country_code,
          latitude: city.latitude,
          longitude: city.longitude,
          wikiDataId: city.wikiDataId,

          stateName: city.state_name,
          stateId: state.id,
          countryName: city.country_name,
          countryId: country.id,
        };
      })
      .filter(Boolean),
  });

  console.log('✅ World data seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();

    process.exit(0);
  });
