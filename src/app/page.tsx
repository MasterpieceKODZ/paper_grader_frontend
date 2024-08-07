import Link from "next/link";

const Homepage = () => {
	return (
		<div className=" w-[100%] min-h-[80vh] flex justify-center items-center">
			<Link
				href="/course/list/view"
				className=" w-max h-max px-3 py-2 rounded-md font-bold text-white text-center bg-blue-600 mr-5">
				COURSES
			</Link>
			<Link
				href="/upload"
				className=" w-max h-max px-3 py-2 rounded-md font-bold text-white text-center bg-blue-600 mr-2 ml-2">
				UPLOAD ANSWERS
			</Link>
			<Link
				href="/course/list/result"
				className=" w-max h-max px-3 py-2 rounded-md font-bold text-white text-center bg-blue-600 ml-5">
				VIEW RESULT
			</Link>
		</div>
	);
};

export default Homepage;
