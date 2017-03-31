import { Component, $c, $h, Events } from "ivi";
import { EventLog, $EventLogViewer } from "./log";
import { $EventDetailsField } from "./event_details";

function TouchDetails(t: Touch) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (t.target as Element).className),
        $EventDetailsField("identifier", t.identifier),
        $EventDetailsField("x", t.clientX),
        $EventDetailsField("y", t.clientY),
    );
}

interface TouchTarget {
    target: EventTarget;
    identifiers: number[];
}

export class TouchEventsMonitor extends Component {
    private log = new EventLog();
    private touches: Map<number, Touch> = new Map<number, Touch>();
    private targets: TouchTarget[] = [];

    private findTarget(target: Element) {
        for (let i = 0; i < this.targets.length; i++) {
            const t = this.targets[i];
            if (t.target === target) {
                return t;
            }
        }
        return null;
    }

    private capture(t: Touch) {
        const target = t.target as Element;
        const pt = this.findTarget(target);
        if (pt === null) {
            this.log.push("capture");
            this.targets.push({
                target: target,
                identifiers: [t.identifier],
            });
            target.addEventListener("touchend", this.onTouchEnd);
            target.addEventListener("touchcancel", this.onTouchCancel);
            target.addEventListener("touchmove", this.onTouchMove);
        } else {
            pt.identifiers.push(t.identifier);
        }
    }

    private cancel(t: Touch) {
        const target = t.target as Element;
        const pt = this.findTarget(target);
        if (pt !== null) {
            const idx = pt.identifiers.indexOf(t.identifier);
            if (idx > -1) {
                pt.identifiers.splice(idx, 1);
                if (pt.identifiers.length === 0) {
                    target.removeEventListener("touchend", this.onTouchEnd);
                    target.removeEventListener("touchcancel", this.onTouchCancel);
                    target.removeEventListener("touchmove", this.onTouchMove);
                    this.targets.splice(this.targets.indexOf(pt), 1);
                }
            }
        }
    }

    private onClick = Events.onClick((ev) => {
        this.log.push("click");
        this.invalidate();
    });

    private onTouchStart = Events.onTouchStart((ev) => {
        this.log.push("touchdown");
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            this.capture(t);
            this.touches.set(t.identifier, t);
        }
        this.invalidate();
    });

    private onTouchEnd = (ev: TouchEvent) => {
        this.log.push("touchup");
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            this.touches.delete(t.identifier);
            this.cancel(t);
        }
        this.invalidate();
    }

    private onTouchCancel = (ev: TouchEvent) => {
        this.log.push("touchcancel");
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            this.touches.delete(t.identifier);
            this.cancel(t);
        }
        this.invalidate();
    }

    private onTouchMove = (ev: TouchEvent) => {
        this.log.push("touchmove");
        const changedTouches = ev.changedTouches;
        for (let i = 0; i < changedTouches.length; i++) {
            const t = changedTouches[i];
            if (this.touches.has(t.identifier)) {
                this.touches.set(t.identifier, t);
            }
        }
        this.invalidate();
    }

    render() {
        return $h("div").children(
            $h("div", "EventBox")
                .events([
                    this.onTouchStart,
                    this.onClick,
                ]),
            $h("div").children(Array.from(this.touches.values()).map((p) => $c(TouchDetails, p))),
            $EventLogViewer(this.log),
        );
    }
}
