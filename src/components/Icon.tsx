/**
 * Created by Louka MB. <https://github.com/mblouka>
 * 07/01/2024
 */

/**
 * Icon web component. Sends <iconify-icon> to the client,
 * client hydrates it locally.
 *
 * TODO: Implement icon drivers.
 */

import { PreactDOMAttributes, JSX } from "preact"
import { IconifyIconAttributes } from "iconify-icon"

export default function Icon(
  props: IconifyIconAttributes & PreactDOMAttributes & JSX.HTMLAttributes
) {
  //@ts-ignore
  return <iconify-icon {...props}></iconify-icon>
}
