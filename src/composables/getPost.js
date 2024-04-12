import { ref } from "vue";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const getPost = (id) => {
	const post = ref(null);
	const error = ref(null);

	const load = async () => {
		try {
			const docRef = doc(db, "posts", id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				post.value = { id: docSnap.id, ...docSnap.data() };
			} else {
				throw Error("No such document!");
			}
		} catch (err) {
			error.value = err.message;
			console.log(error.value);
		}
	};

	return { post, error, load };
};

export default getPost;
