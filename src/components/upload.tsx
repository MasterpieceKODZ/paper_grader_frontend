"use client";

import { ChangeEvent, useState } from "react";
import axios from "axios";
import Link from "next/link";

const UploadFiles = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [message, setMessage] = useState<string>("");
	const [subject, setSubject] = useState<string>("");
	const [courseCode, setCourseCode] = useState<string>("");
	const [year, setYear] = useState<string>("");

	const [messageType, setMessageType] = useState<"success" | "error">(
		"success",
	);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(Array.from(e.target.files));
		}
	};

	const handleGradeMultiChoice = async () => {
		setMessage("");

		if (files.length === 0 || !subject || !courseCode || !year) {
			setMessage("Please fill in all fields and select files to upload.");
			return;
		}

		const formData = new FormData();
		files.forEach((file) => {
			formData.append("files", file);
		});
		formData.append("subject", subject);
		formData.append("courseCode", courseCode);
		formData.append("year", year);

		try {
			const response = await axios.post(
				"http://localhost:4000/upload/multiple-choice",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			setMessageType("success");
			setMessage("File uploaded successfully(s)!");

			// Handle response as needed
		} catch (error) {
			console.error("Error uploading file(s):", error);
			setMessage("Failed to upload file(s).");
		}
	};

	const handleGradeEssay = async () => {
		setMessage("");

		if (files.length === 0 || !subject || !courseCode || !year) {
			setMessage("Please fill in all fields and select files to upload.");
			return;
		}

		const formData = new FormData();
		files.forEach((file) => {
			formData.append("files", file);
		});
		formData.append("subject", subject);
		formData.append("courseCode", courseCode);
		formData.append("year", year);

		try {
			const response = await axios.post(
				"http://localhost:4000/upload/multiple-choice",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			setMessageType("success");
			setMessage("File uploaded successfully(s)!");

			// Handle response as needed
		} catch (error) {
			console.error("Error uploading file(s):", error);
			setMessage("Failed to upload file(s).");
		}
	};

	return (
		<div>
			<h2 className=" text-center text-gray-500 font-serif text-2xl font-light">
				Upload Answer Booklets
			</h2>
			<form>
				<input
					type="text"
					placeholder="Subject"
					className=" block mx-auto border-[1px] text-center min-h-8 mt-12 border-gray-300 rounded"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="Course Code"
					className=" block mx-auto border-[1px] text-center min-h-8 mt-4 border-gray-300 rounded"
					value={courseCode}
					onChange={(e) => setCourseCode(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="Year"
					className=" block mx-auto border-[1px] text-center min-h-8 mt-4 border-gray-300 rounded"
					value={year}
					onChange={(e) => setYear(e.target.value)}
					required
				/>
				<input
					type="file"
					className=" block mx-auto border-[1px] text-center min-h-8 mt-4 border-gray-300 rounded"
					multiple
					onChange={handleFileChange}
					required
				/>
				<div
					onClick={handleGradeMultiChoice}
					className=" flex items-center justify-center">
					<button
						type="button"
						className=" block mx-auto mt-16 me-10 rounded-lg bg-gray-500 border-2 border-gray-500 text-white font-bold text-center px-10 py-1 hover:bg-white hover:border-gray-500 hover:border-2 hover:text-gray-500">
						Grade Multiple-Choice
					</button>
					<button
						type="button"
						onClick={handleGradeEssay}
						className=" block mx-auto mt-16 ms-10 rounded-lg bg-black border-2 border-black text-white font-bold text-center px-10 py-1 hover:bg-white hover:border-black hover:border-2 hover:text-black">
						Grade Essay
					</button>
				</div>
			</form>
			<Link
				href="/results"
				className=" font-bold text-black block mx-auto mt-14 w-max">
				Fetch Results
			</Link>
			{message && (
				<p
					className={` ${
						messageType == "error" ? "text-red-700" : "text-green-600"
					} font-mono text-center mt-20 text-sm`}>
					{message}
				</p>
			)}
		</div>
	);
};

export default UploadFiles;
