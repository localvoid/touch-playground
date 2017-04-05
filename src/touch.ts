import { Component, $c, $h, Events, FEATURES, FeatureFlags, trace } from "ivi";
import { $EventDetailsField } from "./event_details";

function TouchDetails(t: Touch) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (t.target as Element).className),
        $EventDetailsField("identifier", t.identifier),
        $EventDetailsField("x", t.clientX),
        $EventDetailsField("y", t.clientY),
    );
}


export class TouchEventsMonitor extends Component {
    private touches: Map<number, Touch> = new Map<number, Touch>();

    private capture() {
        trace("touch:capture");
        if (this.touches.size === 0) {
            document.addEventListener("touchend", this.onTouchEnd);
            document.addEventListener("touchcancel", this.onTouchCancel);
            document.addEventListener("touchmove", this.onTouchMove);
        }
    }

    private cancel() {
        trace("touch:cancel");
        if (this.touches.size === 0) {
            document.removeEventListener("touchend", this.onTouchEnd);
            document.removeEventListener("touchcancel", this.onTouchCancel);
            document.removeEventListener("touchmove", this.onTouchMove);
        }
    }

    private onClick = Events.onClick((ev) => {
        trace("event:click");
        this.invalidate();
    });

    private onTouchStart = Events.onTouchStart((ev) => {
        trace("event:touchdown");
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            this.capture();
            this.touches.set(t.identifier, t);
        }
        ev.preventDefault();
        this.invalidate();
    });

    private onTouchEnd = (ev: TouchEvent) => {
        trace("event:touchup");
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            this.touches.delete(t.identifier);
            this.cancel();
        }
        this.invalidate();
    }

    private onTouchCancel = (ev: TouchEvent) => {
        trace("event:touchcancel");
        const touches = ev.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            this.touches.delete(t.identifier);
            this.cancel();
        }
        this.invalidate();
    }

    private onTouchMove = (ev: TouchEvent) => {
        trace("event:touchmove");
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
        if ((FEATURES & FeatureFlags.TouchEvents) === 0) {
            return $h("div").children("Touch Events unavailable");
        }

        return $h("div").children(
            $h("div", "EventBox 1")
                .events([
                    this.onTouchStart,
                    this.onClick,
                ]),
            $h("div", "EventBox 2")
                .events([
                    this.onTouchStart,
                    this.onClick,
                ]),
            $h("div", "EventBox 3")
                .events([
                    this.onTouchStart,
                    this.onClick,
                ]),
            $h("div", "EventBox 4")
                .events([
                    this.onTouchStart,
                    this.onClick,
                ]),
            $h("div").children(Array.from(this.touches.values()).map((p) => $c(TouchDetails, p))),
        );
    }
}
