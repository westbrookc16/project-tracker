import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
export async function setStart(taskId: number) {
  const timeEntry = await prisma.timeEntry.create({
    data: { taskId, status: "Started", startDate: new Date() },
  });
  //get task and if it is on hold set the end date in last time entry
  const task = await prisma.task.findFirst({ where: { id: taskId } });
  if (task && task.status === "On Hold") {
    invariant(task.lastTimeEntry, "last time entry must be set.");
    await prisma.timeEntry.update({
      data: { endDate: new Date() },
      where: { id: task?.lastTimeEntry },
    });
  }
  await prisma.task.update({
    data: { lastTimeEntry: timeEntry.id, status: "Started" },
    where: { id: taskId },
  });
}
export async function setStatusWithEndTime(status: string, taskId: number) {
  await prisma.task.update({ data: { status }, where: { id: taskId } });
  const task = await prisma.task.findFirst({ where: { id: taskId } });
  invariant(task && task.lastTimeEntry, "task not found.");
  await prisma.timeEntry.update({
    data: { endDate: new Date() },
    where: { id: task.lastTimeEntry },
  });
  //only create if status is not complete
  if (status !== "Complete") {
    const timeEntry = await prisma.timeEntry.create({
      data: { startDate: new Date(), status, taskId },
    });
    await prisma.task.update({
      data: { lastTimeEntry: timeEntry.id },
      where: { id: taskId },
    });
  }
}
export function getHistory(taskId: number) {
  return prisma.timeEntry.findMany({
    where: { taskId },
    orderBy: [{ startDate: "asc" }],
  });
}
