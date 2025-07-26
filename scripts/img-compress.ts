import fs from 'node:fs/promises'
import sharp from 'sharp'

const maxSize = 1440

async function processImage(file: string) {
  const buffer = await fs.readFile(file)
  let image = sharp(buffer)
  const { format, width, height } = await image.metadata()

  if (!format) {
    throw new Error(`Could not determine format of ${file}`)
  }
  if (!(width && height)) {
    throw new Error(`Could not determine size of ${file}`)
  }
  if (format !== 'jpeg' && format !== 'png' && format !== 'webp') {
    throw new Error(`Unsupported format ${format} of ${file}`)
  }

  if (width > maxSize || height > maxSize) {
    image = image.resize(maxSize)
  }

  image = image[format]({
    quality: format === 'png' ? 100 : 80,
    compressionLevel: 9,
  })

  const outBuffer = await image.withMetadata().toBuffer()
  const size = buffer.byteLength
  const outSize = outBuffer.byteLength

  const percent = (outSize - size) / size
  if (percent <= -0.1) {
    await fs.writeFile(file, outBuffer)
  }
}

export async function compressImages(files: string[]) {
  await Promise.all(files.map(processImage))
}

function _bytesToHuman(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`.padStart(
    10,
    ' '
  )
}
