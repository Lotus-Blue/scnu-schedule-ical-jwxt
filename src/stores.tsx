import create, { UseStore, StoreApi } from 'zustand'

export enum Progress {
	Idle,
	Success,
	Failure,
}

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

type Temp = {
	progress: Progress
}

export const [useProgressStore] = create((set, get) => ({
	progress: Progress.Idle,
	set: progress => {
		set({ progress })
	},
	toFailure(result = {}) {
		FailResultStore.setState(result)
		set({ progress: Progress.Failure })
	},
})) as [
	UseStore<{
		progress: Progress
		set: (_: Progress) => void
		toFailure: (_?: FailResult) => void
	}>,
	unknown
]

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
	window: Window | null
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
})) as [UseStore<ChildWindow>, StoreApi<ChildWindow>]

export { ChildWindowStore }

export function useChildWindow() {
	return {
		window: useChildWindowStore(state => state.window),
		open: useChildWindowStore(state => state.open),
		close: useChildWindowStore(state => state.close),
	}
}
