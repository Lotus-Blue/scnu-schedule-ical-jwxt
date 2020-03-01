import create from 'zustand'

export enum Progress {
	Idle,
	Success,
	Failure,
}

const [useProgressStore] = create(set => ({
	value: Progress.Idle,
	set: (value: Progress) => {
		set({ value: value })
	},
}))

export function useProgressState(): [Progress, (value: Progress) => void] {
	return [
		useProgressStore(state => state.value),
		useProgressStore(state => state.set),
	]
}

const [useHelpDocsStore] = create(set => ({
	value: false,
	set: (value: boolean) => {
		set({ value })
	},
}))

export function useHelpDocsState(): [boolean, (value: boolean) => void] {
	return [
		useHelpDocsStore(state => state.value),
		useHelpDocsStore(state => state.set),
	]
}
