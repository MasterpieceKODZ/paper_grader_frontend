"use client";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Course } from "@/type/Course";
import Link from "next/link";
import { headers } from "next/headers";

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const day = String(date.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

const CourseList = ({
	params,
}: {
	params: { action: string; school_id: string };
}) => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [courseFound, setCourseFound] = useState("loading");
	const [selectedCourseCode, setSelectedCourse] = useState("");
	const [examsByCourse, setExamsByCourse] = useState<any>([]);
	const [fetchExamsError, setFetchExamsError] = useState("");
	const [showCourseExams, setShowCourseExams] = useState(false);
	const [fetchingExams, setfetchingExams] = useState(false);

	function fetchExamsByCourse() {
		setShowCourseExams(false);
		setfetchingExams(true);
		if (selectedCourseCode) {
			axios
				.post(
					"http://localhost:4000/course/exams",
					{
						school_id: params.school_id,
						course_code: selectedCourseCode,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				)
				.then((res) => {
					setExamsByCourse(res.data);
					setfetchingExams(false);
					setShowCourseExams(true);
				})
				.catch((err) => {
					setfetchingExams(false);
					setFetchExamsError("unable to fetch course exams.");
				});
		}
	}

	const updateCoursesState = async () => {
		try {
			const response = await axios.post(
				"http://localhost:4000/course/get-all-by-school",
				{ school_id: params.school_id },
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			setCourses(response.data);
			if (response.data.length > 0) setCourseFound("yes");
			else setCourseFound("no");
		} catch (error) {
			console.error("Error fetching courses", error);
			setCourseFound("no");
		}
	};

	updateCoursesState();

	useEffect(() => {
		if (selectedCourseCode && examsByCourse.length < 1) {
			fetchExamsByCourse();
		}
	}, [selectedCourseCode]);

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
				<p className=" w-[95%] text-gray-400 font-mono text-xl text-left px-3 my-4">
					Fetching Registered Courses...
				</p>
			)}
			{courseFound == "no" && (
				<p className=" w-[95%] text-gray-400 font-mono text-xl text-left px-3">
					No course found, click the add button to register a course.
				</p>
			)}

			{fetchExamsError && (
				<p className=" w-[95%] my-4 font-mono text-xl text-left px-3 text-orange-600">
					{fetchExamsError}
				</p>
			)}
			{fetchingExams && (
				<p className=" w-[95%] my-4 font-mono text-xl text-left px-3 text-blue-400">
					fetching coures exams...
				</p>
			)}

			<ul className="space-y-2">
				{courses.map((course: Course) => {
					if (params.action == "result") {
						return (
							<Fragment key={course._id}>
								<li
									className="p-2 bg-white border cursor-pointer hover:bg-gray-100 my-1 w-[95%] sm:w-[60%] h-max block"
									onClick={() => {
										if (examsByCourse.length > 0) {
											setShowCourseExams(true);
										} else {
											setSelectedCourse(course.course_code);
										}
									}}>
									{course.name} ({course.course_code})
								</li>
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
			{showCourseExams && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white w-[95%] h-[85vh] sm:max-w-[80%]  p-4 rounded shadow grid grid-rows-[auto_1fr]">
						<div className=" w-[100%] h-max px-3 py-1 flex justify-end items-center">
							<button
								onClick={() => setShowCourseExams(false)}
								className="bg-red-600 text-white px-3 py-1 ms-5 rounded">
								close
							</button>
						</div>
						<div className=" max-h-[100%] w-[100%] px-2 overflow-y-auto overflow-x-hidden">
							<p className=" text-center mt-3 mb-1 font-semibold">
								SELECT AN EXAMINATION
							</p>
							{examsByCourse.map((examItm: any, examIdx: any) => (
								<Link
									key={examIdx}
									className=" my-3 "
									href={`/results/${
										params.school_id
									}/${selectedCourseCode}/${formatDate(examItm.date)}`}
									passHref>
									<p className="text-left text-blue-600 cursor-pointer">
										{" "}
										{examItm.course_name} {"("}
										{examItm.course_code}
										{")"}
										{" - "}
										{formatDate(examItm.date)}
									</p>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CourseList;
