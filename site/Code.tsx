import styles from './Code.module.sass'
import { useMemo, useRef, useState, MouseEvent } from 'react'
import clsx from '@utils/clsx'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import ruby from 'highlight.js/lib/languages/ruby'
import lua from 'highlight.js/lib/languages/lua'
import python from './Python'

hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('lua', lua)

interface CodeProps {
    code: string
    language: 'python' | 'javascript' | 'java' | 'cpp' | 'ruby' | 'lua'
}

export default function Code({ code, language }: CodeProps) {
    const ref = useRef<HTMLPreElement>(null)
    const [selectedLine, setSelectedLine] = useState<number | null>(null)

    // Highlight during render, not in an effect after paint. Otherwise every
    // snippet temporarily changes its height when the global language changes.
    const lines = useMemo(
        () => code.split('\n').map((line, i) => {
            const html = hljs.highlight(line, { language }).value
            return `<span class="${styles.line}" data-line-number="${i + 1}">${html}</span>`
        }).join(''),
        [code, language]
    )

    const handleClick = (event: MouseEvent<HTMLPreElement>) => {
        const target = event.target as HTMLElement
        const line = target.closest<HTMLSpanElement>('[data-line-number]')
        if (!line || !ref.current?.contains(line)) return
        const number = Number(line.dataset.lineNumber)
        setSelectedLine(previous => previous === number ? null : number)
    }

    return <pre ref={ref} onClick={handleClick}>
        <code
            className={clsx('hljs', language, styles.code)}
            dangerouslySetInnerHTML={{ __html: lines }}
            data-selected-line={selectedLine ?? undefined}
        />
    </pre>
}
