import create, { UseStore, StoreApi } from 'zustand'
import { ICalCalendar } from 'ical-generator'

declare module 'ical-generator' {
	interface ICalCalendar {
		/** 只在浏览器中存在
		 * @see 包源码 */
		toBlob(): Blob
	}
}

export enum Progress {
	Idle,
	Success,
	Failure,
}

type TypeOfStore<T> = [UseStore<T>, StoreApi<T>]

type FailResult = {
	title?: string
	code?: string
}

const [useFailResultStore, FailResultStore] = create(() => ({} as FailResult))

export function useFailResult() {
	return {
		title: useFailResultStore(state => state.title),
		code: useFailResultStore(state => state.code),
	}
}

type BlobUrlStore = {
	url: null | string
	storeBlob: (_: Blob) => void
}

export const [useBlobUrlStore, BlobUrlStore] = create((set, get) => ({
	url: null,
	storeBlob(blob) {
		const { url } = get()
		if (url) URL.revokeObjectURL(url)
		set({ url: URL.createObjectURL(blob) })
	},
})) as TypeOfStore<BlobUrlStore>

type ProgressStore = {
	progress: Progress
	set: (_: Progress) => void
	toFailure: (_?: FailResult) => void
	success: (_: ICalCalendar) => void
}

export const [useProgressStore, ProgressStore] = create((set, get) => ({
	progress: Progress.Idle,
	set: progress => {
		set({ progress })
	},
	toFailure(result = {}) {
		FailResultStore.setState(result)
		set({ progress: Progress.Failure })
	},
	success(calendar) {
		BlobUrlStore.getState().storeBlob(calendar.toBlob())
		set({ progress: Progress.Success })
	},
})) as TypeOfStore<ProgressStore>

export function useProgressState() {
	return [
		useProgressStore(state => state.progress),
		useProgressStore(state => state.set),
	] as const
}

export function useProgress(): Progress {
	return useProgressStore(state => state.progress)
}

const [useDocumentStore] = create(set => ({
	value: false,
	set: (value: boolean) => {
		set({ value })
	},
}))

export function useDocumentShowState(): [boolean, (value: boolean) => void] {
	return [
		useDocumentStore(state => state.value),
		useDocumentStore(state => state.set),
	]
}

type ChildWindow = {
	window: null | Window
	open: (_: string) => void
	close: () => void
}

const [useChildWindowStore, ChildWindowStore] = create((set, get) => ({
	window: null,
	open(url) {
		set({ window: window.open(url) })
	},
	close() {
		get().window?.close()
		set({ window: undefined })
	},
})) as TypeOfStore<ChildWindow>

export { ChildWindowStore }

export function useChildWindow() {
	return {
		window: useChildWindowStore(state => state.window),
		open: useChildWindowStore(state => state.open),
		close: useChildWindowStore(state => state.close),
	}
}
