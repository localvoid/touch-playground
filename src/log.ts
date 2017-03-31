import { $h } from "ivi";

export interface EventLogEntry {
    msg: string;
    count: number;
}

export class EventLog {
    readonly maxEntries: number;
    readonly entries: EventLogEntry[] = [];

    constructor(maxEntries: number = 50) {
        this.maxEntries = maxEntries;
    }

    push(entry: string) {
        if (this.entries.length > 0) {
            const last = this.entries[this.entries.length - 1];
            if (last.msg === entry) {
                last.count++;
                return;
            }
        }
        this.entries.push({
            msg: entry,
            count: 1,
        });
        if (this.entries.length > this.maxEntries) {
            this.entries.splice(0, 1);
        }
    }
}

function $LogEntryView(entry: EventLogEntry) {
    return $h("div").children(
        $h("span", "EventLogMessage").children(entry.msg),
        entry.count > 1 ? $h("span", "EventLogCounter").children(entry.count) : null,
    );
}

export function $EventLogViewer(log: EventLog) {
    return $h("div", "EventLog")
        .children(log.entries.slice().reverse().map((e) => $LogEntryView(e)));
}
