import { Section } from "@/forums/section.ts"
import { Sonata } from "./ssr/Sonata.tsx"

import { useState, useCallback } from "preact/hooks"

function Section({
  src,
  hidden,
  index,
}: {
  src: Section
  hidden?: boolean
  index?: boolean
}) {
  /**
   * Allow user to hide section when we are on the index. This should save.
   * TODO: Load section hidden parameters on the client.
   */
  const [sectionHidden, setSectionHidden] = useState(hidden ?? false)

  const toggleSectionDisplay = useCallback(async () => {
    // TODO: Save preferences locally.
    setSectionHidden((v) => !v)
  }, [])

  /**
   * Note: The use of the "section" element here is unrelated to the component.
   * We just use the section tag to define a well-defined section of the site layout.
   */
  return (
    <section class="forum-section">
      <div class="forum-section-header">
        <div class="forum-section-description">
          <div class="forum-section-name">{src.name}</div>
          {src.description && (
            <div class="forum-section-description">{src.description}</div>
          )}
        </div>
        {index === true && <button onClick={toggleSectionDisplay}></button>}
      </div>
      {!sectionHidden && (
        <div class="forum-section-contents">
          {src.sections && <div class="forum-section-subsections"></div>}
          {src.threads && index !== true && (
            <div class="forum-section-threads"></div>
          )}
        </div>
      )}
    </section>
  )
}

// Allow client hydration.
export default Sonata(Section)
