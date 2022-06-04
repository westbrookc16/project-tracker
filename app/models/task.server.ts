import { prisma } from "~/db.server";
//import type { Task } from "@prisma/client";
//export type { Task };
export const createTask = ({
  name,
  description,
  dueDate,
  projectId,
}: {
  name: string;
  description: string;
  dueDate: Date;
  projectId: number;
}) => {
  return prisma.task.create({
    data: { name, description, dueDate, projectId },
  });
};
export function getTasksByProject({ projectId }: { projectId: number }) {
  return prisma.task.findMany({ where: { projectId } });
}
