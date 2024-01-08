/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

/**
 * Defines the SonataProperties component, which is used on the client to
 * retrieve props for each component's aqueduct hydration.
 */

export type SonataComponentProperties = Record<string, any>
export type SonataConfig = Record<
  string,
  [{ id: number; props: SonataComponentProperties }]
>

export default function SonataProperties({ props }: { props: SonataConfig }) {
  // @ts-ignore
  return <ashley-sonata-config>{JSON.stringify(props)}</ashley-sonata-config>
}
