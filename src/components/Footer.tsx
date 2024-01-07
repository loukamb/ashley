/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import Configuration from "@/config.ts"

import Aqueduct from "./Aqueduct.tsx"

export default function Footer({ config }: { config?: Configuration }) {
  return (
    <Aqueduct name="footer">
      <footer id="footer">
        {/* TODO: Figure out what else to put in here. */}
        <div id="footer-links">
          <a
            href="#"
            onClick={() => (console.log("lol"), (window.scrollY = 0))}
          >
            Top
          </a>
          <a href="https://github.com/mblouka/ashley" target="_blank">
            Source
          </a>
        </div>
      </footer>
    </Aqueduct>
  )
}
