import { Component, $h, GestureEvents, GestureEvent, GesturePointerEvent, trace } from "ivi";
import { $EventDetailsField } from "./event_details";

export function GestureEventDetails(ev: GestureEvent) {
    return $h("div", "EventDetails").children(
        $EventDetailsField("target", (ev.target as Element).className),
    );
}

export class GestureEventsMonitor extends Component {
    private onGesture = GestureEvents.onGesture(
        (ev) => {
            trace("event:gesture");
            this.invalidate();
        },
        () => {
            trace("gesture:createRecognizer");
            return {
                activeListeners: 0,
                acceptGesture: (id: number) => {
                    trace("gesture:recognizer:acceptGesture");
                    this.invalidate();
                },
                rejectGesture: (id: number) => {
                    trace("gesture:recognizer:rejectGesture");
                    this.invalidate();
                },
                handlePointerEvent: (pointer: GesturePointerEvent) => {
                    trace("gesture:recognizer:handlePointerEvent");
                    this.invalidate();
                    return true;
                },
                dispose: () => {
                    trace("gesture:recognizer:dispose");
                },
            };
        },
    );

    render() {
        return $h("div").children(
            $h("div", "EventBox 1").events(this.onGesture),
        );
    }
}
