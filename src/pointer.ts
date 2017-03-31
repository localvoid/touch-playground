import { Component, $c, $h, Events } from "ivi";
import { EventLog, $EventLogViewer } from "./log";
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

interface PointerTarget {
    target: EventTarget;
    pointers: number[];
}

export class PointerEventsMonitor extends Component {
    private log = new EventLog();
    private pointers: Map<number, PointerEvent> = new Map<number, PointerEvent>();
    private targets: PointerTarget[] = [];

    private findTarget(target: Element) {
        for (let i = 0; i < this.targets.length; i++) {
            const t = this.targets[i];
            if (t.target === target) {
                return t;
            }
        }
        return null;
    }

    private capture(ev: PointerEvent) {
        const target = ev.target as Element;
        const pt = this.findTarget(target);
        target.setPointerCapture(ev.pointerId);
        if (pt === null) {
            this.targets.push({
                target: target,
                pointers: [ev.pointerId],
            });
            target.addEventListener("pointerup", this.onPointerUp);
            target.addEventListener("pointercancel", this.onPointerCancel);
            target.addEventListener("pointermove", this.onPointerMove);
            target.addEventListener("lostpointercapture", this.onLostCapture);
        } else {
            pt.pointers.push(ev.pointerId);
        }
    }

    private cancel(ev: PointerEvent) {
        const target = ev.target as Element;
        const pt = this.findTarget(target);
        if (pt !== null) {
            const idx = pt.pointers.indexOf(ev.pointerId);
            if (idx > -1) {
                pt.pointers.splice(idx, 1);
                if (pt.pointers.length === 0) {
                    target.removeEventListener("pointerup", this.onPointerUp);
                    target.removeEventListener("pointercancel", this.onPointerCancel);
                    target.removeEventListener("pointermove", this.onPointerMove);
                    target.removeEventListener("lostpointercapture", this.onLostCapture);
                    this.targets.splice(this.targets.indexOf(pt), 1);
                }
            }
        }
    }

    private onClick = Events.onClick((ev) => {
        this.log.push("click");
        this.invalidate();
    });

    private onPointerDown = Events.onPointerDown((ev) => {
        this.log.push("pointerdown");
        this.capture(ev.native);
        this.pointers.set(ev.pointerId, ev.native);
        this.invalidate();
    });

    private onLostCapture = (ev: PointerEvent) => {
        this.log.push("lostcapture");
        this.pointers.delete(ev.pointerId);
        this.cancel(ev);
        this.invalidate();
    }

    private onPointerUp = (ev: PointerEvent) => {
        this.log.push("pointerup");
        this.pointers.delete(ev.pointerId);
        this.cancel(ev);
        this.invalidate();
    }

    private onPointerCancel = (ev: PointerEvent) => {
        this.log.push("pointercancel");
        this.pointers.delete(ev.pointerId);
        this.cancel(ev);
        this.invalidate();
    }

    private onPointerMove = (ev: PointerEvent) => {
        this.log.push("pointermove");
        this.pointers.set(ev.pointerId, ev);
        this.invalidate();
    }

    render() {
        return $h("div").children(
            $h("div", "EventBox")
                .events([
                    this.onPointerDown,
                    this.onClick,
                ]),
            $h("div").children(Array.from(this.pointers.values()).map((p) => $c(PointerEventDetails, p))),
            $EventLogViewer(this.log),
        );
    }
}
