"use client";
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";

interface Result {
	id: number;
	studentName: string;
	objectiveScore: number;
	theoryScore: number;
	totalScore: number;
	feedback: string;
}

const Results = () => {
	const [results, setResults] = useState<Result[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [resultsFound, setResultsFound] = useState<boolean>(true);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [subject, setSubject] = useState<string>("");
	const [courseCode, setCourseCode] = useState<string>("");
	const [year, setYear] = useState<string>("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setShowToast(false);
		if (!subject || !courseCode || !year) {
			setShowToast(true);
			return;
		}
		setResultsFound(true);
		setLoading(true);
		setError(null);

		try {
			const response = await axios.get("http://localhost:4000/results", {
				params: { subject, courseCode, year },
			});
			setResults(response.data);

			if (response.data.length < 1) setResultsFound(false);
		} catch (error) {
			console.error("Error fetching results:", error);
			setError("Failed to load results. refresh page to try again");
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	const fetchResults = async () => {
	// 		try {
	// 			const response = await axios.get("http://localhost:4000/api/results");
	// 			setResults(response.data);
	// 			setLoading(false);
	// 		} catch (error) {
	// 			console.error("Error fetching results:", error);
	// 			setError("Failed to load results.");
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchResults();
	// }, []);

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
			{showToast && (
				<p
					id="toast"
					className=" text-center mt-4 font-mono text-sm text-red-400">
					fill all form fields.
				</p>
			)}
			<form onSubmit={handleSubmit}>
				<div className="flex items-center justify-center mt-4">
					<input
						type="text"
						placeholder="Subject"
						className=" me-5 border-[1px] text-center border-gray-300 rounded"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Course Code"
						className=" mx-5 border-[1px] text-center border-gray-300 rounded"
						value={courseCode}
						onChange={(e) => setCourseCode(e.target.value)}
					/>
					<input
						type="number"
						placeholder="Year"
						className=" ms-5 border-[1px] text-center border-gray-300 rounded"
						value={year}
						onChange={(e) => setYear(e.target.value)}
					/>
				</div>

				<button
					className=" block mx-auto text-sm  mt-5 rounded-lg bg-black border-[1px] border-black text-white font-semibold text-center px-8 py-[2px] hover:bg-white hover:border-black hover:border-[1px] hover:text-black"
					type="submit">
					Fetch Results
				</button>
			</form>

			{!resultsFound ? (
				<p className=" text-center mt-16 font-sans text-lg text-red-400">
					No results available
				</p>
			) : (
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
								<td className=" px-2">{result.id}</td>
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
