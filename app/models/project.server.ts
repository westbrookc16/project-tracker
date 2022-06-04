import type { Project, User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Project };
export function getProjects({ userId }: { userId: User["id"] }) {
  return prisma.project.findMany({ where: { userId } });
}
export function getProject({ id }: { id: number }) {
  return prisma.project.findFirst({ where: { id } });
}
export function createProject({
  name,
  description,
  userId,
}: {
  name: string;
  userId: string;
  description: string;
}) {
  return prisma.project.create({ data: { name, description, userId } });
}
