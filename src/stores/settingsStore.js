import { defineStore } from "pinia";

export const useSettingsStore = defineStore('settingsStore', {
	state: () => ({
		column_number: Number(localStorage.getItem("column_number") || 3),
		dark_mode: (localStorage.getItem("dark_mode") || false),
	}),
    getters: {
        isDarkMode: (state) => {
            return state.dark_mode === true;
        }
    },
    actions: {
        updateColumnNumber(number) {
            this.column_number = number;
            localStorage.setItem('column_number', number);
        },
        updateDarkMode(val) {
            this.dark_mode = val;
            localStorage.setItem('dark_mode', Boolean(val));
        },
    },
});
