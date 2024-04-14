import { defineStore } from 'pinia';
import axios from 'axios';

export const useStoryStore = defineStore('storyStore', {
    state: () => ({
        access_id: localStorage.getItem('access_id') || null,
        story_id: localStorage.getItem('story_id') || null,
        chapter_id: localStorage.getItem('chapter_id') || null,
        isAuthor: localStorage.getItem('isAuthor') === 'true', // Assuming isAuthor and isAdmin are booleans
        isAdmin: localStorage.getItem('isAdmin') === 'true',
        error: null, // Manage errors within the store
    }),
    getters: {
        isValid: (state) => {
            return state.access_id !== null && state.story_id !== null && state.chapter_id !== null;
        }
    },
    actions: {
        updateAccessId(id) {
            this.access_id = id;
            localStorage.setItem('access_id', id);
        },
        updateStoryId(id) {
            this.story_id = id;
            localStorage.setItem('story_id', id);
        },
        updateChapterId(id) {
            this.chapter_id = id;
            localStorage.setItem('chapter_id', id);
        },
        updateAuthor(state) {
            this.isAuthor = state;
            localStorage.setItem('isAuthor', state.toString());
        },
        updateAdmin(state) {
            this.isAdmin = state;
            localStorage.setItem('isAdmin', state.toString());
        },
        async initializeStory(accessId, storyId, chapterId, isAuthor, isAdmin) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_BACKEND_API_URL}/api/story/initialize`, {
                    access_id: accessId,
                    story_id: storyId,
                    chapter_id: chapterId
                });
                if (response.data.status === 'success') {
                    this.updateAccessId(accessId);
                    this.updateStoryId(storyId);
                    this.updateChapterId(chapterId);
                    this.updateAuthor(isAuthor);
                    this.updateAdmin(isAdmin);
                } else {
                    this.error = response.data.message || 'An error occurred during initialization.';
                    return response; // This might include error details that the component can handle
                }
            } catch (err) {
                this.error = err.message || 'Failed to initialize story.';
                console.error('Error initializing story:', err.message);
            }
        },
        clearStory() {
            localStorage.removeItem('access_id');
            localStorage.removeItem('story_id');
            localStorage.removeItem('chapter_id');
            localStorage.removeItem('isAuthor');
            localStorage.removeItem('isAdmin');
            this.$reset(); // Resets all state to their initial values
        }
    }
});
