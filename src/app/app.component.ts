import {Component, OnInit} from '@angular/core';
import {LinkedList} from './classes/linked-list.class';
import {ListNode} from './classes/list-node.class';

enum COMMAND_ENUM {
    CREATE = 'create',
    LIST = 'list',
    MOVE = 'move',
    DELETE = 'delete'
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
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
    private mockDir = [];
    outputLines: string[] = [];

    ngOnInit(): void {
        this.initialize();
    }

    private initialize(): void {
        this.clearOutputLines();
        this.commandLines.forEach(commandLine => {
            const [command, ...args] = commandLine.split(' ');
            const lowerCaseCommand = command.toLowerCase();
            switch (true) {
                case lowerCaseCommand === COMMAND_ENUM.CREATE:
                    const splitArgs = args[0].split('/');
                    this.create(splitArgs);
            }
        });
    }

    private create(dir: string[]): void {
        if (!dir[0]) {
            return;
        }
        const parent = dir.shift();
        const foundNode = this.findInMockDir(parent);
        if (!foundNode) {
            const node = new ListNode(parent);
            this.mockDir.push(new LinkedList(node));
        } else {
            // this.create(children.join('/'));
        }
        console.log(this.mockDir);
    }

    private move(from: string, to: string): void {
        console.log(from, to);
    }

    private list(): void {

    }

    private delete(dir: string): void {

    }

    private findInMockDir(dir: string): ListNode | undefined {
        return this.mockDir.find(node => node.data === dir);
    }

    private clearOutputLines(): void {
        this.outputLines = [];
    }
}
