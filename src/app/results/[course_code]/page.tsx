"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Result {
	id: number;
	studentName: string;
	studentId: string;
	objectiveScore: number;
	theoryScore: number;
	totalScore: number;
	feedback: string;
}

const Results = ({ params }: { params: { course_code: string } }) => {
	const [results, setResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	//const [resultsFound, setResultsFound] = useState<boolean>(false);
	// const [showToast, setShowToast] = useState<boolean>(false);
	// const [subject, setSubject] = useState<string>("");
	// const [courseCode, setCourseCode] = useState<string>("");
	// const [year, setYear] = useState<string>("");

	useEffect(() => {
		setLoading(true);

		if (results.length < 1) {
			axios
				.get("http://localhost:4000/results", {
					params: { courseCode: params.course_code },
				})
				.then((res) => {
					setResults(res.data);
				})
				.catch((error) => {
					console.error("Error fetching results:", error);
					setError("Failed to load results. refresh page to try again");
				})
				.finally(() => {
					setLoading(false);
				});
		}
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
			<h2 className=" text-center text-gray-500 font-serif text-2xl font-light">
				View Results
			</h2>
			{/* {showToast && (
				<p
					id="toast"
					className=" text-center mt-4 font-mono text-sm text-red-400">
					fill all form fields.
				</p>
			)} */}

			{results.length > 0 && (
				<table className=" block mx-auto w-max mt-14">
					<thead>
						<tr>
							<th className=" px-2">ID</th>
							<th className=" px-2">Student Name</th>
							<th className=" px-2">Objective Score</th>
							<th className=" px-2">Theory Score</th>
							<th className=" px-2">Total Score</th>
							<th className=" px-2">Feedback</th>
						</tr>
					</thead>
					<tbody>
						{results.map((result) => (
							<tr key={result.id}>
								<td className=" px-2">{result.studentId}</td>
								<td className=" px-2">{result.studentName}</td>
								<td className=" px-2">{result.objectiveScore}</td>
								<td className=" px-2">{result.theoryScore}</td>
								<td className=" px-2">{result.totalScore}</td>
								<td className=" px-2">{result.feedback}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Results;
