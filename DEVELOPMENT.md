# Development help

> [!NOTE]
> This document may refer to React, but note that Ashley uses preact instead. "React" is mainly used to describe the practices associated with JSX, which are most commonly associated with the React library.

## Server-side rendering

Ashley uses [preact](https://preactjs.com/) for the interface, but avoids SPA-ness by rendering all content on the server first through bog standard SSR. Afterwards, content on the page is _selectively_ hydrated using the Sonata system, which performs selective hydration using properties received from the server (without an extra request!). Only the portions of the page that actually need interactivity (under `ashley-sonata-aqueduct` web components) enter React's management and everything else is purely static.

### Building an interactive component

All components can be interactive (e.g. use `useEffect` and callbacks) and no code separation is necessary, _but_ they need to be registered for selective hydration. To build an interactive (hydratable) component, you must:

1. Wrap your component in a `Sonata(...)` call, which returns an hydratable component. 
2. Add your component to the `toBeHydrated` record under `components/ssr/client/SonataHydration.tsx`.

The [`Footer`](/src/components/Footer.tsx) component is a good example of how to use selective hydration. It simply wraps the component with the container, providing it a unique name, like so:
```tsx
export default Sonata(function Footer() {
    return (
        <footer>
            {/* ... */}
        </footer>
    }
})
```

Then it adds the entry to the `toBeHydrated` record in the [`SonataHydration.tsx`](/src/components/ssr/client/SonataHydration.tsx) file, like so:
```tsx
// Components that need hydration.
import Footer from "@/components/Footer.tsx"

// Components to be hydrated.
const toBeHydrated = { Footer, /*...*/ }
```

> [!TIP]
> The Sonata system will automatically serialize all component properties at render and forward them to the client through the `ashley-sonata-config` web component. **There is no need to manually pass properties, or retrieve them from the server with an additional request.**

### Asynchronous context on the server

Asynchronous server components (i.e. component functions defined as `async`) are difficult to work with when it comes to hooks. This normally shouldn't be a problem because server components shouldn't have any interactivity, and therefore shouldn't use any hooks, _but_ an important aspect of good React practice is to use [React context](https://react.dev/learn/passing-data-deeply-with-context) in order to avoid prop drilling, which requires the use of the `useContext` hook. The use of asynchronous components also further complicate the use of React context, essentially making the built-in solution impossible.

Ashley solves this problem by implementing [`AsyncContext`](/src/components/AsyncContext.tsx), which exports async-tolerant `createAsyncContext` and `useAsyncContext` functions. It leverages NodeJS's  [AsyncLocalStorage](https://nodejs.org/api/async_context.html#introduction) to safely create, and retrieve from, thread-local stores. To use asynchronous context, invoke `createContext` in a module to create an asynchronous context, and call `useContext` on its return value to consume the context in an asynchronous component.

To provide a value, you **must** use the `.enter` function in the context object, passing a value and an asynchronous function, then do all component rendering in the function that you pass. This replaces the use of the `Context.Provider` pseudo-element. Here is an example, based on the behavior in Ashley's SSR logic:
```js

import { renderToString } from "preact-render-to-string"
import { createAsyncContext, useAsyncContext } from "@/components/AsyncContext.tsx"

const themeContext = createAsyncContext()

async function MyComponent({}) {
    const theme = useAsyncContext(themeContext)
    return (
        <div data-theme={theme}>
            {/* ... */}
        </div>
    )
}

async function renderMyComponent() {
    let renderedString

    // The value of "themeContext" will be set to "dark".
    await themeContext.enter("dark", async () => {
        // Asynchronous components must be called manually.
        const componentValue = await MyComponent({})
        renderedString = renderToString(componentValue)
    })

    return renderedString
}
```

#### Asynchronous composites

If you have multiple context values that you want to access in your tree, you will find it difficult to access them since calling `asyncContext.enter` _while already_ in an asynchronous context will wipe the previous value and render it inaccessible, which breaks things. This is a limitation of Node's `AsyncLocalStorage`.

To fix this, you can use Ashley's asynchronous composites, which wraps our asynchronous context API with functions that allows multiple contexts to be "stiched" together then consumed anywhere in the tree. Use `createAsyncContextSegment` instead of `createAsyncContext` to create segments, then compose them together with `createAsyncContextComposite(...)`. That returns a composable context, which has a `.enter` function the same as normal standard contexts _except_ that you must pass all segments in a tuple instead of a single value. Then, a specialized `useAsyncContext` function can be retrieved from the composite using `useAsyncContextComposite`. For example:

```tsx
import { createAsyncContextSegment, createAsyncContextComposite, useAsyncContextComposite } from "@/components/AsyncComposite.tsx"

// Create theme and zoom segments.
const theme = createAsyncContextSegment<"dark" | "light">()
const zoom = createAsyncContextSegment<number>()

// Create a composite of both segments.
const composite = createAsyncContextComposite(theme, zoom)

// Component consuming the composite.
function MyComponent() {
    const useAsyncContext = useAsyncContextComposite(composite)
    const [themevalue, zoomvalue] = [useAsyncContext(theme), useAsyncContext(zoom)]
    return (<div>...</div>)
}

async function renderMyComponent() {
    let renderedString

    // Values of both context will be "dark" and "100".
    // Order of values must be the same as the order you passed
    // them in createAsyncContextComposite.
    await composite.enter(["dark", 100], async () => {
        // Asynchronous components must be called manually.
        const componentValue = await MyComponent({})
        renderedString = renderToString(componentValue)
    })

    return renderedString
}

```

## React vs. Preact

Ashley does not make use of the standard React library. Instead, the `preact` library is used, which is significantly tinier while offering more or less the same feature set and workflow as React. This is important, especially since we ship some reactivity to the client (and shipping React increases the bundle size by _a lot_).

Certain patterns may need to be changed if you are a React developer. While most of your JSX work will remain the same, you will have to mentally "rebind" some types and properties. Here's a few examples:

- `className` → `class`
  - React's JSX implementation doesn't allow the use of `class` attributes directly due to potential syntax conflicts with JavaScript (they also do this with `for`, for which they mandate the ugly `htmlFor`). However, this problem is only hypothetical and doesn't even exist because JSX parsers are, for the most part, intelligently written. Preact knows this and allows JSX to use `class` directly, as well as a bunch of other attributes that React forbids. [See here for details.](https://preactjs.com/guide/v10/differences-to-react#raw-html-attributeproperty-names)
- `React.ReactNode` → `ComponentChildren`
  - **React**:
    ```jsx
    import React from "react"

    function Component({ children }: { children: React.ReactNode }) {
        return <div>{children}</div>
    }
    ```
  - **preact**:
    ```jsx
    import { ComponentChildren } from "preact"

    function Component({ children }: { children: ComponentChildren }) {
        return <div>{children}</div>
    }
    ```
- `import { useState, ... } from "react"` → `import { useState, ... } from "preact/hooks"`
  - All hooks are found in `preact/hooks` instead of the main module. 

## Separation of concerns (server/browser)

Ashley client-only code is located in `/src/client` and `/src/component/ssr/client` (the latter needs to cohabit closely to the rest of the Sonata system under `/ssr`). That said, client-only code imports regularly from `/components` and therefore there could be incompatibilities, especially when it comes to Node modules being imported.

The build system can, per concern, automatically include and/or exclude blocks of code from compilation using a macro-like syntax defined in comments. To make sure a portion of code is compiled **only** on the browser, you can wrap your code with these comments:
```js
/// #ifdef BROWSER
function browserOnlyFunction() {}
/// #endif
```
Contrariwise, you can ensure code is only compiled on the server using `!`:
```js
/// #ifdef !BROWSER
function serverOnlyFunction() {}
/// #endif
```

`#if`, `#else`, `#elseif`/`#elif`, `#error` and `#warning` are also supported.

> [!CAUTION]
> **Please don't use this for security purposes.** If you have to use the macro system to enforce client↔server security, you are already doing something wrong. This is exclusively to resolve clashing dependencies/incompatibilities between code that's shared by both the client and the server.

