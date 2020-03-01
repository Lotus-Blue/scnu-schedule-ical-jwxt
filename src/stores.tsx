import create from 'zustand'

export enum Progress {
	Idle,
	Success,
	Failure,
}

const [useProgressStore] = create(set => ({
	value: Progress.Idle,
	set: (progress: Progress) => {
		set({ value: progress })
	},
}))

export function useProgressState(): Progress {
	return useProgressStore(state => state.value)
}

export function useProgressSetter(): (progress: Progress) => void {
	return useProgressStore(state => state.set)
}
