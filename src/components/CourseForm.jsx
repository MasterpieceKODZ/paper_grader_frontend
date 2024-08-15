import axios from "axios";
import React, { useEffect, useState } from "react";

const CourseForm = ({ schoolId, onSubmit, loading }) => {
	const [fetchSchoolError, setFetchSchoolError] = useState(false);
	const [schoolName, setSchoolName] = useState("");
	const [name, setName] = useState("");
	const [courseCode, setCourseCode] = useState("");
	const [objectiveQuestions, setObjectiveQuestions] = useState([]);
	const [theoryQuestions, setTheoryQuestions] = useState([]);
	const [isObjectiveEnabled, setIsObjectiveEnabled] = useState(false);
	const [isTheoryEnabled, setIsTheoryEnabled] = useState(false);

	useEffect(() => {
		axios
			.post(
				"http://localhost:4000/school/get-by-id",
				{ _id: schoolId },
				{ headers: { "Content-Type": "application/json" } },
			)
			.then((res) => {
				setSchoolName(res.data.school_name);
				setFetchSchoolError(false);
			})
			.catch((err) => {
				setFetchSchoolError(true);
			});
	}, []);

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
			{ question: "", rubric: "", context: [""], marks: 10 },
		]);
	};

	const handleRemoveTheoryQuestion = (index) => {
		setTheoryQuestions(theoryQuestions.filter((_, i) => i !== index));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const course = {
			school_name: schoolName,
			name,
			course_code: courseCode.toUpperCase(),
			objective_question_and_answer: Object.fromEntries(
				objectiveQuestions.map(({ question, answer }) => [question, answer]),
			),
			theory_question_and_answer: Object.fromEntries(
				theoryQuestions.map(({ question, rubric, context, marks }, index) => [
					(index + 1).toString(),
					{ question, rubric, context, marks },
				]),
			),
		};

		onSubmit(course);
	};

	return (
		<div>
			{fetchSchoolError && (
				<h2 className=" mt-5 text-center text-red-400 text-xl">
					Unable to retrieve school name, refresh page to try again.
				</h2>
			)}
			{!fetchSchoolError && (
				<form onSubmit={handleSubmit}>
					<div className=" mt-8">
						<label className="block font-medium">Course Name</label>
						<input
							type="text"
							className="mt-1 block w-full border border-gray-300 p-2"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="mt-5">
						<label className="block font-medium">Course Code</label>
						<input
							type="text"
							className="mt-1 block w-full border border-gray-300 p-2"
							value={courseCode}
							onChange={(e) => setCourseCode(e.target.value)}
							required
						/>
					</div>
					<div className="mt-8">
						<label className="block font-medium mt-3">
							MULTIPLE-CHOICE QUESTIONS
						</label>
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
														i === index
															? { ...q, question: e.target.value }
															: q,
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
														i === index
															? { ...q, answer: e.target.value.toUpperCase() }
															: q,
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
									Add Multiple-Choice Question
								</button>
							</div>
						)}
					</div>
					<div className="mt-8">
						<label className="block font-medium mt-4">ESSAY QUESTIONS</label>
						<button
							type="button"
							className="text-blue-500 underline"
							onClick={() => setIsTheoryEnabled(!isTheoryEnabled)}>
							{isTheoryEnabled ? "Hide" : "Show"}
						</button>
						{isTheoryEnabled && (
							<div>
								<ol>
									{theoryQuestions.map((item, index) => (
										<li key={index}>
											<div className="space-y-2 mt-10">
												{/* theory question */}
												<div className="flex space-x-2 items-center mt-3">
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
												{/* marks */}
												<div className="pl-8 mt-3">
													<p className=" block my-2 text-sm text-left font-semibold mt-4">
														Total Marks
													</p>
													<input
														type="number"
														className="mt-1 block w-full border border-gray-300 p-2"
														placeholder="10"
														value={item.marks}
														onChange={(e) =>
															setTheoryQuestions(
																theoryQuestions.map((q, i) =>
																	i === index
																		? { ...q, marks: e.target.value }
																		: q,
																),
															)
														}
													/>
												</div>
												{/* poss answers */}
												<div className="pl-8">
													<p className=" block mb-2 text-sm text-left font-semibold mt-4">
														Context
													</p>
													{item?.context?.map((contextItem, contextIdx) => (
														<div
															key={contextIdx}
															className=" flex justify-between items-center w-full">
															<textarea
																type="text"
																rows={1}
																className="mt-1 block border border-gray-300 p-2 w-[85%]"
																value={contextItem}
																placeholder={`context ${contextIdx + 1}`}
																onChange={(e) =>
																	setTheoryQuestions(
																		theoryQuestions.map((q, i) =>
																			i === index
																				? {
																						...q,
																						context: q.context.map((it, idx) =>
																							idx == contextIdx
																								? e.currentTarget.value
																								: it,
																						),
																				  }
																				: q,
																		),
																	)
																}
															/>
															<button
																type="button"
																className=" block text-red-700 font-mono text-center bg-transparent font-semibold me-3"
																onClick={() => {
																	setTheoryQuestions(
																		theoryQuestions.map((q, i) =>
																			i === index
																				? {
																						...q,
																						context: q.context.filter(
																							(_, inx) => inx !== contextIdx,
																						),
																				  }
																				: q,
																		),
																	);
																}}>
																del
															</button>
														</div>
													))}

													<button
														type="button"
														className=" block py-[2px] px-4 font-semibold bg-blue-400 text-gray-800 text-sm text-center mt-2 rounded-md"
														onClick={() => {
															setTheoryQuestions(
																theoryQuestions.map((q, i) =>
																	i === index
																		? {
																				...q,
																				context: [...q.context, ""],
																		  }
																		: q,
																),
															);
														}}>
														Add Context
													</button>
												</div>
												{/* rubric */}
												<div className="pl-8">
													<p className=" block mb-2  mt-5 text-sm text-left font-semibold">
														Add Grading Rubric
													</p>
													<textarea
														type="text"
														className="mt-1 block w-full border border-gray-300 p-2"
														value={item.rubric}
														rows={4}
														onChange={(e) =>
															setTheoryQuestions(
																theoryQuestions.map((q, i) =>
																	i === index
																		? { ...q, rubric: e.target.value }
																		: q,
																),
															)
														}
													/>
												</div>
											</div>
										</li>
									))}
								</ol>

								<button
									type="button"
									className="text-blue-500 font-bold mt-2"
									onClick={handleAddTheoryQuestion}>
									Add Essay Question
								</button>
							</div>
						)}
					</div>
					<div className="flex space-x-4">
						<button
							type="submit"
							className="px-6 py-1 mt-5 bg-blue-500  text-white rounded"
							disabled={loading}>
							{" "}
							Complete Registration
						</button>
						{loading && (
							<div className="spinner text-green-500 my-4">
								Upload in-progress...
							</div>
						)}
					</div>
				</form>
			)}
		</div>
	);
};

export default CourseForm;
