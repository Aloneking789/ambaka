"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const hash_1 = require("../src/utils/hash");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Delete all existing records (in reverse order of dependencies)
    await prisma.auditLog.deleteMany();
    await prisma.progressLog.deleteMany();
    await prisma.milestone.deleteMany();
    await prisma.road.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.ward.deleteMany();
    console.log('All existing records deleted.');
    // Create wards
    const ward1 = await prisma.ward.create({
        data: {
            name: 'North Ward'
        }
    });
    const ward2 = await prisma.ward.create({
        data: {
            name: 'South Ward'
        }
    });
    const ward3 = await prisma.ward.create({
        data: {
            name: 'East Ward'
        }
    });
    console.log('Created 3 wards');
    // Create super admin user
    const superAdminPassword = await (0, hash_1.hashPassword)('admin123');
    const superAdmin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: superAdminPassword,
            role: client_1.UserRole.SUPER_ADMIN
        }
    });
    // Create ward admins
    const wardAdminPassword = await (0, hash_1.hashPassword)('password123');
    const wardAdmin1 = await prisma.user.create({
        data: {
            name: 'North Ward Admin',
            email: 'north@example.com',
            password: wardAdminPassword,
            role: client_1.UserRole.WARD_ADMIN,
            wardId: ward1.id
        }
    });
    const wardAdmin2 = await prisma.user.create({
        data: {
            name: 'South Ward Admin',
            email: 'south@example.com',
            password: wardAdminPassword,
            role: client_1.UserRole.WARD_ADMIN,
            wardId: ward2.id
        }
    });
    // Create field engineer
    const engineerPassword = await (0, hash_1.hashPassword)('engineer123');
    const fieldEngineer = await prisma.user.create({
        data: {
            name: 'Field Engineer',
            email: 'engineer@example.com',
            password: engineerPassword,
            role: client_1.UserRole.FIELD_ENGINEER,
            wardId: ward1.id
        }
    });
    // Create auditor
    const auditorPassword = await (0, hash_1.hashPassword)('auditor123');
    const auditor = await prisma.user.create({
        data: {
            name: 'Auditor User',
            email: 'auditor@example.com',
            password: auditorPassword,
            role: client_1.UserRole.AUDITOR
        }
    });
    console.log('Created 5 users with different roles');
    // Create projects
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setMonth(currentDate.getMonth() + 6);
    const project1 = await prisma.project.create({
        data: {
            name: 'North Road Renovation',
            tenderId: 'TENDER-2025-001',
            wardId: ward1.id,
            startDate: currentDate,
            endDate: futureDate,
            status: 'IN_PROGRESS'
        }
    });
    const project2 = await prisma.project.create({
        data: {
            name: 'South Highway Extension',
            tenderId: 'TENDER-2025-002',
            wardId: ward2.id,
            startDate: currentDate,
            status: 'PLANNING'
        }
    });
    console.log('Created 2 projects');
    // Create roads
    const road1 = await prisma.road.create({
        data: {
            name: 'Main North Road',
            lengthKm: 5.2,
            latitude: 28.6139,
            longitude: 77.2090,
            projectId: project1.id
        }
    });
    const road2 = await prisma.road.create({
        data: {
            name: 'North Connector',
            lengthKm: 2.8,
            latitude: 28.6229,
            longitude: 77.2080,
            projectId: project1.id
        }
    });
    const road3 = await prisma.road.create({
        data: {
            name: 'South Main Highway',
            lengthKm: 7.5,
            latitude: 28.5355,
            longitude: 77.2100,
            projectId: project2.id
        }
    });
    console.log('Created 3 roads');
    // Create milestones
    const milestone1 = await prisma.milestone.create({
        data: {
            title: 'Initial Survey',
            description: 'Complete land survey and mark boundaries',
            projectId: project1.id,
            order: 1
        }
    });
    const milestone2 = await prisma.milestone.create({
        data: {
            title: 'Road Clearing',
            description: 'Clear vegetation and obstacles',
            projectId: project1.id,
            order: 2
        }
    });
    const milestone3 = await prisma.milestone.create({
        data: {
            title: 'Foundation Work',
            description: 'Prepare road foundation',
            projectId: project1.id,
            order: 3
        }
    });
    const milestone4 = await prisma.milestone.create({
        data: {
            title: 'Surfacing',
            description: 'Apply final road surface',
            projectId: project1.id,
            order: 4
        }
    });
    console.log('Created 4 milestones');
    // Create progress logs
    await prisma.progressLog.create({
        data: {
            milestoneId: milestone1.id,
            roadId: road1.id,
            status: 'COMPLETED',
            notes: 'Completed the initial survey on schedule',
            createdById: fieldEngineer.id
        }
    });
    await prisma.progressLog.create({
        data: {
            milestoneId: milestone2.id,
            roadId: road1.id,
            status: 'IN_PROGRESS',
            notes: 'Started clearing work, 60% complete',
            createdById: fieldEngineer.id
        }
    });
    console.log('Created 2 progress logs');
    // Create audit logs
    await prisma.auditLog.create({
        data: {
            action: 'CREATE',
            entityType: 'PROJECT',
            entityId: project1.id.toString(),
            details: JSON.stringify({
                name: project1.name,
                tenderId: project1.tenderId
            }),
            userId: wardAdmin1.id
        }
    });
    await prisma.auditLog.create({
        data: {
            action: 'UPDATE',
            entityType: 'ROAD',
            entityId: road1.id.toString(),
            details: JSON.stringify({
                name: road1.name,
                lengthKm: road1.lengthKm
            }),
            userId: fieldEngineer.id
        }
    });
    console.log('Created 2 audit logs');
    console.log('Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    // Close Prisma client
    await prisma.$disconnect();
});
