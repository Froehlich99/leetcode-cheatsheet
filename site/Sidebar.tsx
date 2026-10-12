import styles from './Sidebar.module.sass'
import {RefObject,useEffect,useRef} from 'react'
import {useMediaQuery} from 'react-responsive'
import {useSidebar} from '@components/Sidebar/SidebarProvider'
import SidebarLinks from './SidebarLinks'
interface Props{hamburgerButtonRef:RefObject<HTMLDivElement>}
export default function Sidebar({hamburgerButtonRef}:Props){
  const {isSidebarOpen,hideSidebar,showSidebar}=useSidebar()
  const mobile=useMediaQuery({maxWidth:768},undefined,(matches)=>{if(matches)hideSidebar();else showSidebar()})
  const closeRef=useRef<HTMLButtonElement>(null)
  useEffect(()=>{if(!mobile||!isSidebarOpen)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';closeRef.current?.focus({preventScroll:true});const key=(e:KeyboardEvent)=>{if(e.key==='Escape')hideSidebar()};window.addEventListener('keydown',key);return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key)}},[mobile,isSidebarOpen])
  return <nav aria-label="Algorithm navigation" id="atlas-navigation" aria-hidden={!isSidebarOpen} inert={!isSidebarOpen} className={`atlas-sidebar ${!isSidebarOpen?'is-closed':''} ${styles.sidebar}`}>
    <div className="atlas-sheet-header"><span>Browse topics</span><button ref={closeRef} onClick={()=>hideSidebar()} aria-label="Close navigation">✕</button></div>
    <div className={styles.scrollContainer}><SidebarLinks/></div>
  </nav>
}
