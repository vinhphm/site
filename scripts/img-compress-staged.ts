import prompts from 'prompts'
import { simpleGit } from 'simple-git'
import { compressImages } from './img-compress'

const git = simpleGit()
const stagedFiles = (await git.diff(['--cached', '--name-only']))
  .split('\n')
  .map((i) => i.trim())
  .filter(Boolean)

const IMAGE_REGEX = /\.(png|jpe?g|webp)$/i
const images = stagedFiles.filter((i) => i.match(IMAGE_REGEX))
if (images.length > 0) {
  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Compress ${images.length} images?`,
  })

  compressImages(images)

  if (!confirm) {
    process.exit(0)
  }
} else {
  process.exit(0)
}
