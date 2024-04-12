import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const error = ref(null);

export const useStoryStore = defineStore('storyStore', {
    state: () => ({
        story_id: localStorage.getItem('story_id'),
        chapter_id: localStorage.getItem('chapter_id')
    }),
    actions: {
        validate() {
            return this.story_id !== null && this.chapter_id !== null;
        },
        updateStoryId(id) {
            this.story_id = id;
            localStorage.setItem('story_id', id);
        },
        updateChapterId(id) {
            this.chapter_id = id;
            localStorage.setItem('chapter_id', id);
        },
        async initializeStory(storyId, chapterId) {
            try {
                const response = await axios.post('http://localhost:80/api/story/initialize', {
                    story_id: storyId,
                    chapter_id: chapterId
                });
                if (response.data.status === 'success') {
                    this.updateStoryId(storyId);
                    this.updateChapterId(chapterId);
                } else {
                    throw new Error('Failed to initialize story');
                }
            } catch (error) {
                console.error('Error initializing story:', error.message);
            }
        },
        clearStory() {
            localStorage.removeItem('story_id');
            localStorage.removeItem('chapter_id');
            this.story_id = null;
            this.chapter_id = null;
        }
    }
});
