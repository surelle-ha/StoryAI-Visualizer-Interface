import { createRouter, createWebHistory, useRouter } from 'vue-router';
import Home from '../views/Home.vue';
import Visualizer from '../views/Visualizer.vue';
import Public_Images from '../views/Public_Images.vue';
import Preview from '../views/Preview.vue';
import Play from '../views/Play.vue';
import Settings from '../views/Settings.vue';

import { useStoryStore } from "@/stores/storyStore";


// Route guard to require a story to be initialized
const requireStory = (to, from, next) => {
    const storyStore = useStoryStore();
    const router = useRouter();
    if (!storyStore.isValid) {
        router.push({name: 'Home'});
        next({ name: 'Home' });  // If no story, redirect to Home
    } else {
        next();  // Proceed if a story is initialized
    }
};

// Route guard to prevent access to Home when a story is initialized
const requireNoStory = (to, from, next) => {
    const router = useRouter();
    const storyStore = useStoryStore();
    if (storyStore.isValid) {
        router.push({name: 'Visualizer'});
        next({ name: 'Visualizer' }); 
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
        path: '/public-images',
        name: 'Public_Images',
        component: Public_Images,
        beforeEnter: requireStory,
    },
    {
        path: '/preview',
        name: 'Preview',
        component: Preview,
        beforeEnter: requireStory,
    },
    {
        path: '/play',
        name: 'Play',
        component: Play,
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
