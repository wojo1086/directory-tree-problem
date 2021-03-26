export class TreeNode {
    path: string;
    children: TreeNode[];
    parent: TreeNode;

    constructor(path: string, parent?: TreeNode | undefined) {
        this.path = path;
        this.children = [];
        this.parent = parent;
    }

    /**
     * Finds the child node by the given path name
     * @param path Name of the path to find
     */
    find(path: string): TreeNode | undefined {
        return this.children.find(child => child.path === path);
    }

    /**
     * Finds the index of the passed in TreeNode
     * @param node TreeNode to find
     */
    findIndex(node: TreeNode): number {
        return this.children.indexOf(node);
    }

    /**
     * Adds a new TreeNode to the children array
     * @param path Name of the path
     */
    create(path: string): void {
        this.children.push(new TreeNode(path, this));
    }

    /**
     * Finds the index of the passed in TreeNode and deletes/returns it
     * @param node The TreeNode to delete
     */
    delete(node: TreeNode): TreeNode[] {
        const index = this.findIndex(node);
        return this.children.splice(index, 1);
    }

}
