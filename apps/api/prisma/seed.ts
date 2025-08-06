import { loadEnv } from '#config/env';
import prisma from '#core/prisma';
import { USER_PERMISSIONS } from '#modules/auth/roles/constants';
import { RolesService } from '#modules/auth/roles/service';
import { Gender } from '#prisma/client';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

loadEnv();

async function main() {
  console.log('🌱 Starting seed...');

  // Bypass SystemAdministrationService for now
  console.log('📋 Creating Admin role manually...');
  let adminRole = await prisma.role.findFirst({
    where: { name: 'Admin' }
  });

  if (!adminRole) {
    adminRole = await RolesService.store({
      name: 'Admin',
      description: 'Sistem yöneticisi',
      permissions: ['*'], // Tüm yetkiler
    });
    console.log('✅ Admin role created:', adminRole);
  } else {
    console.log('✅ Admin role already exists:', adminRole);
  }

  console.log('👤 Creating "user" role...');
  // Create "user" role for regular users
  let userRole = await prisma.role.findFirst({
    where: { name: 'User' }
  });

  if (!userRole) {
    userRole = await RolesService.store({
      name: 'User',
      description: 'Normal kullanıcı',
      permissions: [...USER_PERMISSIONS],
    });
    console.log('✅ User role created:', userRole);
  } else {
    // Mevcut user rolünün permission'larını güncelle
    userRole = await RolesService.update(userRole.uuid, {
      permissions: [...USER_PERMISSIONS],
    });
    console.log('✅ User role permissions updated:', userRole);
  }

  console.log('🌍 Seeding world data...');
  await seedWorldData();

  console.log('👥 Creating test users...');
  // Create only 2 users for testing
  for (let i = 0; i < 2; i++) {
    const firstName = faker.person.firstName().slice(0, 50);
    const lastName = faker.person.lastName().slice(0, 50);
    const email = faker.internet.email().slice(0, 255);
    
    console.log(`Creating user ${i + 1}: ${email}`);
    
    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.slice(0, 101),
          email,
          gender: faker.helpers.arrayElement(Object.values(Gender)),
          rolesSlugs: ['user'],
          emailVerified: true,
          image: faker.image.avatar().slice(0, 255),
        },
      });
      console.log(`✅ User ${i + 1} created successfully:`, user.email);
    } catch (error) {
      console.error(`❌ Failed to create user ${i + 1}:`, error);
      throw error;
    }
  }

  console.log('✅ Seeding completed successfully!');
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
