import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Visualizer from '../views/Visualizer.vue';
import Settings from '../views/Settings.vue';

import { useStoryStore } from "@/stores/storyStore";

// Route guard to require a story to be initialized
const requireStory = (to, from, next) => {
    const storyStore = useStoryStore();
    if (!storyStore.validate()) {
        next({ name: 'Home' });  // If no story, redirect to Home
    } else {
        next();  // Proceed if a story is initialized
    }
};

// Route guard to prevent access to Home when a story is initialized
const requireNoStory = (to, from, next) => {
    const storyStore = useStoryStore();
    if (storyStore.validate()) {
        next({ name: 'Visualizer' });  // Redirect to Visualizer if a story is initialized
    } else {
        next();  // Allow access to Home if no story is initialized
    }
};

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        beforeEnter: requireNoStory,
    },
    {
        path: '/Visualizer',
        name: 'Visualizer',
        component: Visualizer,
        beforeEnter: requireStory,
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        beforeEnter: requireStory,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
