import React, { useState, useEffect } from "react";

// interface CourseFormProps {
// 	selectedCourse: any;
// 	onSubmit: (course: any) => void;
// 	loading: boolean;
// }

const CourseForm = ({ onSubmit, loading }) => {
	const [name, setName] = useState("");
	const [courseCode, setCourseCode] = useState("");
	const [objectiveQuestions, setObjectiveQuestions] = useState([]);
	const [theoryQuestions, setTheoryQuestions] = useState([]);
	const [isObjectiveEnabled, setIsObjectiveEnabled] = useState(false);
	const [isTheoryEnabled, setIsTheoryEnabled] = useState(false);

	// useEffect(() => {
	// 	if (selectedCourse) {
	// 		setName(selectedCourse.name);
	// 		setCourseCode(selectedCourse.course_code);
	// 		setObjectiveQuestions(
	// 			Object.entries(selectedCourse.objective_question_and_answer || {}).map(
	// 				([question, answer]) => ({ question, answer }),
	// 			),
	// 		);
	// 		setTheoryQuestions(
	// 			Object.entries(selectedCourse.theory_question_and_answer || {}).map(
	// 				([, { question, rubric }]) => ({
	// 					question,
	// 					rubric,
	// 				}),
	// 			),
	// 		);
	// 		setIsObjectiveEnabled(
	// 			Object.keys(selectedCourse.objective_question_and_answer || {}).length >
	// 				0,
	// 		);
	// 		setIsTheoryEnabled(
	// 			Object.keys(selectedCourse.theory_question_and_answer || {}).length > 0,
	// 		);
	// 	} else {
	// 		setName("");
	// 		setCourseCode("");
	// 		setObjectiveQuestions([]);
	// 		setTheoryQuestions([]);
	// 		setIsObjectiveEnabled(false);
	// 		setIsTheoryEnabled(false);
	// 	}
	// }, [selectedCourse]);

	const handleAddObjectiveQuestion = () => {
		setObjectiveQuestions([
			...objectiveQuestions,
			{ question: "", answer: "" },
		]);
	};

	const handleRemoveObjectiveQuestion = (index) => {
		setObjectiveQuestions(objectiveQuestions.filter((_, i) => i !== index));
	};

	const handleAddTheoryQuestion = () => {
		setTheoryQuestions([
			...theoryQuestions,
			{ question: "", rubric: { full_mark: "", half_mark: "", no_mark: "" } },
		]);
	};

	const handleRemoveTheoryQuestion = (index) => {
		setTheoryQuestions(theoryQuestions.filter((_, i) => i !== index));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const course = {
			name,
			course_code: courseCode.toUpperCase(),
			objective_question_and_answer: Object.fromEntries(
				objectiveQuestions.map(({ question, answer }) => [question, answer]),
			),
			theory_question_and_answer: Object.fromEntries(
				theoryQuestions.map(({ question, rubric }, index) => [
					index.toString(),
					{ question, rubric },
				]),
			),
		};
		// if (selectedCourse) {
		// 	course._id = selectedCourse._id; // Ensure the _id is passed for updating
		// }
		onSubmit(course);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<label className="block font-medium">Course Name</label>
					<input
						type="text"
						className="mt-1 block w-full border border-gray-300 p-2"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label className="block font-medium">Course Code</label>
					<input
						type="text"
						className="mt-1 block w-full border border-gray-300 p-2"
						value={courseCode}
						onChange={(e) => setCourseCode(e.target.value)}
						required
					/>
				</div>
				<div>
					<label className="block font-medium mt-3">OBJECTIVE QUESTIONS</label>
					<button
						type="button"
						className="text-blue-500 underline"
						onClick={() => setIsObjectiveEnabled(!isObjectiveEnabled)}>
						{isObjectiveEnabled ? "Hide" : "Show"}
					</button>
					{isObjectiveEnabled && (
						<div>
							{objectiveQuestions.map((item, index) => (
								<div
									key={index}
									className="flex space-x-2">
									<input
										type="text"
										className="mt-1 block w-full border border-gray-300 p-2"
										placeholder="Question"
										value={item.question}
										onChange={(e) =>
											setObjectiveQuestions(
												objectiveQuestions.map((q, i) =>
													i === index ? { ...q, question: e.target.value } : q,
												),
											)
										}
									/>
									<input
										type="text"
										className="mt-1 block w-full border border-gray-300 p-2"
										placeholder="Answer"
										value={item.answer}
										onChange={(e) =>
											setObjectiveQuestions(
												objectiveQuestions.map((q, i) =>
													i === index ? { ...q, answer: e.target.value } : q,
												),
											)
										}
									/>
									<button
										type="button"
										className="text-red-500 underline"
										onClick={() => handleRemoveObjectiveQuestion(index)}>
										Remove
									</button>
								</div>
							))}
							<button
								type="button"
								className="text-blue-500 mt-2 font-bold"
								onClick={handleAddObjectiveQuestion}>
								Add Objective Question
							</button>
						</div>
					)}
				</div>
				<div>
					<label className="block font-medium mt-4">THEORY QUESTIONS</label>
					<button
						type="button"
						className="text-blue-500 underline"
						onClick={() => setIsTheoryEnabled(!isTheoryEnabled)}>
						{isTheoryEnabled ? "Hide" : "Show"}
					</button>
					{isTheoryEnabled && (
						<div>
							{theoryQuestions.map((item, index) => (
								<div
									key={index}
									className="space-y-2">
									<div className="flex space-x-2 items-center">
										<input
											type="text"
											className="mt-1 block w-full border border-gray-300 p-2"
											placeholder="Question"
											value={item.question}
											onChange={(e) =>
												setTheoryQuestions(
													theoryQuestions.map((q, i) =>
														i === index
															? { ...q, question: e.target.value }
															: q,
													),
												)
											}
										/>
										<button
											type="button"
											className="text-red-500 underline"
											onClick={() => handleRemoveTheoryQuestion(index)}>
											Remove
										</button>
									</div>
									<div className="pl-8">
										<div className="flex space-x-2">
											<label className="block font-medium w-24">
												Full Mark
											</label>
											<input
												type="text"
												className="mt-1 block w-full border border-gray-300 p-2"
												value={item.rubric.full_mark}
												onChange={(e) =>
													setTheoryQuestions(
														theoryQuestions.map((q, i) =>
															i === index
																? {
																		...q,
																		rubric: {
																			...q.rubric,
																			full_mark: e.target.value,
																		},
																  }
																: q,
														),
													)
												}
											/>
										</div>
										<div className="flex space-x-2">
											<label className="block font-medium w-24">
												Half Mark
											</label>
											<input
												type="text"
												className="mt-1 block w-full border border-gray-300 p-2"
												value={item.rubric.half_mark}
												onChange={(e) =>
													setTheoryQuestions(
														theoryQuestions.map((q, i) =>
															i === index
																? {
																		...q,
																		rubric: {
																			...q.rubric,
																			half_mark: e.target.value,
																		},
																  }
																: q,
														),
													)
												}
											/>
										</div>
										<div className="flex space-x-2">
											<label className="block font-medium w-24">No Mark</label>
											<input
												type="text"
												className="mt-1 block w-full border border-gray-300 p-2"
												value={item.rubric.no_mark}
												onChange={(e) =>
													setTheoryQuestions(
														theoryQuestions.map((q, i) =>
															i === index
																? {
																		...q,
																		rubric: {
																			...q.rubric,
																			no_mark: e.target.value,
																		},
																  }
																: q,
														),
													)
												}
											/>
										</div>
									</div>
								</div>
							))}
							<button
								type="button"
								className="text-blue-500 font-bold mt-2"
								onClick={handleAddTheoryQuestion}>
								Add Theory Question
							</button>
						</div>
					)}
				</div>
				<div className="flex space-x-4">
					<button
						type="submit"
						className="px-6 py-1 mt-5 bg-blue-500 text-white rounded"
						disabled={loading}>
						{" "}
						Add
					</button>
					{loading && (
						<div className="spinner text-green-500 my-4">
							Upload in-progress...
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default CourseForm;
