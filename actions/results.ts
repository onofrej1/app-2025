'use server'

import { prisma } from "@/db/prisma";
import rules from "@/validation";
import { RunResult } from "@prisma/client";

export async function getResults() {
  return prisma.runResult.findMany({
    include: {
      run: true,
      /*_count: {
        select: {
            registrations: true,
            runResults: true,
        }
      }*/
    },    
  });
}

export async function getResultsByRunId(runId: number) {
  return prisma.runResult.findMany({
    where: {
      runId,
    },
  });
}

export async function createResults(data: RunResult[]) {
  const validateResult = rules.CreateRunResult.parse(data);
  
  const runResults = prisma.runResult.createMany({
    data: validateResult,
  });

  return runResults;
}
