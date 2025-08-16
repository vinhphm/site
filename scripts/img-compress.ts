import fs from 'node:fs/promises'
import sharp from 'sharp'

const maxSize = 1440
const PNG_QUALITY = 100
const JPEG_QUALITY = 80
const COMPRESSION_LEVEL = 9
const MIN_COMPRESSION_THRESHOLD = -0.1
const BYTES_PER_KB = 1024

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
    quality: format === 'png' ? PNG_QUALITY : JPEG_QUALITY,
    compressionLevel: COMPRESSION_LEVEL,
  })

  const outBuffer = await image.withMetadata().toBuffer()
  const size = buffer.byteLength
  const outSize = outBuffer.byteLength

  const percent = (outSize - size) / size
  if (percent <= MIN_COMPRESSION_THRESHOLD) {
    await fs.writeFile(file, outBuffer)
  }
}

export async function compressImages(files: string[]) {
  await Promise.all(files.map(processImage))
}

function _bytesToHuman(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(BYTES_PER_KB))
  return `${(size / BYTES_PER_KB ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`.padStart(
    10,
    ' '
  )
}
