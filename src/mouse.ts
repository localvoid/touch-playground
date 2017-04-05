import { Component, $c, $h, Events, trace } from "ivi";
import { $EventDetailsField } from "./event_details";

function MouseEventDetails(ev: MouseEvent) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (ev.target as Element).className),
        $EventDetailsField("x", ev.x),
        $EventDetailsField("y", ev.y),
        $EventDetailsField("buttons", ev.buttons),
    );
}

function getMouseButtons(ev: MouseEvent): number {
    const button = ev.button;
    const r = 1 << button;
    if ((r & (2 | 4)) !== 0) {
        return button << (((r >> 2) ^ 1) << 1);
    }
    return r;
}

export class MouseEventsMonitor extends Component {
    private pointer: MouseEvent | null = null;
    private buttons: number = 0;

    private checkEvent(ev: MouseEvent) {
        if (this.buttons === 0) {
            trace("mouse:cancel");
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
        trace("event:click");
        this.invalidate();
    });

    private onMouseDown = Events.onMouseDown((ev) => {
        trace("event:mousedown");
        this.capture();
        this.pointer = ev.native;
        if (ev.native.buttons === undefined) {
            this.buttons |= getMouseButtons(ev.native);
        } else {
            this.buttons = ev.native.buttons;
        }
        this.invalidate();
    });

    private onMouseUp = (ev: MouseEvent) => {
        trace("event:mouseup");
        this.pointer = ev;
        if (ev.buttons === undefined) {
            this.buttons &= ~getMouseButtons(ev);
        } else {
            this.buttons = ev.buttons;
        }
        this.checkEvent(ev);
        this.invalidate();
    }

    private onMouseMove = (ev: MouseEvent) => {
        trace("event:mousemove");
        this.pointer = ev;
        if (ev.buttons === undefined) {
            if (ev.which === 0) {
                this.buttons = 0;
            }
        } else {
            this.buttons = ev.buttons;
        }
        this.checkEvent(ev);
        this.invalidate();
    }

    render() {
        return $h("div").children(
            $h("div", "EventBox 1").events([
                this.onMouseDown,
                this.onClick,
            ]),
            $h("div", "EventBox 2").events([
                this.onMouseDown,
                this.onClick,
            ]),
            $h("div", "EventBox 3").events([
                this.onMouseDown,
                this.onClick,
            ]),
            $h("div", "EventBox 4").events([
                this.onMouseDown,
                this.onClick,
            ]),
            $h("div").children(this.pointer === null ? null : $c(MouseEventDetails, this.pointer)),
        );
    }
}
