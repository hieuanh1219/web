const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.submit = async ({ propertyId, user }) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  })};