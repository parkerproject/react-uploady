// @flow
import { useEffect, useContext, useState, useCallback } from "react";
import { UploadyContext } from "@rupy/uploady";
import assertContext from "./assertContext";

type Callback = (...args?: any) => ?any;

const useEventEffect = (event: string, fn: Callback) => {
	const context = assertContext(useContext(UploadyContext));
	const { uploader } = context;

	useEffect(() => {
		uploader.on(event, fn);

		return () => {
			uploader.off(event, fn);
		}
	}, [fn]);
};

const generateUploaderEventHookWithState = (event: string, stateCalculator: (state: mixed) => any) => {
	return (fn?: Callback) => {
		const [eventState, setEventState] = useState(null);

		const eventCallback = useCallback((...args) => {
			setEventState(stateCalculator(...args));

			if (fn) {
				fn(...args);
			}
		}, [fn, stateCalculator]);

		useEventEffect(event, eventCallback);

		return eventState;
	};
};

const generateUploaderEventHook = (event: string) =>
	(fn: Callback) =>
		useEventEffect(event, fn);

export {
	generateUploaderEventHook,
	generateUploaderEventHookWithState,
}