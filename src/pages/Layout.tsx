/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 05/01/2024
 */

import React from "react"

import { Session } from "../session.ts"
import Configuration from "../configuration.ts"

import Header from "../components/Header.tsx"
import Footer from "../components/Footer.tsx"

export default async function Layout({
  session,
  contents,
  helmet,
  params,
}: {
  session?: Session
  helmet: React.ReactNode[]
  contents: string
  params: { config: Configuration }
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/theme.css" />

        {helmet}
      </head>
      <body>
        <Header config={params.config} />
        {/*HACK: Have to do this due to components/UniqueContext. */}
        <main dangerouslySetInnerHTML={{ __html: contents }} />
        <Footer config={params.config} />
      </body>
    </html>
  )
}
