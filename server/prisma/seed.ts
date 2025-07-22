import bcrypt from 'bcrypt';
// Using require to bypass potential module resolution issues in ts-node
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@dji.com',
      password: password,
      role: UserRole.ADMIN,
    },
  })
  
  console.log(`Created admin user: ${admin.email}`)
  
  // Create Dealers
  const dealer1 = await prisma.dealer.create({
    data: {
      name: '3D Solutions S.R.L.',
      sapId: '1210004699',
      category: 'A',
      website: 'https://www.3dsolutions.it/eu/it/',
      contacts: {
        create: [
          { name: 'Mario Rossi', role: ['President CCO'], email: 'm.rossi@3dsolutions.it', phone: '3331112233' },
          { name: 'Laura Esposito', role: ['CEO'], email: 'l.esposito@3dsolutions.it', phone: '3332223344' },
        ],
      },
    },
  })

  const dealer2 = await prisma.dealer.create({
    data: {
      name: 'AeroTech Robotics SRL',
      sapId: '1210009570',
      category: 'A',
      website: 'https://www.aerotech.com/',
      contacts: {
        create: [
          { name: 'Simone Conti', role: ['Marketing'], email: 's.conti@aerotech.com' },
          { name: 'Chiara Greco', role: ['Marketing'], email: 'c.greco@aerotech.com', phone: '3333334455' },
        ],
      },
    },
  })
  
  console.log(`Created ${await prisma.dealer.count()} dealers`)

  // Create a dealer user
   const dealerUser = await prisma.user.create({
    data: {
      email: 'dealer@aerotech.com',
      password: password,
      role: UserRole.DEALER,
      dealerId: dealer2.id,
    },
  })
  console.log(`Created dealer user: ${dealerUser.email}`)
  
  // Create Forms
  const form1 = await prisma.form.create({
    data: {
        title: 'Report Attività Marketing',
        description: 'Utilizza questo modulo per registrare tutte le attività di marketing completate.',
        published: true,
        dealerCanEditSubmissions: true,
        archived: false,
        fields: [
          { id: 'field-1', label: 'Nome Attività', type: 'TEXT', required: true },
          { id: 'field-2', label: 'Data Evento', type: 'DATE', required: true, isEventDate: true },
          {
            id: 'field-3',
            label: 'Tipo Attività',
            type: 'SELECT',
            required: true,
            isGoalLink: true,
            options: [
              { value: 'Webinar', label: 'Webinar', goalCategory: 'Campagna Online' },
              { value: 'Demo Prodotto', label: 'Demo Prodotto', goalCategory: 'Evento Fisico' },
            ],
          },
          { id: 'field-4', label: 'Prodotti Coinvolti', type: 'TEXT', required: false },
        ]
    }
  });
  console.log(`Created form: ${form1.title}`)
  
  // Create goals
  await prisma.goal.create({
    data: {
        category: 'A',
        activityType: 'Campagna Online',
        count: 4,
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-09-30'),
    }
  });
  console.log(`Created goals`)


  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })