/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import { ComponentChildren } from "preact"

import { Session } from "@/server/session.ts"
import { ReadonlyPreferences } from "@/server/preferences.ts"
import Configuration from "@/config.ts"

import Header from "../Header.tsx"
import Footer from "../Footer.tsx"
import SonataProperties, { SonataConfig } from "../ssr/SonataProperties.tsx"

export default async function Layout({
  session,
  contents,
  helmet,
  sonata,
  params,
}: {
  session?: Session
  helmet: ComponentChildren[]
  contents: string
  sonata: SonataConfig
  params: { config: Configuration; prefs: ReadonlyPreferences }
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/theme.css" />
        <script src="/index.js" defer />
        {helmet}
      </head>
      <body>
        <Header config={params.config} />
        {/*HACK: Have to do this due to @/components/UniqueContext. */}
        <main dangerouslySetInnerHTML={{ __html: contents }} />
        <Footer rules={params.prefs.rules} />
        <SonataProperties props={sonata} />
      </body>
    </html>
  )
}
