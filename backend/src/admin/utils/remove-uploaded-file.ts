import { join } from 'path';
import { unlink } from 'fs/promises';

export async function removeUploadedFile(
  destinationUnderRoot: string,
  file: Express.Multer.File | undefined,
): Promise<void> {
  if (!file?.filename) {
    return;
  }
  try {
    await unlink(join(process.cwd(), destinationUnderRoot, file.filename));
  } catch {
    console.error(`Error removing uploaded file: ${file.filename}`);
  }
}