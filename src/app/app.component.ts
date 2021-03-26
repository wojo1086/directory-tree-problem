import {Component, OnInit} from '@angular/core';
import {LinkedList} from './classes/linked-list.class';
import {ListNode} from './classes/list-node.class';

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
    private mockDir = {};
    outputLines: string[] = [];

    ngOnInit(): void {
        this.initialize();
    }

    private initialize(): void {
        this.clearOutputLines();
        this.commandLines.forEach(commandLine => {
            const [command, ...args] = commandLine.split(' ');
            let splitArgs = [];
            switch (true) {
                case command === COMMAND_ENUM.CREATE:
                    splitArgs = args[0].split('/');
                    this.create(splitArgs, this.mockDir);
                    this.outputLines.push(`${COMMAND_ENUM.CREATE} ${args[0]}`);
                    break;
                case command === COMMAND_ENUM.LIST:
                    this.outputLines.push(COMMAND_ENUM.LIST);
                    this.list(this.mockDir, 0);
                    break;
                case command === COMMAND_ENUM.DELETE:
                    this.outputLines.push(`${COMMAND_ENUM.DELETE} ${args[0]}`);
                    splitArgs = args[0].split('/');
                    this.delete(splitArgs, this.mockDir, 0);
                    break;
                case command === COMMAND_ENUM.MOVE:
                default:
                    const from = args[0].split('/');
                    const to = args[1].split('/');
                    this.outputLines.push(`${COMMAND_ENUM.MOVE} ${args[0]} ${args[1]}`);
                    this.move(from, to, this.mockDir);
                    break;
            }
        });
    }

    private create(structure: string[], dir): void {
        const parent = structure.shift();
        if (!parent) {
            return;
        }
        if (!dir.hasOwnProperty(parent)) {
            dir[parent] = {};
        }
        this.create(structure, dir[parent]);
    }

    private move(from: string[], to: string[], dir): void {
        const newKey = from[from.length - 1];
        const fromObj = this.getDir(from, dir, false);
        const toObj = this.getDir(to, dir, true);
        toObj[newKey] = {...fromObj[newKey]};
        delete fromObj[newKey];
    }

    private list(structure, spaces): void {
        Object.keys(structure).sort().forEach(key => {
            const paddedString = new Array(spaces).fill('&nbsp;').join('');
            this.outputLines.push(paddedString + key);
            this.list(structure[key], spaces + 2);
        });
    }

    private delete(structure: string[], dir, index): void {
        const item = this.getDir(structure, dir, false);
        if (!item) {
            this.outputLines.push(`Cannot delete ${structure.join('/')} - ${structure[index]} does not exist`);
        } else {
            const deleteKey = structure[structure.length - 1];
            const poppedArray = [...structure];
            poppedArray.pop();
            const parentDir = this.getDir(poppedArray, dir, true);
            delete parentDir[deleteKey];
        }
    }

    private clearOutputLines(): void {
        this.outputLines = [];
    }

    private getDir(arr: string[], dir, includeLastIndex: boolean): any {
        let obj = dir;
        const arrCopy = [...arr];
        let fromIndex = includeLastIndex ? arr.length : (arr.length - 1 >= 0 ? arr.length - 1 : 0);
        while (fromIndex) {
            const file = arrCopy.shift();
            if (!obj) {
                obj = undefined;
                fromIndex = 0;
            } else {
                obj = obj[file];
                fromIndex--;
            }

        }
        return obj;
    }
}
