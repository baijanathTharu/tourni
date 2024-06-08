import Markdown from 'markdown-to-jsx';
import Editor from '@monaco-editor/react';
import { Navbar } from '../components/navbar';
import { str } from '../two-sum';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

export function PracticePage() {
  const [code, setCode] = useState(`function main(a: number, b: number) {

}`);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleRun = () => {
    console.log('code', code);
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
            <Button variant="bordered" onClick={handleRun}>
              Run
            </Button>
            <Editor
              height="60vh"
              theme="vs-light"
              defaultLanguage="typescript"
              defaultValue={code}
              onChange={handleEditorChange}
            />
          </section>
        </main>
      </div>
    </>
  );
}
