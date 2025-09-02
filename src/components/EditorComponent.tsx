"use client";
import React, { useRef, useState,} from 'react'
import { ModeToggleBtn } from './mode-toggle-btn'
import SelectLanguages, { selectedLanguageOptionProps } from './SelectLanguages'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {FileDown, Loader, OctagonAlert, Play, RotateCw, RotateCcw} from 'lucide-react';
import { codeSnippets, languageOptions } from '@/config/config';
import { compileCode } from '@/actions/compile';
import toast from 'react-hot-toast';
import * as monaco from 'monaco-editor';
import Footer from './Footer';
export interface CodeSnippetsProps {
  [key: string]: string;
}

export default function EditorComponent() {
  const {theme} =useTheme();
  const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
  const [languageOption,setLanguageOption]=useState(languageOptions[0]);
  const [loading,setLoading]=useState(false)
  const [output,setOutput]=useState([])
  const [userInput, setUserInput] = useState("")
  const [err,setErr]=useState(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState(`code.${languageOption.extension || 'txt'}`);
  
  const handleDownLoadClick = () => {
    setIsModalOpen((prev) => !prev);
  }

  const downloadCode = () => {
    let safeFileName = filename;
    if(safeFileName.length > 30){
      safeFileName = safeFileName.slice(0, 30);
    }

    if(!safeFileName.includes){
      safeFileName += '.txt';
    }
    const blob = new Blob([sourceCode], { type: 'text/plan' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsModalOpen(false);
  };

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.focus();
  }
  function handleOnChange(value: string | undefined){
    if(value){
      setSourceCode(value);
    }
  }
  function onSelect(value: selectedLanguageOptionProps){
    setLanguageOption(value);
    setSourceCode(codeSnippets[value.language]);
    setFilename(`code.${value.extension || 'txt'}`)
  }

  const undo = () => {
    editorRef.current?.trigger('source', 'undo', null);
  };

  const redo = () => {
    editorRef.current?.trigger('source', 'redo', null);
  };

  async function executeCode(){
    setLoading(true)
    setErr(false)
    const requestData = {
      language: languageOption.language,
      version: languageOption.version,
      files: [
        {
          content: sourceCode,
        }
      ],
      stdin: userInput,
    };
    try {
      const result = await compileCode(requestData)
      setOutput(result.run.output.split("\n"))
      console.log(result)
      setLoading(false)
      toast.success("Compiled Successfully")
    } catch (error) {
      setErr(true)
      setLoading(false)
      toast.error("Failed to compile the Code")
      console.log(error)
    }
  }
  return (
    <div className= "flex flex-col min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-8">
        {/* header */}
      <div className="flex items-center justify-between pb-3">
        <h2 className='scroll-m-20 pb-1 text-2xl font-semibold tracking-tight first:mt-0'>SnapCompile</h2>
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handleDownLoadClick} aria-label="Download Code">
              <FileDown className ="w-5 h-5 text-current hover:text-gray-500" />
            </Button>
            <Button variant="outline" size="icon" onClick={undo} aria-label="Undo">
                <RotateCcw className="w-5 h-5 text-current hover:text-gray-500" />
            </Button>
            <Button variant="outline" size="icon" onClick={redo} aria-label="Redo">
              <RotateCw className="w-5 h-5 text-current hover:text-gray-500" />
            </Button>
            <ModeToggleBtn/>
            <div className="w-[230px]">
                <SelectLanguages 
                onSelect={onSelect} 
                selectedLanguageOption={languageOption}
                />
            </div>
        </div>
      </div>
      {/* Download Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className = "modal-content">
            <h3 className="text-lg font-semibold">Save File</h3>
            <input
              type="text"
              value={filename}
              onChange={(e)=> {
                let value = e.target.value;
                if(value.length > 30){
                  alert("Please keep file name under 30 characters.");
                  value = value.slice(0,30);
                }
                setFilename(value)}}
              className="border rounded px-2 py-1 mt-2 w-full"
             
              placeholder="Enter file name"
              />
              <div className="flex justify-end space-x-2 py-2 mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="outline" onClick={downloadCode}>Download</Button>
              </div>
            </div>
          </div>
      )}
      {/* Input */}
      <div className="mt-4">
      <label htmlFor="input" className="block text-lg font-semibold mb-2">Input</label>
      <textarea 
       id="input"
       value={userInput}
       onChange={(e) => setUserInput(e.target.value)}
       className="w-full p-2 border rounded-lg bg-slate-400 dark:bg-slate-900 placeholder-slate-100"
       rows={1}
       placeholder="Enter arguments..."
  />    
</div>
      {/*Editor*/}
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl flex-grow overflow-hidden">
      <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border md:min-w-[450px] dark:bg-slate-900"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
      <Editor 
      theme = {theme==="dark"?"vs-dark":"vs-light"}
      height="100vh" 
      defaultLanguage={languageOption.language} 
      defaultValue={sourceCode}
      onMount={handleEditorDidMount}
      value={sourceCode}
      onChange={handleOnChange}
      language={languageOption.language}
      />
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
        <div className="flex items-center justify-between pb-3 bg-slate-400 dark:bg-slate-950 px-6 py-2">
            <h2>Output</h2>
            {loading?(
              <Button 
              disabled
              size={"sm"} 
              className="dark:bg-sky-950 dark:hover:bg-sky-900
              text-slate-100 bg-slate-800 hover:bg-slate-900">
                  <Loader className = "w-3 h-4 mr-2 animate-spin"/>
                  <span>Running please wait...</span>
              </Button>
            ):(
            <Button onClick={executeCode}
              size={"sm"} 
              className="dark:bg-sky-950 dark:hover:bg-sky-900
              text-slate-50 bg-slate-800 hover:bg-slate-900">
                  <Play className = "w-3 h-4 mr-2"/>
                  <span>Run</span>
              </Button>

            )}
          
        </div>
        <div className=" px-6 space-y-2">
            {err?(
              <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                <OctagonAlert className="w-5 h-5 mr-2 flex-shrink-0"/>

                <p className="">Failed to Compile the Code, Please try again!</p>
              </div>
            ):(
              <>
              {output.map((item)=>{
                return(
                  <p className="text-sm" key={item}>
                    {item}
                  </p>
                );
              })}
              </>
            )}
        </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
      </div>
      <Footer />
    </div>
  );
}
