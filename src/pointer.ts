import { Component, $c, $h, Events, FEATURES, FeatureFlags, trace } from "ivi";
import { $EventDetailsField } from "./event_details";

function PointerEventDetails(ev: PointerEvent) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (ev.target as Element).className),
        $EventDetailsField("pointerId", ev.pointerId),
        $EventDetailsField("x", ev.x),
        $EventDetailsField("y", ev.y),
        $EventDetailsField("buttons", ev.buttons),
        $EventDetailsField("isPrimary", ev.isPrimary.toString()),
    );
}

export class PointerEventsMonitor extends Component {
    private pointers: Map<number, PointerEvent> = new Map<number, PointerEvent>();

    private capture(ev: PointerEvent) {
        const target = ev.target as Element;
        target.setPointerCapture(ev.pointerId);
        if (this.pointers.size === 0) {
            document.addEventListener("pointerup", this.onPointerUp);
            document.addEventListener("pointercancel", this.onPointerCancel);
            document.addEventListener("pointermove", this.onPointerMove);
            document.addEventListener("lostpointercapture", this.onLostCapture);
        }
    }

    private cancel(ev: PointerEvent) {
        if (this.pointers.size === 0) {
            document.removeEventListener("pointerup", this.onPointerUp);
            document.removeEventListener("pointercancel", this.onPointerCancel);
            document.removeEventListener("pointermove", this.onPointerMove);
            document.removeEventListener("lostpointercapture", this.onLostCapture);
        }
    }

    private onClick = Events.onClick((ev) => {
        trace("event:click");
        this.invalidate();
    });

    private onPointerDown = Events.onPointerDown((ev) => {
        trace("event:pointerdown");
        this.capture(ev.native);
        this.pointers.set(ev.pointerId, ev.native);
        this.invalidate();
    });

    private onLostCapture = (ev: PointerEvent) => {
        trace("event:lostcapture");
        this.pointers.delete(ev.pointerId);
        this.cancel(ev);
        this.invalidate();
    }

    private onPointerUp = (ev: PointerEvent) => {
        trace("event:pointerup");
        this.pointers.delete(ev.pointerId);
        this.cancel(ev);
        this.invalidate();
    }

    private onPointerCancel = (ev: PointerEvent) => {
        trace("event:pointercancel");
        this.pointers.delete(ev.pointerId);
        this.cancel(ev);
        this.invalidate();
    }

    private onPointerMove = (ev: PointerEvent) => {
        trace("event:pointermove");
        this.pointers.set(ev.pointerId, ev);
        this.invalidate();
    }

    render() {
        if ((FEATURES & FeatureFlags.PointerEvents) === 0) {
            return $h("div").children("Pointer Events unavailable");
        }

        return $h("div").children(
            $h("div", "EventBox 1")
                .events([
                    this.onPointerDown,
                    this.onClick,
                ]),
            $h("div", "EventBox 2")
                .events([
                    this.onPointerDown,
                    this.onClick,
                ]),
            $h("div", "EventBox 3")
                .events([
                    this.onPointerDown,
                    this.onClick,
                ]),
            $h("div", "EventBox 4")
                .events([
                    this.onPointerDown,
                    this.onClick,
                ]),
            $h("div").children(Array.from(this.pointers.values()).map((p) => $c(PointerEventDetails, p))),
        );
    }
}
