"use client";

// pages/upload.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Course } from "@/type/Course";

async function fetchSavedExamAnswersStudent(course_code: string, date: string) {
	try {
		const response = await axios.post("http://localhost:4000/exam-answers", {
			course_code,
			date,
		});

		const svdStu = response.data.map((itm: any) => {
			return { student_name: itm.student_name, student_id: itm.student_id };
		});
		return svdStu;
	} catch (error) {
		return [];
	}
}

const UploadPage = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [examDate, setExamDate] = useState("");
	const [studentName, setStudentName] = useState("");
	const [studentId, setStudentId] = useState("");
	const [objectiveFile, setObjectiveFile] = useState<File>();
	const [theoryFiles, setTheoryFiles] = useState<FileList>();
	const [studentsUploaded, setStudentsUploaded] = useState<any[]>([]);
	const [showPopup, setShowPopup] = useState(false);
	const [showProceedBtn, setShowProceedBtn] = useState(true);
	const [message, setMessage] = useState(
		"are you sure there are no mistakes in the data provided?, close this popup to review or click proceed to continue",
	);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios
			.get("http://localhost:4000/course")
			.then((response) => setCourses(response.data))
			.catch((e) => {
				setCourses([]);
			});
	}, []);

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setFile: any,
		isOBJ: boolean,
	) => {
		if (isOBJ) setFile(e.target.files![0]);
		else setFile(e.target.files);
	};

	const resetFileInputs = () => {
		const objFileInput: any = document.getElementById("obj_files_inp");
		objFileInput.value = "";
		const theoryFileInp: any = document.getElementById("theory_files_inp");
		theoryFileInp.value = "";
	};

	const handleUpload = async () => {
		setShowPopup(false);
		setLoading(true);
		if (
			!selectedCourse ||
			!examDate ||
			!studentName ||
			!studentId ||
			!objectiveFile ||
			!theoryFiles
		) {
			setMessage("Please fill all fields and provide all necessary files.");
			setShowProceedBtn(false);
			setLoading(false);
			setShowPopup(true);
			return;
		}

		const formData = new FormData();
		formData.append("course_name", selectedCourse.name);
		formData.append("course_code", selectedCourse.course_code);
		formData.append("date", examDate);
		formData.append("student_name", studentName);
		formData.append("student_id", studentId);
		formData.append("objective_answers", objectiveFile);
		Array.from(theoryFiles).forEach((file) =>
			formData.append("theory_answers", file),
		);

		try {
			await axios.post("http://localhost:4000/upload-answers", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setMessage("Upload successful!");
			setShowProceedBtn(false);
			//setStudentsUploaded([...studentsUploaded, { studentName, studentId }]);
			setStudentId("");
			setStudentName("");
			resetFileInputs();

			const savedStudent = await fetchSavedExamAnswersStudent(
				selectedCourse.course_code,
				examDate,
			);
			setStudentsUploaded(savedStudent);
		} catch (error) {
			setMessage("Upload failed, please try again.");
			setShowProceedBtn(false);
		} finally {
			setLoading(false);
			setShowPopup(true);
		}
	};

	return (
		<div className="min-w-[100%]">
			<div className="p-8 sm:w-[80%] sm:max-w-[650px] block mx-auto">
				<h1 className="text-2xl font-bold text-center mb-10">
					Upload Student Answer Papers
				</h1>
				<div className="mb-4 mt-4">
					<label>Course</label>
					<select
						value={selectedCourse?.course_code}
						onChange={(e) => {
							let selectCourse: Course | null = null;

							for (const crs of courses) {
								if (crs.course_code == e.target.value) {
									selectCourse = crs;
								}
							}

							setSelectedCourse(selectCourse);

							setTimeout(() => {
								if (examDate) {
									fetchSavedExamAnswersStudent(
										selectCourse!.course_code,
										examDate,
									).then((res) => setStudentsUploaded(res));
								}
							}, 100);
						}}
						className="border p-2 rounded w-full">
						<option value="">Select a course</option>
						{courses.map((course: Course) => (
							<option
								key={course._id}
								value={course.course_code}
								className=" mt-2 font-semibold">
								{course.course_code}
							</option>
						))}
					</select>
				</div>
				<div className="mb-4">
					<label>Exam Date</label>
					<input
						type="date"
						value={examDate}
						onChange={(e) => {
							// update saved students list
							if (selectedCourse) {
								fetchSavedExamAnswersStudent(
									selectedCourse.course_code,
									examDate,
								).then((res) => setStudentsUploaded(res));
							}
							setExamDate(e.target.value);
						}}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div className="mb-4">
					<label>Student Name</label>
					<input
						type="text"
						value={studentName}
						onChange={(e) => setStudentName(e.target.value)}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div className="mb-4">
					<label>Student ID</label>
					<input
						type="text"
						value={studentId}
						onChange={(e) => setStudentId(e.target.value)}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div className="mb-4">
					<label>Objective Answer Sheet</label>
					<input
						id="obj_files_inp"
						type="file"
						onChange={(e) => handleFileChange(e, setObjectiveFile, true)}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div className="mb-4">
					<label>Theory Answer Sheets</label>
					<input
						id="theory_files_inp"
						type="file"
						multiple
						onChange={(e) => handleFileChange(e, setTheoryFiles, false)}
						className="border p-2 rounded w-full"
					/>
				</div>
				<button
					onClick={() => {
						setShowPopup(true);
						setShowProceedBtn(true);
					}}
					className="bg-blue-500 text-white px-4 py-[2px] rounded">
					Save
				</button>

				{showPopup && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
						<div className="bg-white w-[90%] sm:max-w-[80%]  p-4 rounded shadow">
							<p className=" text-center my-6 font-mono">{message}</p>
							<button
								onClick={() => {
									setMessage(
										"are you sure there are no mistakes in the data provided?, close this popup to review or click proceed to continue",
									);
									setShowProceedBtn(true);
									setShowPopup(false);
								}}
								className="mr-4 ms-3 text-red-600">
								Close
							</button>
							{showProceedBtn && (
								<button
									onClick={handleUpload}
									className="bg-green-500 text-white px-4 py-1 ms-5 rounded">
									Proceed
								</button>
							)}
						</div>
					</div>
				)}

				{loading && (
					<p className=" my-4 font-mono text-green-500">Loading...</p>
				)}

				<div className="mt-4">
					<h2 className="text-xl font-bold mb-2">Uploaded Students</h2>
					<ul>
						{studentsUploaded.map((student) => (
							<li key={student.studentId}>
								{student.studentName} ({student.studentId})
							</li>
						))}
					</ul>
				</div>
				<button
					onClick={() => {
						axios.post("http://localhost:4000/grade-exam");
					}} // Replace with actual function
					className="bg-red-500 text-white p-2 rounded mt-4">
					Initiate Grading
				</button>
			</div>
		</div>
	);
};

export default UploadPage;
