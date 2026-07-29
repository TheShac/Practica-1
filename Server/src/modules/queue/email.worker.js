import { Worker } from "bullmq";
import { redisConnection } from "./redis.client.js";
import { emailQueue } from "./email.queue.js";
import { haySpaceParaEnviar } from "./quota.service.js";
import { enviarCorreoCrudo } from "#src/modules/email/email.service.js";

function msHastaProximoDia() {
  const ahora = new Date();
  const manana = new Date(ahora);
  manana.setDate(manana.getDate() + 1);
  manana.setHours(0, 5, 0, 0);
  return manana.getTime() - ahora.getTime();
}

export const emailWorker = new Worker(
  "email",
  async (job) => {
    const puedeEnviar = await haySpaceParaEnviar();

    if (!puedeEnviar) {
      await emailQueue.add(job.name, job.data, { delay: msHastaProximoDia() });
      return { reencolado: true, motivo: "cuota_alcanzada" };
    }

    await enviarCorreoCrudo(job.data);
    return { enviado: true };
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job, result) => {
  if (result?.reencolado) {
    console.log(`[email.worker] Job ${job.id} (${job.name}) re-encolado por cuota alcanzada.`);
  }
});

emailWorker.on("failed", (job, err) => {
  console.error(`[email.worker] Job ${job?.id} (${job?.name}) falló definitivamente:`, err.message);
});