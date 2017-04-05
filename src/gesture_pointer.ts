import { Component, $h, $c, GestureEvents, GesturePointerEvent, GesturePointerAction, trace } from "ivi";
import { $EventDetailsField } from "./event_details";

export function GesturePointerEventDetails(ev: GesturePointerEvent) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (ev.target as Element).className),
        $EventDetailsField("x", ev.x),
        $EventDetailsField("y", ev.y),
        $EventDetailsField("buttons", ev.buttons),
    );
}

export class GesturePointerEventsMonitor extends Component {
    private pointers: Map<number, GesturePointerEvent> = new Map<number, GesturePointerEvent>();

    private onPointer = GestureEvents.onPointer((ev) => {
        switch (ev.action) {
            case GesturePointerAction.Down:
                trace("event:gesture.pointer:down");
                this.pointers.set(ev.id, ev);
                break;
            case GesturePointerAction.Move:
                trace("event:gesture.pointer:move");
                this.pointers.set(ev.id, ev);
                break;
            case GesturePointerAction.Up:
                trace("event:gesture.pointer:up");
                this.pointers.delete(ev.id);
                break;
            case GesturePointerAction.Cancel:
                trace("event:gesture.pointer:cancel");
                this.pointers.delete(ev.id);
                break;
        }
        this.invalidate();
    });

    render() {
        return $h("div").children(
            $h("div", "EventBox 1").events(this.onPointer),
            $h("div", "EventBox 2").events(this.onPointer),
            $h("div", "EventBox 3").events(this.onPointer),
            $h("div", "EventBox 4").events(this.onPointer),
            $h("div").children(Array.from(this.pointers.values()).map((p) => $c(GesturePointerEventDetails, p))),
        );
    }
}
