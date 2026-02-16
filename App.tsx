
import React, { useState, useRef, useEffect } from 'react';
import { IconWrapper } from './components/IconWrapper';
import { COURSE_MODULES as INITIAL_MODULES } from './constants';
import { Module } from './types';

// Tipos para o sistema de blocos estilo Canva
type BlockType = 'HEADING' | 'SUBHEADING' | 'PARAGRAPH' | 'IMAGE' | 'LIST';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  items?: string[]; // Para listas
}

interface ExtendedModule extends Module {
  blocks?: ContentBlock[];
}

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [activeViewModule, setActiveViewModule] = useState<ExtendedModule | null>(null);

  // Estados do Modo Editor (ADM)
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isAdmModalOpen, setIsAdmModalOpen] = useState(false);
  const [admPasswordInput, setAdmPasswordInput] = useState('');
  const [admError, setAdmError] = useState(false);
  
  // Inicializa os módulos do localStorage
  const [modules, setModules] = useState<ExtendedModule[]>(() => {
    const saved = localStorage.getItem('autoeletro_modules_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MODULES;
      }
    }
    return INITIAL_MODULES;
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUnlock = () => {
    if (passwordInput === 'cursoauto') {
      setIsUnlocked(true);
      setIsModalOpen(false);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleAdmUnlock = () => {
    if (admPasswordInput === 'ADM') {
      setIsEditorMode(true);
      setIsAdmModalOpen(false);
      setAdmError(false);
      setAdmPasswordInput('');
    } else {
      setAdmError(true);
    }
  };

  // Funções do Editor de Blocos
  const addBlock = (type: BlockType) => {
    if (!activeViewModule) return;
    
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'HEADING' ? 'NOVO TÍTULO GIGANTE' : 
               type === 'SUBHEADING' ? 'Subtítulo do conteúdo' :
               type === 'LIST' ? '' : 'Clique aqui para escrever o seu texto...',
      items: type === 'LIST' ? ['Novo item da lista'] : undefined
    };

    const updatedBlocks = [...(activeViewModule.blocks || []), newBlock];
    updateModuleField(activeViewModule.id, 'blocks', updatedBlocks);
  };

  const updateBlockContent = (blockId: string, newContent: string) => {
    if (!activeViewModule) return;
    const updatedBlocks = (activeViewModule.blocks || []).map(b => 
      b.id === blockId ? { ...b, content: newContent } : b
    );
    updateModuleField(activeViewModule.id, 'blocks', updatedBlocks);
  };

  const removeBlock = (blockId: string) => {
    if (!activeViewModule) return;
    const updatedBlocks = (activeViewModule.blocks || []).filter(b => b.id !== blockId);
    updateModuleField(activeViewModule.id, 'blocks', updatedBlocks);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeViewModule) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const newBlock: ContentBlock = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'IMAGE',
          content: base64Data
        };
        const updatedBlocks = [...(activeViewModule.blocks || []), newBlock];
        updateModuleField(activeViewModule.id, 'blocks', updatedBlocks);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateModuleField = (id: number, field: keyof ExtendedModule, value: any) => {
    const updatedModules = modules.map(m => m.id === id ? { ...m, [field]: value } : m);
    setModules(updatedModules);
    const updatedActive = updatedModules.find(m => m.id === id);
    if (updatedActive) setActiveViewModule(updatedActive);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('autoeletro_modules_v2', JSON.stringify(modules));
      alert("CONTEÚDO SALVO COM SUCESSO!");
    } catch (e) {
      alert("Erro ao salvar: Espaço insuficiente no navegador.");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {/* Hidden ADM Access */}
      <div 
        onClick={() => setIsAdmModalOpen(true)}
        className="fixed bottom-0 left-0 w-4 h-4 z-[200] cursor-pointer opacity-0 hover:opacity-100 hover:bg-green-500 transition-all rounded-tr-full flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-white rounded-full"></div>
      </div>

      {isEditorMode && (
        <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3">
          <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-4 rounded-full square-text text-sm shadow-2xl hover:bg-blue-700 transition-all border-2 border-white/20 active:scale-95 animate-in slide-in-from-bottom-4 duration-300">
            SALVAR ALTERAÇÕES
          </button>
          <div className="bg-green-600 text-white px-6 py-3 rounded-full square-text text-xs shadow-2xl flex items-center gap-3 border-2 border-white/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            MODO EDITOR ATIVO
            <button onClick={() => setIsEditorMode(false)} className="ml-2 hover:text-red-200">(SAIR)</button>
          </div>
        </div>
      )}

      {/* Canva Style Modal (ISOLADO) */}
      {activeViewModule && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[40px] md:backdrop-blur-[60px]" onClick={() => setActiveViewModule(null)}></div>
          
          <div className="relative w-full max-w-6xl h-full md:h-[95vh] bg-white shadow-[0_50px_100px_rgba(0,0,0,0.3)] md:rounded-[40px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            
            <div className="bg-white px-8 py-6 flex justify-between items-center z-20 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">
                  Módulo {activeViewModule.id < 10 ? `0${activeViewModule.id}` : activeViewModule.id} • {isEditorMode ? 'EDITOR DE CONTEÚDO' : 'MATERIAL DE ESTUDO'}
                </span>
                <h4 className="square-text text-lg text-gray-800">{activeViewModule.title}</h4>
              </div>
              <button onClick={() => setActiveViewModule(null)} className="relevo-btn w-12 h-12 md:w-16 md:h-16 rounded-full transition-all hover:scale-110 active:scale-95 flex items-center justify-center">
                <span className="square-text text-3xl text-gray-800 blink-icon select-none">X</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-8 md:p-20 relative scroll-smooth">
              <div className="max-w-4xl mx-auto space-y-12 pb-32">
                {(!activeViewModule.blocks || activeViewModule.blocks.length === 0) && (
                  <div className="text-center py-20">
                    <IconWrapper name="BookOpen" className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                    <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Sem conteúdo definido ainda.</p>
                  </div>
                )}

                {activeViewModule.blocks?.map((block) => (
                  <div key={block.id} className="group relative">
                    {isEditorMode && (
                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="absolute -left-12 top-0 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                      >
                        <IconWrapper name="Zap" className="w-4 h-4 rotate-45" />
                      </button>
                    )}

                    {block.type === 'HEADING' && (
                      <h2 
                        contentEditable={isEditorMode}
                        onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                        suppressContentEditableWarning
                        className={`square-text text-5xl md:text-8xl text-gray-900 leading-[0.9] tracking-tighter outline-none ${isEditorMode ? 'hover:bg-blue-50 focus:bg-blue-50 transition-colors p-2' : ''}`}
                      >
                        {block.content}
                      </h2>
                    )}

                    {block.type === 'SUBHEADING' && (
                      <h3 
                        contentEditable={isEditorMode}
                        onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                        suppressContentEditableWarning
                        className={`square-text text-2xl md:text-4xl text-blue-600 outline-none ${isEditorMode ? 'hover:bg-blue-50 focus:bg-blue-50 transition-colors p-2' : ''}`}
                      >
                        {block.content}
                      </h3>
                    )}

                    {block.type === 'PARAGRAPH' && (
                      <p 
                        contentEditable={isEditorMode}
                        onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                        suppressContentEditableWarning
                        className={`text-gray-600 text-lg leading-relaxed outline-none ${isEditorMode ? 'hover:bg-blue-50 focus:bg-blue-50 transition-colors p-2' : ''}`}
                      >
                        {block.content}
                      </p>
                    )}

                    {block.type === 'LIST' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                          <p 
                            contentEditable={isEditorMode}
                            onBlur={(e) => updateBlockContent(block.id, e.currentTarget.innerText)}
                            suppressContentEditableWarning
                            className={`square-text text-xl text-gray-800 flex-1 outline-none ${isEditorMode ? 'hover:bg-blue-50 p-1' : ''}`}
                          >
                            {block.content || 'Novo Tópico'}
                          </p>
                        </div>
                      </div>
                    )}

                    {block.type === 'IMAGE' && (
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img src={block.content} alt="Material" className="w-full h-auto object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditorMode && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl px-8 py-4 rounded-full flex gap-6 items-center z-50">
                  <button onClick={() => addBlock('HEADING')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 relevo-btn rounded-xl flex items-center justify-center group-hover:text-blue-600"><span className="font-black">T1</span></div>
                    <span className="text-[8px] font-black">TÍTULO</span>
                  </button>
                  <button onClick={() => addBlock('SUBHEADING')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 relevo-btn rounded-xl flex items-center justify-center group-hover:text-blue-600"><span className="font-black">T2</span></div>
                    <span className="text-[8px] font-black">SUB</span>
                  </button>
                  <button onClick={() => addBlock('PARAGRAPH')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 relevo-btn rounded-xl flex items-center justify-center group-hover:text-blue-600"><IconWrapper name="BookOpen" className="w-4 h-4" /></div>
                    <span className="text-[8px] font-black">TEXTO</span>
                  </button>
                  <button onClick={() => addBlock('LIST')} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 relevo-btn rounded-xl flex items-center justify-center group-hover:text-blue-600"><IconWrapper name="Zap" className="w-4 h-4" /></div>
                    <span className="text-[8px] font-black">TÓPICO</span>
                  </button>
                  <div className="w-px h-8 bg-gray-100 mx-2"></div>
                  <button onClick={() => imageInputRef.current?.click()} className="flex flex-col items-center gap-1 group">
                    <div className="w-10 h-10 relevo-btn rounded-xl flex items-center justify-center group-hover:text-blue-600 bg-blue-50"><IconWrapper name="Cpu" className="w-4 h-4" /></div>
                    <span className="text-[8px] font-black text-blue-600">IMAGEM</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main UI Restoration */}
      <div className={`fixed inset-0 z-[60] transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={toggleMenu}></div>
        <div className="absolute right-0 top-0 h-full w-[80%] bg-white/95 backdrop-blur-2xl shadow-2xl p-10 flex flex-col border-l border-white/20">
          <div className="flex justify-end mb-16">
            <button onClick={toggleMenu} className="relevo-btn p-4 rounded-xl"><span className="square-text text-xl">X</span></button>
          </div>
          <div className="flex flex-col gap-10 mt-10">
            <a href="#modulos" onClick={toggleMenu} className="square-text text-4xl text-gray-800">BLOCO 1</a>
            <button onClick={() => { toggleMenu(); setIsModalOpen(true); }} className="square-text text-4xl text-left text-gray-800">BLOCO 2</button>
            <button onClick={() => { toggleMenu(); setIsModalOpen(true); }} className="square-text text-4xl text-left text-gray-800">CONCLUSÃO</button>
            <div className="h-px w-full bg-gray-200 my-4"></div>
            <button onClick={() => { toggleMenu(); setIsModalOpen(true); }} className="relevo-btn py-6 rounded-2xl square-text text-2xl text-blue-600 text-center">Acesso Completo</button>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 pb-20 ${isModalOpen || activeViewModule ? 'blur-md overflow-hidden pointer-events-none h-screen' : ''}`}>
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[70%] z-50">
          <div className="hidden md:flex bg-white/40 backdrop-blur-xl border border-white/40 py-4 px-10 rounded-full justify-between items-center shadow-lg">
            {/* LOGO PREMIUM MINIMALISTA - TEXTO COM DEGRADÊ PRETO E AZUL (VERSÃO QUADRADA E ESPAÇADA) */}
            <div className="shrink-0 cursor-default">
              <span className="text-xl font-black tracking-[0.45em] uppercase bg-gradient-to-r from-black via-gray-900 to-blue-700 bg-clip-text text-transparent select-none">
                AutoEletro
              </span>
            </div>

            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 items-center">
              <a href="#modulos" className="hover:text-blue-600 transition-colors">BLOCO 1</a>
              <button onClick={() => setIsModalOpen(true)} className="hover:text-blue-600 transition-colors">BLOCO 2</button>
              <button onClick={() => setIsModalOpen(true)} className="hover:text-blue-600 transition-colors">CONCLUSÃO</button>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="relevo-btn px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600">Acesso Completo</button>
          </div>
          <div className="flex md:hidden bg-white/40 backdrop-blur-xl border border-white/40 py-3 px-6 rounded-full justify-between items-center shadow-lg">
            <button onClick={toggleMenu} className="relevo-btn p-2 rounded-xl animate-pulse-menu flex flex-col gap-1.5 justify-center items-center w-12 h-12">
               <div className="w-6 h-0.5 bg-gray-800 rounded-full animate-pulse-line"></div>
               <div className="w-6 h-0.5 bg-gray-800 rounded-full animate-pulse-line"></div>
               <div className="w-6 h-0.5 bg-gray-800 rounded-full animate-pulse-line"></div>
            </button>
            <button onClick={() => setIsModalOpen(true)} className="relevo-btn px-4 py-2 rounded-full square-text text-sm text-blue-600">LIBERAR ACESSO</button>
          </div>
        </nav>

        <header className="pt-56 pb-40 px-6 overflow-hidden">
          <div className="container mx-auto max-w-7xl flex flex-col items-center text-center">
            {/* RESTAURAÇÃO DO TICKER - LOOP INFINITO SEM ESPAÇOS */}
            <div className="ticker-wrap mb-16 max-w-3xl mx-auto rounded-full">
              <div className="ticker-content">
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                {/* Duplicação para efeito de loop infinito suave */}
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
                <span className="ticker-item">ACESSO PREMIUM LIBERADO</span>
              </div>
            </div>
            
            <div className="reflect-effect mb-32">
              <h1 className="square-text text-6xl md:text-[11rem] premium-shine leading-none tracking-[0.05em]">CURSO DE<br/>ELÉTRICA</h1>
            </div>

            {/* RESTAURAÇÃO DO TEXTO DO CABEÇALHO */}
            <div className="max-w-2xl mt-12">
              <p className="text-gray-400 font-semibold uppercase tracking-[0.2em] text-sm leading-loose">
                O domínio absoluto da tecnologia automotiva através de um design de aprendizado sofisticado e preciso.
              </p>
            </div>
          </div>
        </header>

        {/* BLOCO 1 */}
        <section id="modulos" className="py-32 container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-24">
              <h2 className="square-text text-5xl md:text-7xl mb-6">BLOCO 1</h2>
              <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {modules.slice(0, 6).map((module) => (
                <div key={module.id} className="relevo-outer p-12 flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-16">
                    <div className="relevo-inner w-16 h-16 flex items-center justify-center"><span className="text-blue-600 font-black text-xl italic select-none">EP{module.id}</span></div>
                    <span className="square-text text-2xl md:text-3xl text-gray-200 group-hover:text-blue-100 transition-colors select-none">MÓDULO 0{module.id}</span>
                  </div>
                  <h3 className="square-text text-2xl mb-6 text-gray-800 tracking-tighter">{module.title}</h3>
                  <p className="text-gray-400 font-medium mb-10 flex-grow">{module.description}</p>
                  <div className="flex justify-center items-center gap-4 pt-4">
                    <button 
                      onClick={() => setActiveViewModule(module)} 
                      className="btn-iniciar-blink btn-iniciar-relevo px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white"
                    >
                      Iniciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA INTERMEDIÁRIO */}
        <section className="py-24 container mx-auto px-6">
          <div className="relevo-outer max-w-5xl mx-auto overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] rounded-full"></div>
            <div className="p-16 md:p-24 flex flex-col items-center text-center relative z-10">
              <h2 className="square-text text-4xl md:text-6xl mb-8">Transforme seu Futuro</h2>
              <p className="text-gray-400 max-w-xl font-medium uppercase tracking-widest mb-12">Aprenda com quem domina a técnica e a prática no mercado de alto luxo e performance.</p>
              <button onClick={() => setIsModalOpen(true)} className="relevo-btn px-16 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-blue-600 hover:scale-105 transition-all">Garantir minha Vaga</button>
            </div>
          </div>
        </section>

        {/* BLOCOS BLOQUEADOS */}
        <div className={`transition-all duration-700 ${!isUnlocked ? 'blur-[6px] opacity-60 select-none pointer-events-none' : 'blur-0 opacity-100'}`}>
          <section id="modulos-2" className="py-32 container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center mb-24">
                <h2 className="square-text text-5xl md:text-7xl mb-6">BLOCO 2</h2>
                <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {modules.slice(6, 12).map((module) => (
                  <div key={module.id} className="relevo-outer p-12 flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-16">
                      <div className="relevo-inner w-16 h-16 flex items-center justify-center"><span className="text-blue-600 font-black text-xl italic select-none">EP{module.id}</span></div>
                      <span className="square-text text-2xl md:text-3xl text-gray-200">MÓDULO {module.id}</span>
                    </div>
                    <h3 className="square-text text-2xl mb-6 text-gray-800 tracking-tighter">{module.title}</h3>
                    <p className="text-gray-400 font-medium mb-10 flex-grow">{module.description}</p>
                    <div className="flex justify-center items-center gap-4 pt-4">
                      <button onClick={() => setActiveViewModule(module)} className="btn-iniciar-blink btn-iniciar-relevo px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white">Iniciar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="modulos-3" className="py-32 container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center mb-24">
                <h2 className="square-text text-5xl md:text-7xl mb-6">CONCLUSÃO</h2>
                <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {modules.slice(12, 18).map((module) => (
                  <div key={module.id} className="relevo-outer p-12 flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-16">
                      <div className="relevo-inner w-16 h-16 flex items-center justify-center"><span className="text-blue-600 font-black text-xl italic select-none">EP{module.id}</span></div>
                      <span className="square-text text-2xl md:text-3xl text-gray-200">MÓDULO {module.id}</span>
                    </div>
                    <h3 className="square-text text-2xl mb-6 text-gray-800 tracking-tighter">{module.title}</h3>
                    <p className="text-gray-400 font-medium mb-10 flex-grow">{module.description}</p>
                    <div className="flex justify-center items-center gap-4 pt-4">
                      <button onClick={() => setActiveViewModule(module)} className="btn-iniciar-blink btn-iniciar-relevo px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white">Iniciar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* RODAPÉ */}
        <footer className="py-24 text-center container mx-auto px-6 border-t border-gray-200">
          <div className="mb-20 cursor-default">
            {/* LOGO PREMIUM MINIMALISTA - TEXTO COM DEGRADÊ PRETO E AZUL (VERSÃO QUADRADA E ESPAÇADA) */}
            <span className="text-xl font-black tracking-[0.45em] uppercase bg-gradient-to-r from-black via-gray-900 to-blue-700 bg-clip-text text-transparent select-none">
              AutoEletro
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            <div className="flex flex-col items-center gap-5">
              <div className="relevo-inner p-6 mb-2 blink-icon">
                <IconWrapper name="Award" className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div className="relevo-inner p-6 mb-2 blink-icon">
                <IconWrapper name="ShieldCheck" className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div className="relevo-inner p-6 mb-2 blink-icon">
                <IconWrapper name="Lock" className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ADM Modal */}
      {isAdmModalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="relevo-outer w-full max-w-sm p-10 bg-white animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="relevo-inner p-4 mb-8"><IconWrapper name="Lock" className="w-8 h-8 text-green-600" /></div>
              <h3 className="square-text text-2xl mb-2">MODO ADMINISTRADOR</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">ACESSO AO EDITOR DE CONTEÚDO</p>
              <div className="w-full space-y-4">
                <input 
                  type="password" autoFocus placeholder="SENHA ADM" value={admPasswordInput}
                  onChange={(e) => setAdmPasswordInput(e.target.value)}
                  className={`relevo-inner w-full px-6 py-4 text-center text-lg font-black tracking-widest focus:outline-none transition-all uppercase ${admError ? 'border-red-500 text-red-500' : ''}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdmUnlock()}
                />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => { setIsAdmModalOpen(false); setAdmPasswordInput(''); setAdmError(false); }} className="relevo-btn py-4 rounded-xl text-[10px] font-black uppercase">Cancelar</button>
                  <button onClick={handleAdmUnlock} className="bg-green-600 text-white py-4 rounded-xl text-[10px] font-black uppercase">Acessar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40">
          <div className="relevo-outer w-full max-w-md p-10 bg-gray-50 border border-white/50 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="relevo-inner p-4 mb-8"><IconWrapper name="Lock" className="w-8 h-8 text-blue-600" /></div>
              <h3 className="square-text text-3xl mb-4">Área Restrita</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Insira sua chave de acesso</p>
              <div className="w-full space-y-4">
                <input 
                  type="text" autoFocus placeholder="DIGITE A SENHA" value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`relevo-inner w-full px-6 py-4 text-center text-lg font-black tracking-widest focus:outline-none transition-all uppercase ${error ? 'border-red-500 text-red-500' : ''}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => { setIsModalOpen(false); setError(false); setPasswordInput(''); }} className="relevo-btn py-4 rounded-xl text-[10px] font-black uppercase">Voltar</button>
                  <button onClick={handleUnlock} className="bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase">Entrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
