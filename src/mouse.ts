import { Component, $c, $h, Events } from "ivi";
import { EventLog, $EventLogViewer } from "./log";
import { $EventDetailsField } from "./event_details";

function MouseEventDetails(ev: MouseEvent) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (ev.target as Element).className),
        $EventDetailsField("x", ev.x),
        $EventDetailsField("y", ev.y),
        $EventDetailsField("buttons", ev.buttons),
    );
}

export class MouseEventsMonitor extends Component {
    private log = new EventLog();
    private pointer: MouseEvent | null = null;

    private checkEvent(ev: MouseEvent) {
        if (ev.buttons === 0) {
            this.log.push("cancel");
            this.pointer = null;
            document.removeEventListener("mouseup", this.onMouseUp);
            document.removeEventListener("mousemove", this.onMouseMove);
        }
    }

    private capture() {
        if (this.pointer === null) {
            document.addEventListener("mouseup", this.onMouseUp);
            document.addEventListener("mousemove", this.onMouseMove);
        }
    }

    private onClick = Events.onClick((ev) => {
        this.log.push("click");
        this.invalidate();
    });

    private onMouseDown = Events.onMouseDown((ev) => {
        this.log.push("mousedown");
        this.capture();
        this.pointer = ev.native;
        this.invalidate();
    });

    private onMouseUp = (ev: MouseEvent) => {
        this.log.push("mouseup");
        this.pointer = ev;
        this.checkEvent(ev);
        this.invalidate();
    }

    private onMouseMove = (ev: MouseEvent) => {
        this.log.push("mousemove");
        this.pointer = ev;
        this.checkEvent(ev);
        this.invalidate();
    }

    render() {
        return $h("div").children(
            $h("div", "EventBox").events([
                this.onMouseDown,
                this.onClick,
            ]),
            $h("div").children(this.pointer === null ? null : $c(MouseEventDetails, this.pointer)),
            $EventLogViewer(this.log),
        );
    }
}
