"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CourseUpdateForm from "@/components/CourseUpdateForm";

const UpdateCourse = ({
	params,
}: {
	params: { school_id: string; course_id: string };
}) => {
	const [loading, setLoading] = useState(false);

	const pageRouter = useRouter();

	const handleFormSubmit: any = async (course: any) => {
		setLoading(true);

		try {
			const res = await axios.post(
				`http://localhost:4000/course/update/${params.course_id}`,
				course,
			);

			if (res.statusText == "OK") {
				pageRouter.push(`/course/list/${params.school_id}/view`);
			}
		} catch (error) {
			console.error("Error updating course", error);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="p-4 overflow-y-scroll w-[95%] sm:w-[80%] md:w-[60%] min-h-[80vh] block mx-auto">
			<h2 className=" mt-4 text-center text-xl text-gray-700 font-bold">
				Register Course
			</h2>
			<CourseUpdateForm
				schoolId={params.school_id}
				courseId={params.course_id}
				onSubmit={handleFormSubmit}
				loading={loading}
			/>
		</div>
	);
};

export default UpdateCourse;
