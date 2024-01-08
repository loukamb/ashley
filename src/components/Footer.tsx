/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import Icon from "./Icon.tsx"

import { Sonata } from "./ssr/Sonata.tsx"

function Footer({ rules }: { rules?: string }) {
  return (
    <footer id="footer">
      <div id="footer-links">
        <a href="#" onClick={() => (console.log("lol"), (window.scrollY = 0))}>
          <Icon inline="true" icon="fluent:arrow-up-20-regular" /> Top
        </a>
        <a href="https://github.com/mblouka/ashley" target="_blank">
          <Icon inline="true" icon="fluent:code-20-regular" /> Source
        </a>
        {rules && (
          <a href={rules}>
            <Icon inline="true" icon="fluent:book-globe-20-regular" /> Rules
          </a>
        )}
      </div>
    </footer>
  )
}

// Allow client hydration.
export default Sonata(Footer)
