# js-ast-builder 
js-ast-builder makes it easy to build Javascript internal DSLs that generate an abstract syntax tree (AST). 

## Example
Build an arbitrary tree of `node`s:

```js
class TreeOfNodes extends AstBuilder {
  constructor() {
    super(["node"])
  }
}

let tree = new TreeOfNodes().build(() =>
  node(1, () => {
    node(2, () =>
      node(3)
    )
    node(4)
  })
)
```

Output:
```
└ 1
  ├ 2
  │ └ 3
  └ 4
```