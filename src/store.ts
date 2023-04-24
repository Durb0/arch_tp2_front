import { writable, type Writable } from 'svelte/store'
import type { PlageHoraire } from './model'

export let status_chaudiere: Writable<boolean> = writable(false)
export let temp: Writable<number> = writable(0)
export let plages_horaire: Writable<Array<PlageHoraire>> = writable([])
export let tr: Writable<number> = writable(10)
export let error_chaudiere: Writable<boolean> = writable(false)