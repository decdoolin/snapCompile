"use client";
import React from 'react'
import { ModeToggleBtn } from './mode-toggle-btn'
import SelectLanguages from './SelectLanguages'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
  import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Play } from 'lucide-react';

export default function EditorComponent() {
  const {theme} =useTheme();
  return (
    <div className= "min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-8">
        {/* header */}
      <div className="flex items-center justify-between pb-3">
        <h2 className='scroll-m-20 pb-1 text-2xl font-semibold tracking-tight first:mt-0'>CodePoop</h2>
        <div className="flex items-center space-x-2">
            <ModeToggleBtn/>
            <div className="w-[230px]">
                <SelectLanguages/>
            </div>
        </div>
      </div>
      {/*Editor*/}
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl">
      <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border md:min-w-[450px] dark:bg-slate-900"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
      <Editor 
      theme = {theme==="dark"?"vs-dark":"vs-light"}
      height="90vh" 
      defaultLanguage="javascript" 
      defaultValue="// Begin typing here" 
      />
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
        <div className="flex items-center justify-between pb-3 bg-slate-400 dark:bg-slate-950 px-6 py-2">
            <h2>Output</h2>
            <Button size={"sm"} className="bg-purple-600 hover:bg-purple-700
            text-slate-100">
                <Play className = "w-3 h-4 mr-2"/>
                <span>Run</span>
            </Button>
        </div>
        <div className="px-6">
            <h2>Hello World!</h2>
        </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
      </div>
    </div>
  )
}
