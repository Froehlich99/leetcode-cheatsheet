import { RefObject } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSidebar } from '@components/Sidebar/SidebarProvider'
import ThemeSwitch from '@components/ThemeSwitch/ThemeSwitch'
import SearchDialog from './SearchDialog'

interface TopbarProps { forwardedRef: RefObject<HTMLDivElement> }
export default function Topbar({forwardedRef}:TopbarProps) {
  const {isSidebarOpen,toggleSidebar}=useSidebar()
  const mobile=useMediaQuery({maxWidth:768})
  return <>
    <header className="atlas-topbar"><div className="atlas-topbar-inner">
      <a className="atlas-brand" href="#top">LeetCode Cheatsheet</a>
      <div className="atlas-topbar-actions">
        {!mobile && <SearchDialog/>}
        <a className="atlas-icon" aria-label="GitHub repository" href="https://github.com/Froehlich99/leetcode-cheatsheet" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.82c.56.1.77-.24.77-.54v-2.14c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.52-2.5-.28-5.14-1.25-5.14-5.57 0-1.23.44-2.23 1.16-3.01-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.67 10.67 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.12 2.96.72.78 1.15 1.78 1.15 3.01 0 4.33-2.65 5.28-5.16 5.56.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg></a>
        <ThemeSwitch/>
      </div>
    </div></header>
    {mobile && <nav className="atlas-bottom" aria-label="Mobile navigation">
      <div ref={forwardedRef}><button className="atlas-bottom-button" aria-expanded={isSidebarOpen} onClick={()=>toggleSidebar()}><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg> Browse</button></div>
      <SearchDialog/>
    </nav>}
  </>
}
