"use client";

import axios from "axios";
import { useState } from "react";
import CourseForm from "@/components/CourseForm";
import { useRouter } from "next/navigation";

const AddCourse = ({ params }: { params: { school_id: string } }) => {
	const [loading, setLoading] = useState(false);

	const API_URL = "http://localhost:4000/course"; // External API URL

	const pageRouter = useRouter();

	const handleFormSubmit = async (course: any) => {
		setLoading(true);

		try {
			const res = await axios.post(API_URL, course);

			if (res.statusText == "Created") {
				pageRouter.push(`/course/list/${params.school_id}/view`);
			}
		} catch (error) {
			console.error("Error saving course", error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="p-4 overflow-y-scroll w-[95%] sm:w-[80%] md:w-[60%] min-h-[80vh] block mx-auto">
			<h2 className=" mt-4 text-center text-xl text-gray-700 font-bold">
				Register Course
			</h2>
			<CourseForm
				schoolId={params.school_id}
				onSubmit={handleFormSubmit}
				loading={loading}
			/>
		</div>
	);
};

export default AddCourse;