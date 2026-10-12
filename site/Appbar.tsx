import {useRef} from 'react'
import Topbar from '@/components/Topbar/Topbar'
import Sidebar from '@/components/Sidebar/Sidebar'
import {useSidebar} from '@components/Sidebar/SidebarProvider'
export default function Appbar(){
  const button=useRef<HTMLDivElement>(null)
  const {isSidebarOpen,hideSidebar}=useSidebar()
  return <div id="AppBar"><Topbar forwardedRef={button}/>{isSidebarOpen && <button className="atlas-backdrop" aria-label="Close navigation" onClick={()=>hideSidebar()}/>}<Sidebar hamburgerButtonRef={button}/></div>
}
