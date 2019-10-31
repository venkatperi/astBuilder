import { AbstractFactory, JsDsl } from "js-dsl"

export type Primitive = string | number | boolean

export type Value = Primitive

export type Attributes = {
    [k in string]: Primitive
}

export type Visitor = (node: AstNode) => void

/**
 * Represents an AST node in the DSL's object hierarchy.
 */
export class AstNode {
    name: string

    attributes: Attributes = {}

    value: Primitive | null

    children: Array<AstNode> = []

    parent: AstNode | undefined

    constructor(name: string, attributes: Attributes, value: Value) {
        this.name = name
        if (typeof attributes != "object") {
            value = attributes
        } else {
            this.attributes = attributes
        }
        this.value = value
    }

    addChild(child: AstNode) {
        this.children.push(child)
        child.parent = this
    }

    preOrder<T>(visitor: (node: AstNode, parent?: T) => T, parent?: T) {
        let node = visitor(this, parent)
        for (let child of this.children) {
            child.preOrder(visitor, node)
        }
    }

    postOrder<T>(visitor: (node: AstNode, children: Array<T>) => T): T {
        let values = this.children.reverse().map(x => x.postOrder(visitor))
        return visitor(this, values)
    }

}

export class AstNodeFactory extends AbstractFactory<AstNode, AstNode> {
    opts: Attributes

    constructor(opts: Attributes = {}) {
        super()
        this.opts = opts
    }

    // noinspection JSUnusedGlobalSymbols
    newInstance(builder: JsDsl, name: string, attr: Attributes, value: Value) {
        return new AstNode(name, attr, value)
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    setChild(builder: JsDsl, parent: AstNode, child: AstNode) {
        parent.addChild(child)
    }

    isLeaf() {
        return !!(this.opts || {}).isLeaf
    }

}

export class AstBuilder extends JsDsl {
    constructor(nonTerminals: Array<string>, terminals: Array<string>) {
        super()
        nonTerminals.forEach(x => this.registerFactory(x, new AstNodeFactory()));
        terminals.forEach(x => this.registerFactory(x, new AstNodeFactory({ isLeaf: true })));
    }
}
