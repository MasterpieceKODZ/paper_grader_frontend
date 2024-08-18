"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface ExamData {
	school_id: string;
	course_name: string;
	course_code: string;
	date: Date;
	grading_status: "in-progress" | "done" | "none";
	candidates: {
		student_name: string;
		student_id: string;
		objective_answers: {};
		objective_score: number;
		theory_answers: [];
		theory_grade_summary: [
			{
				question: string;
				answer: string;
				mark: number;
				reason: string;
			},
		];
		theory_score: number;
	}[];
}

const Results = ({
	params,
}: {
	params: { school_id: string; course_code: string };
}) => {
	const [examData, setExamData] = useState<ExamData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedStudentName, setSelectedStudentName] = useState("");
	const [theorySummary, setTheorySummary] = useState<any[]>([]);
	const [showTheorySummary, setShowTheorySummary] = useState(false);

	let intervalCount = 1;

	useEffect(() => {
		setLoading(true);

		axios
			.post("http://localhost:4000/results", {
				schoolId: params.school_id,
				courseCode: params.course_code,
			})
			.then((res) => {
				setError(null);

				if (res.data.grading_status == "in-progress") {
					const intervalId = setInterval(() => {
						axios
							.post("http://localhost:4000/results", {
								schoolId: params.school_id,
								courseCode: params.course_code,
							})
							.then((intRes) => {
								setError(null);
								if (intRes.data.grading_status == "done") {
									setExamData(intRes.data);
									setLoading(false);
									clearInterval(intervalId);
								}
							})
							.catch((error) => {
								console.error("Error fetching results:", error);
								setError("Failed to load results. refresh page to try again");
								setLoading(false);
								clearInterval(intervalId);
							});

						intervalCount++;

						setTimeout(() => {
							setLoading(false);
							if (!examData) {
								setError(
									"Unable to fectch results, refresh this page to try again.",
								);
							}
						}, 120000);
					}, 1000);
				} else {
					setExamData(res.data);
					setLoading(false);
				}
			})
			.catch((error) => {
				console.error("Error fetching results:", error);
				setError("Failed to load results. refresh page to try again");
				setLoading(false);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className=" text-center mt-12 font-mono text-sm text-blue-700">
				Loading results...
			</div>
		);
	}

	if (error) {
		return (
			<div className=" text-center mt-12 font-mono text-sm text-red-700">
				{error}
			</div>
		);
	}

	return (
		<div>
			{examData != null && examData.grading_status == "in-progress" ? (
				<div className=" text-center mt-12 font-mono text-sm text-blue-700">
					Grading in-progress, please wait...
				</div>
			) : (
				""
			)}
			{examData != null &&
			examData.grading_status == "done" &&
			examData.candidates.length > 0 ? (
				<h2 className=" text-center text-gray-500 font-serif text-2xl font-light">
					<span>{examData.course_name}</span>
					<span> - {examData.course_code} Results</span>
				</h2>
			) : (
				""
			)}

			{examData != null &&
			examData.grading_status == "done" &&
			examData.candidates.length > 0 ? (
				<table className=" block mx-auto w-max mt-14">
					<thead>
						<tr>
							<th className=" px-2">ID</th>
							<th className=" px-2">Student Name</th>
							<th className=" px-2">Objective Score</th>
							<th className=" px-2">Theory Score</th>
							<th className=" px-2">Total Score</th>
						</tr>
					</thead>
					<tbody>
						{examData.candidates.map((result) => (
							<tr key={result.student_id}>
								<td className=" px-2">{result.student_id}</td>
								<td
									className=" px-2 text-blue-500 cursor-pointer"
									onClick={() => {
										setSelectedStudentName(result.student_name);
										setTheorySummary(result.theory_grade_summary);
										setShowTheorySummary(true);
									}}>
									{result.student_name}
								</td>
								<td className=" px-2">{result.objective_score}</td>
								<td className=" px-2">{result.theory_score}</td>
								<td className=" px-2">
									{result.theory_score + result.objective_score}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				""
			)}

			{showTheorySummary && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white w-[95%] h-[85vh] sm:max-w-[80%]  p-4 rounded shadow grid grid-rows-[auto_1fr]">
						<div className=" w-[100%] h-max px-3 py-1 flex justify-end items-center">
							<button
								onClick={() => setShowTheorySummary(false)}
								className="bg-red-600 text-white px-3 py-1 ms-5 rounded">
								close
							</button>
						</div>
						<div className=" max-h-[100%] w-[100%] px-2 overflow-y-auto overflow-x-hidden">
							<p className=" text-center mt-3 mb-1 font-semibold">
								ESSAY QUESTIONS GRADE SUMMARY
							</p>
							<p className=" text-center mb-3 font-semibold">
								{selectedStudentName}
							</p>
							{theorySummary.map((theSumItm, theSumIdx) => (
								<div
									key={theSumIdx}
									className=" h-max w-[100%] my-5">
									<p className=" text-left font-semibold text-[14px] mt-3 mb-1">
										Question {"  "} {theSumIdx + 1}
									</p>
									<p className=" text-left text-[12px]">{theSumItm.question}</p>
									<p className=" text-left font-semibold text-[14px] mt-3 mb-1">
										Answer
									</p>
									<p className=" text-left text-[12px]">{theSumItm.answer}</p>
									<p className=" text-left font-semibold text-[14px] mt-3 mb-1">
										Mark
									</p>
									<p className=" text-left text-[12px]">{theSumItm.mark}</p>
									<p className=" text-left font-semibold text-[14px] mt-3 mb-1">
										Comment
									</p>
									<p className=" text-left text-[12px]">{theSumItm.reason}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Results;
