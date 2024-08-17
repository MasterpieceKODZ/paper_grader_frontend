"use client";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Course } from "@/type/Course";
import Link from "next/link";

const CourseList = ({
	params,
}: {
	params: { action: string; school_id: string };
}) => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [courseFound, setCourseFound] = useState("loading");

	const API_URL = "http://localhost:4000/course"; // External API URL

	useEffect(() => {
		updateCoursesState();
	}, []);

	const updateCoursesState = async () => {
		try {
			const response = await axios.get(API_URL);
			setCourses(response.data);
			if (response.data.length > 0) setCourseFound("yes");
			else setCourseFound("no");
		} catch (error) {
			console.error("Error fetching courses", error);
			setCourseFound("no");
		}
	};
	return (
		<div className=" w-[95%] sm:max-w-[70%] block mx-auto">
			<div className=" w-[100%] h-max py-2 px-3 flex mt-4 justify-between">
				<h2 className="text-xl font-bold mb-4">Registered Courses</h2>
				{params.action != "result" && (
					<Link
						href={`/course/add_new/${params.school_id}`}
						className=" bg-blue-600 w-max h-max py-1 text-white font-bold text-center px-4 rounded">
						Add Course
					</Link>
				)}
			</div>
			{courseFound == "loading" && (
				<p className=" w-[95%] text-gray-400 font-mono text-xl text-left px-3">
					Fetching Registered Courses...
				</p>
			)}
			{courseFound == "no" && (
				<p className=" w-[95%] text-gray-400 font-mono text-xl text-left px-3">
					No course found, click the add button to register a course.
				</p>
			)}

			<ul className="space-y-2">
				{courses.map((course: Course) => {
					if (params.action == "result") {
						return (
							<Fragment key={course._id}>
								<Link
									href={`/results/${params.school_id}/${course.course_code}`}
									className=" my-1 w-[95%] sm:w-[60%] h-max block">
									<li className="p-2 bg-white border cursor-pointer hover:bg-gray-100">
										{course.name} ({course.course_code})
									</li>
								</Link>
							</Fragment>
						);
					}

					return (
						<li
							key={course._id}
							className="p-2 bg-white border cursor-pointer hover:bg-gray-100">
							{course.name} ({course.course_code})
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default CourseList;
