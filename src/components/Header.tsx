/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import Configuration from "@/config.ts"

export default function Header({ config }: { config: Configuration }) {
  return (
    <header>
      <div id="header-contents">
        <div id="site-id">
          <div id="site-name">{config.name}</div>
          {config.description && <div id="site-desc">{config.description}</div>}
        </div>
      </div>
    </header>
  )
}
