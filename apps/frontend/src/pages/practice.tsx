import Markdown from 'markdown-to-jsx';
import Editor from '@monaco-editor/react';
import { Navbar } from '../components/navbar';
import { str } from '../two-sum';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { client } from '../app/query-client';
import { useSocket } from '../app/socket';

export function PracticePage() {
  const { socket, isConnected } = useSocket();

  const [code, setCode] = useState(`function main(a: number, b: number) {

}`);

  console.log('isConnected', isConnected);

  const runCode = client.tournaments.runCode.useMutation();

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleRun = async () => {
    console.log('code', code);
    await runCode.mutateAsync(
      {
        body: {
          code,
        },
      },
      {
        onSuccess(data) {
          console.log('success', data);
        },
        onError(error) {
          console.log('error', error);
        },
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="m-4">
        <main className="grid grid-cols-2">
          <section className="border-2 p-4 prose">
            <Markdown options={{ wrapper: 'article', forceBlock: true }}>
              {str}
            </Markdown>
          </section>
          <section className="border-2 p-4">
            <Button
              disabled={runCode.isPending}
              variant="bordered"
              onClick={handleRun}
            >
              {runCode.isPending ? 'Running...' : 'Run'}
            </Button>
            <Editor
              height="60vh"
              theme="vs-light"
              defaultLanguage="typescript"
              defaultValue={code}
              onChange={handleEditorChange}
            />
            {runCode.isSuccess ? (
              <pre>
                Test Cases: {JSON.stringify(runCode.data?.body.data, null, 2)}
              </pre>
            ) : null}
          </section>
        </main>
      </div>
    </>
  );
}
