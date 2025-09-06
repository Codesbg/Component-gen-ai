/*import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  // ✅ Fixed typos in options
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // ⚠️ API Key (you said you want it inside the file)
  const ai = new GoogleGenAI({
    apiKey: "API KEY "
  });

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        
        <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5">
          <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
          <p className='text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                color: "#fff",
                boxShadow: "none",
                "&:hover": { borderColor: "#555" }
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                color: "#fff"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#333"
                  : state.isFocused
                    ? "#222"
                    : "#111",
                color: "#fff",
                "&:active": { backgroundColor: "#444" }
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" })
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-gray-400 text-sm'>Click on generate button to get your code</p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        
        <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                  <HiOutlineCode />
                </div>
                <p className='text-[16px] text-gray-400 mt-3'>Your component & code will appear here.</p>
              </div>
            ) : (
              <>
              
                <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4">
                  <p className='font-bold text-gray-200'>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><IoCopy /></button>
                        <button onClick={downnloadFile} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><PiExportBold /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]"><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-full">
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme='vs-dark' language="html" />
                  ) : (
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

  
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home*/
import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDvPvlZN_Dwt29orAeZxzeDkbsxzcMOYkU"
  });

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  
        `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16 mt-8">
        
        {/* LEFT PANEL */}
        <div className="w-full py-6 rounded-xl bg-gradient-to-b from-[#1c1b22] to-[#141319] shadow-lg border border-zinc-800 p-6 animate-fadeIn">
          <h3 className='text-[25px] font-bold text-white flex items-center gap-2'>
            <BsStars className="text-purple-400 animate-pulse" /> 
            AI Component Generator
          </h3>
          <p className='text-gray-400 mt-2 text-[16px]'>Describe your component and let AI code it for you.</p>

          <p className='text-[15px] font-semibold mt-6 text-gray-200'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderColor: "#333",
                borderRadius: "0.75rem",
                color: "#fff",
                padding: "2px",
                boxShadow: "none",
                "&:hover": { borderColor: "#666" }
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111",
                borderRadius: "0.5rem",
                color: "#fff"
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#7e22ce"
                  : state.isFocused
                    ? "#222"
                    : "#111",
                transition: "all 0.2s ease",
                color: "#fff",
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" })
            }}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-[15px] font-semibold mt-6 text-gray-200'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all'
            placeholder="Describe your component in detail and AI will generate it..."
          ></textarea>

          <div className="flex items-center justify-between mt-4">
            <p className='text-gray-400 text-sm'>Click on generate button to get your code</p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-5 gap-2 text-white font-medium transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative mt-2 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden shadow-lg border border-zinc-800 animate-slideUp">
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center">
                <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg animate-bounce">
                  <HiOutlineCode />
                </div>
                <p className='text-[16px] text-gray-400 mt-3 animate-fadeIn'>Your component & code will appear here.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg transition-all duration-200 ${tab === 1 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg transition-all duration-200 ${tab === 2 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4 border-b border-zinc-800">
                  <p className='font-bold text-gray-200'>Code Editor</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} className="w-10 h-10 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-[#2a2a2a] transition"><IoCopy /></button>
                        <button onClick={downnloadFile} className="w-10 h-10 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-[#2a2a2a] transition"><PiExportBold /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} className="w-10 h-10 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-[#2a2a2a] transition"><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} className="w-10 h-10 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-[#2a2a2a] transition"><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-full">
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme='vs-dark' language="html" />
                  ) : (
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* FULL PREVIEW NEW TAB */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-gray-200 transition">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home
