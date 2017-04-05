import { Component, TraceLogEntry, $h, $c, VNode, getTraceLog } from "ivi";

function LogEntryView(entry: TraceLogEntry) {
    return $h("div").children(
        $h("span", "EventLogMessage").children(entry.text),
        entry.count > 1 ? $h("span", "EventLogCounter").children(entry.count) : null,
    );
}

export class TraceLogViewer extends Component {
    attached() {
        getTraceLog().onChange(() => {
            this.invalidate();
        });
    }

    render() {
        const children: VNode<any>[] = [];
        getTraceLog().forEach((entry) => {
            children.push($c(LogEntryView, entry).key(entry.id));
        });

        return $h("div", "EventLog")
            .children(children.reverse());
    }
}
