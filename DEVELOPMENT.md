# Development help

> 💡 This document may refer to React, but note that Ashley uses preact instead. "React" is mainly used to describe the practices associated with JSX, which are most commonly associated with the React library.

## Server-side rendering

Ashley uses [preact](https://preactjs.com/) for the interface, but avoids SPA-ness by rendering all content on the server first through bog standard SSR. Afterwards, content on the page is _selectively_ hydrated using Ashley's [aqueducts](https://en.wikipedia.org/wiki/Aqueduct_(water_supply)) on the server and the `<ashley-aqueduct/>` web component on the client. Only the portions of the page that actually need interactivity enter React's management and everything else is purely static.

### Building an interactive component

All components can be interactive (e.g. use `useEffect` and callbacks) and no code separation is necessary, _but_ they need to be registered for selective hydration. To build an interactive (hydratable) component, you must:

1. Wrap your component in an `<Aqueduct name="componentNameHere">{...}</Aqueduct>` container. Make sure to set `name` to a **unique** name for your component class.
2. Add your component to `Aqueducts` under `components/Aqueduct.tsx`. It is very straightforward, and an optional `getParams` async function can be added that will be invoked on the client to retrieve the params for your component.

The [`Footer`](/src/components/Footer.tsx) component is a good example of how to use Aqueduct selective hydration. It simply wraps the component with the container, providing it a unique name, like so:
```tsx
<Aqueduct name="footer">
    <footer>
        {/* ... */}
    </footer>
</Aqueduct>
```

Then it adds the entry to the `Aqueducts` variable in the [`Aqueduct.tsx`](/src/components/Aqueduct.tsx) file, like so:
```tsx
import Footer from "@/components/Footer.tsx"

export const Aqueducts = {
  footer: { Component: Footer },
}
```

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

### React vs. Preact

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