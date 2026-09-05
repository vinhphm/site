export function readEnvironment(env: Record<string, string | undefined>) {
  const email = env.PUBLIC_EMAIL
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error('Set PUBLIC_EMAIL to a valid public contact email in .env')
  }
  const worker = env.PUBLIC_WORKER_HOST
  let workerHost: string
  try {
    const url = new URL(worker ?? '')
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error()
    workerHost = url.href.replace(/\/$/, '')
  } catch {
    throw new Error('Set PUBLIC_WORKER_HOST to an HTTP(S) worker URL in .env')
  }
  const cipherShift = Number(env.PUBLIC_CIPHER_SHIFT ?? '13')
  if (!Number.isInteger(cipherShift) || cipherShift < 0 || cipherShift > 127) {
    throw new Error('PUBLIC_CIPHER_SHIFT must be an integer between 0 and 127')
  }
  return { email, workerHost, cipherShift }
}
