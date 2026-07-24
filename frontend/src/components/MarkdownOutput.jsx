// Small, purpose-built parser for the markdown shape our backend prompts
// produce: ## / ### headings, **bold** text, and * / - bullet lists.
// Not a full markdown spec — just enough to render clean output live
// while text is still streaming in.

function parseInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="text-ink font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

function parseBlocks(text) {
  const lines = text.split('\n')
  const blocks = []
  let currentList = null

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: 'list', items: currentList })
      currentList = null
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushList()
      continue
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.*)/)
    if (headingMatch) {
      flushList()
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] })
      continue
    }

    const bulletMatch = line.match(/^[*-]\s+(.*)/)
    if (bulletMatch) {
      if (!currentList) currentList = []
      currentList.push(bulletMatch[1])
      continue
    }

    flushList()
    blocks.push({ type: 'paragraph', text: line })
  }

  flushList()
  return blocks
}

export default function MarkdownOutput({ text }) {
  const blocks = parseBlocks(text)

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const size = block.level <= 2 ? 'text-base' : 'text-sm'
          return (
            <h3
              key={i}
              className={`font-display ${size} text-amber font-semibold mt-4 first:mt-0 mb-1`}
            >
              {parseInline(block.text, `h${i}`)}
            </h3>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-1.5 ml-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-compass shrink-0">•</span>
                  <span>{parseInline(item, `li${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="leading-relaxed">
            {parseInline(block.text, `p${i}`)}
          </p>
        )
      })}
    </div>
  )
}