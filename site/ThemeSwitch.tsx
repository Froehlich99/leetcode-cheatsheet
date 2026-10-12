import {useEffect,useState} from 'react'
export default function ThemeSwitch(){
  const [theme,setTheme]=useState<'dark'|'light'>(()=>{try{return localStorage.getItem('leetcode-theme')==='light'?'light':'dark'}catch{return 'dark'}})
  useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('leetcode-theme',theme)}catch{}document.documentElement.dispatchEvent(new Event('themeChange'))},[theme])
  return <button className="atlas-icon atlas-theme" aria-label={`Switch to ${theme==='dark'?'light':'dark'} mode`} onClick={()=>setTheme(t=>t==='dark'?'light':'dark')}>{theme==='dark'?<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>:<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z"/></svg>}</button>
}
