import {Component, OnInit} from '@angular/core';
import {TreeNode} from './classes/tree-node.class';

enum COMMAND_ENUM {
    CREATE = 'CREATE',
    LIST = 'LIST',
    MOVE = 'MOVE',
    DELETE = 'DELETE'
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    preserveWhitespaces: true
})
export class AppComponent implements OnInit {
    private readonly commandLines: string[] = [
        'CREATE work',
        'CREATE trips',
        'CREATE docs',
        'CREATE work/certemy',
        'CREATE work/certemy/tmp',
        'LIST',
        'CREATE docs/europe',
        'MOVE docs/europe trips',
        'CREATE 2020',
        'MOVE docs 2020',
        'MOVE work 2020',
        'MOVE trips 2020',
        'LIST',
        'DELETE work/certemy',
        'DELETE 2020/work/certemy',
        'LIST'
    ];
    private mockDir = new TreeNode('');
    outputLines: string[] = [];

    ngOnInit(): void {
        this.initialize();
    }

    // Entry point to the waterfall of commands
    private initialize(): void {
        // Clear the output array
        this.clearOutputLines();

        // Let's loop through the commands and run each one
        this.commandLines.forEach(commandLine => {
            // Split the command string so we can the actual command and the arguments for it
            const [command, ...args] = commandLine.split(' ');
            let splitArgs = [];

            // Trigger a different set of functionality depending on the command
            switch (true) {
                case command === COMMAND_ENUM.CREATE:
                    splitArgs = args[0].split('/'); // Create an array of arguments to pass into the create method
                    this.outputLines.push(`${COMMAND_ENUM.CREATE} ${args[0]}`); // Add the command we just ran to the outputs array
                    this.create(splitArgs, this.mockDir);
                    break;
                case command === COMMAND_ENUM.LIST:
                    this.outputLines.push(COMMAND_ENUM.LIST); // Add the command we just ran to the outputs array
                    this.list(this.mockDir, 0);
                    break;
                case command === COMMAND_ENUM.DELETE:
                    this.outputLines.push(`${COMMAND_ENUM.DELETE} ${args[0]}`); // Add the command we just ran to the outputs array
                    splitArgs = args[0].split('/'); // Create an array of arguments to pass into the delete method
                    this.delete(splitArgs, this.mockDir);
                    break;
                case command === COMMAND_ENUM.MOVE:
                default:
                    // When doing a move command, there are two arguments, we need to split both of them
                    const from = args[0].split('/');
                    const to = args[1].split('/');
                    this.outputLines.push(`${COMMAND_ENUM.MOVE} ${args[0]} ${args[1]}`); // Add the command we just ran to the outputs array
                    this.move(from, to, this.mockDir);
                    break;
            }
        });
    }

    /**
     * Recursive method to create nested tree nodes
     * @param path
     * @param currentNode
     * @private
     */
    private create(path: string[], currentNode: TreeNode): void {
        const nextPath = path.shift();
        const childNode = currentNode.find(nextPath);

        // If we found the node, we don't need to create it, move on to the next path else create it
        if (childNode) {
            this.create(path, childNode);
        } else {
            currentNode.create(nextPath);
        }
    }

    /**
     * Moves a node from one parent to another
     * @param from
     * @param to
     * @param node
     * @private
     */
    private move(from: string[], to: string[], node: TreeNode): void {
        let fromNode = node;
        let toNode = node;

        // Loop through the 'from' array and find the child node
        while (from.length) {
            const currentFrom = from.shift();
            fromNode = fromNode.find(currentFrom);
        }

        // Loop through the 'to' array and find the child node
        while (to.length) {
            const currentTo = to.shift();
            toNode = toNode.find(currentTo);
        }
        // Delete the child node in the 'from' (the delete method returns the deleted array items)
        const nodeToMove = fromNode.parent.delete(fromNode)[0];

        // Push the deleted node into the 'to' children
        toNode.children.push(nodeToMove);
    }

    /**
     * Lists out the directory structure by recursively iterating over the children and adding
     *  2 spaces per loop (to mimic the indentation of folder hierarchy)
     * @param node
     * @param spaces
     * @private
     */
    private list(node: TreeNode, spaces: number): void {
        node.children.sort(this.sortChildren).forEach(child => {
            // I know this might seem weird, but it seemed the easiest to create a string of n number of spaces
            // while dealing with the issue of the browser/Angular stripping whitespaces
            const paddedString = new Array(spaces).fill('&nbsp;').join('');
            this.outputLines.push(paddedString + child.path);
            this.list(child, spaces + 2);
        });
    }

    /**
     * Deletes a node
     * @param paths
     * @param node
     * @private
     */
    private delete(paths: string[], node: TreeNode): void {
        let currentNode = node;
        const pathsCopy = [...paths]; // Make a copy so we can keep the original for use in the error string
        while (pathsCopy.length) {
            const currentPath = pathsCopy.shift();
            currentNode = currentNode.find(currentPath);
            if (!currentNode) {
                this.outputLines.push(`Cannot delete ${paths.join('/')} - ${currentPath} does not exist`);
                break;
            }
        }

        // If we've exhausted the paths array and still have a current node, then we can be certain the path exists
        if (!pathsCopy.length && currentNode) {
            currentNode.parent.delete(currentNode);
        }
    }

    /**
     * Clears the output array
     * @private
     */
    private clearOutputLines(): void {
        this.outputLines = [];
    }

    /**
     * Sorts the children in alphabetical order
     * @param a TreeNode
     * @param b TreeNode
     * @private
     */
    private sortChildren(a: TreeNode, b: TreeNode): -1 | 0 | 1 {
        if (a.path.toLowerCase() > b.path.toLowerCase()) {
            return 1;
        }
        if (a.path.toLowerCase() < b.path.toLowerCase()) {
            return -1;
        }
        return 0;
    }
}
