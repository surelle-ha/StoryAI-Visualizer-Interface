import { ref } from "vue";
import { db } from "@/firebase/config";
import {
	collection,
	query,
	orderBy,
	getDocs,
	onSnapshot,
} from "firebase/firestore";

const getPost = () => {
	const posts = ref([]);
	const error = ref(null);

	const load = async () => {
		try {
			const postsQuery = query(
				collection(db, "posts"),
				orderBy("createdAt", "desc")
			);

			onSnapshot(
				postsQuery,
				(querySnapshot) => {
					if (querySnapshot.empty) {
						console.log("No matching documents.");
					} else {
						posts.value = querySnapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data(),
						}));
					}
				},
				(error) => {
					console.error("Error listening to posts:", error);
				}
			);
		} catch (err) {
			error.value = err.message;
			console.log(error.value);
		}
	};

	return {
		posts,
		error,
		load,
	};
};

export default getPost;
