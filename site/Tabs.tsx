import styles from './Tabs.module.sass'
import { Children, ReactElement, ReactNode, useLayoutEffect, useRef } from 'react'
import { useLanguage } from '@components/Language/LanguageProvider'
import Code from '@components/Code/Code'
import CopyButton from '@components/CopyButton/CopyButton'
import SvgPython from '@icons/Python'
import SvgJavascript from '@/icons/Javascript'
import SvgCpp from '@icons/Cpp'
import SvgLua from '@icons/Lua'
import SvgJava from '@/icons/Java'
import SvgRuby from '@/icons/Ruby'

type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'ruby' | 'lua'
interface Props { title: string; children: ReactNode }
interface TabProps { code: string; language: Language }
const icons = {python: SvgPython, javascript: SvgJavascript, java: SvgJava, cpp: SvgCpp, ruby: SvgRuby, lua: SvgLua}

export default function Tabs({title, children}: Props) {
    const {selectedLanguage, setSelectedLanguage} = useLanguage()
    const tabs = Children.toArray(children) as ReactElement<TabProps>[]
    const active = Math.max(0, tabs.findIndex(tab => tab.props.language === selectedLanguage))
    const current = tabs[active].props
    const cardRef = useRef<HTMLDivElement>(null)
    const previousTop = useRef<number | null>(null)

    // Preserve the position of the card the user interacted with even when
    // EVERY snippet changes its height (global language selection).
    useLayoutEffect(() => {
        if (previousTop.current === null || !cardRef.current) return
        const delta = cardRef.current.getBoundingClientRect().top - previousTop.current
        previousTop.current = null
        if (delta !== 0) window.scrollBy({top: delta, behavior: 'instant'})
    }, [selectedLanguage])

    const changeLanguage = (language: Language) => {
        if (language === selectedLanguage) return
        previousTop.current = cardRef.current?.getBoundingClientRect().top ?? null
        setSelectedLanguage(language)
    }

    return <div ref={cardRef} className={styles.container + ' atlas-card'}>
        <h3>{title}</h3>
        <div className={styles.buttonContainer + ' atlas-card-actions'}>
            <div role="tablist" aria-label="Programming language" className={styles.tabButtonContainer + ' atlas-language-list'}>
                {tabs.map((tab, index) => {
                    const Icon = icons[tab.props.language]
                    return <button key={tab.props.language} role="tab"
                        aria-label={`View ${tab.props.language} code`}
                        aria-selected={index === active}
                        className={styles.tabButton + ' atlas-language-tab'}
                        onClick={() => changeLanguage(tab.props.language)}><Icon/></button>
                })}
            </div>
            <CopyButton onClick={() => navigator.clipboard.writeText(current.code)}/>
        </div>
        <div role="tabpanel" className="tabs-content"><Code code={current.code} language={current.language}/></div>
    </div>
}
Tabs.Tab = (props: TabProps) => <>{props}</>
