import Docker from 'dockerode';
import { Readable } from 'stream';

const docker = new Docker();

export async function runCodeInContainer(
  code: string
): Promise<{ stdout: string; stderr: string }> {
  const container = await docker.createContainer({
    Image: 'lcode-executor',
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    OpenStdin: true,
    StdinOnce: true,
  });

  const stream = await container.attach({
    stream: true,
    stdin: true,
    stdout: true,
    stderr: true,
  });

  return new Promise((resolve, reject) => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    stream.on('data', (chunk: Buffer) => stdoutChunks.push(chunk.toString()));
    stream.on('stderr', (chunk: Buffer) => stderrChunks.push(chunk.toString()));
    stream.on('end', () => {
      resolve({ stdout: stdoutChunks.join(''), stderr: stderrChunks.join('') });
    });

    stream.on('error', reject);

    const codeStream = new Readable();
    codeStream.push(code);
    codeStream.push(null);
    codeStream.pipe(stream);

    container.start().then(() => {
      container.wait().then(() => {
        container.remove();
      });
    });
  });
}
