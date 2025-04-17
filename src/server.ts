import app from './app';
import { ENV } from './config/env';
import prisma from './config/db';

// Start the server
const server = app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
  console.log(`API Documentation available at http://localhost:${ENV.PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  // Close server gracefully
  server.close(async () => {
    // Disconnect Prisma client
    await prisma.$disconnect();
    console.log('Process terminated');
    process.exit(0);
  });
});

export default server;