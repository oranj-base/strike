import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.resolve(__dirname, '../build');
const outputZip = path.resolve(__dirname, '../build.zip');

async function createZip() {
  try {
    // Check if build directory exists
    if (!fs.existsSync(buildDir)) {
      console.error(
        'Error: build directory does not exist. Run "npm run build" first.',
      );
      process.exit(1);
    }

    // Remove existing zip if it exists
    if (fs.existsSync(outputZip)) {
      fs.unlinkSync(outputZip);
      console.log('Removed existing build.zip');
    }

    const isWindows = process.platform === 'win32';

    let command;
    if (isWindows) {
      // Windows PowerShell command
      command = `powershell Compress-Archive -Path "${buildDir}\\*" -DestinationPath "${outputZip}" -Force`;
    } else {
      // Unix/Linux/macOS
      const buildDirName = path.basename(buildDir);
      const buildDirParent = path.dirname(buildDir);
      command = `cd "${buildDirParent}" && zip -r "${outputZip}" "${buildDirName}"`;
    }

    console.log('Creating zip archive...');
    const { stderr } = await execPromise(command);

    if (
      stderr &&
      !stderr.includes('adding:') &&
      !stderr.includes('Compress-Archive')
    ) {
      console.error('Warning:', stderr);
    }

    console.log(`✓ Created build.zip at ${outputZip}`);

    // Get file size
    const stats = fs.statSync(outputZip);
    console.log(`✓ Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('✓ Ready to upload to Chrome Web Store');
  } catch (error) {
    console.error('Error creating zip:', error.message);
    console.error(
      '\nIf you are on Windows, make sure PowerShell is available.',
    );
    console.error(
      'If you are on Unix/Linux/macOS, make sure the zip command is installed.',
    );
    process.exit(1);
  }
}

createZip();
