"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
	const [StSchoolName, setSchoolName] = useState("");
	const [schools, setSchools] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const router = useRouter();

	useEffect(() => {
		updateSchoolsState();
	}, []);

	async function updateSchoolsState() {
		try {
			const schoolsResponse = await axios.get(
				"http://localhost:4000/school/get-all",
			);
			setSchools(schoolsResponse.data);
		} catch (error) {
			setSchools([]);
		}
	}

	async function handleSaveSchoolToDB(schoolName: string) {
		setLoading(true);

		try {
			await axios.post(
				"http://localhost:4000/school/add-new",
				{ schoolName },
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			await updateSchoolsState();
		} catch (error) {
			setLoading(false);
			setFailed(true);
			setTimeout(() => {
				setFailed(false);
			}, 2000);
		}
		setLoading(false);
	}
	return (
		<main className="min-h-screen w-screen">
			<div className=" w-screen min-h-max py-5 px-5">
				<div className="min-w-[100%]">
					<div className="p-8 sm:w-[80%] sm:max-w-[650px] block mx-auto">
						<div className="mb-4">
							<h2 className="text-xl text-center font-bold">Add School</h2>
							<input
								type="text"
								placeholder="School Name"
								value={StSchoolName}
								onChange={(e) => {
									setSchoolName(e.target.value);
								}}
								className="border p-2 rounded w-full mt-8"
							/>
							{loading ? (
								<button
									type="button"
									className="bg-green-500 text-white px-4 py-1 rounded mt-4">
									Processing...
								</button>
							) : (
								<button
									type="button"
									onClick={() => {
										handleSaveSchoolToDB(StSchoolName);
									}} // Replace with actual function
									className="bg-blue-500 text-white px-4 py-1 rounded mt-4">
									Save
								</button>
							)}
							{failed && (
								<p className=" font-mono text-left text-red-500 mt-3 ">
									school registration failed.
								</p>
							)}
						</div>
					</div>
					{schools.length > 0 && (
						<div className="p-8 sm:w-[80%] sm:max-w-[650px] block mx-auto">
							<h2 className="text-xl text-center font-bold mb-4">
								Select School
							</h2>
							<ul className="space-y-2 mt-12">
								{schools.map((sch) => (
									<li
										key={sch._id}
										className="p-2 bg-white border flex w-full items-center justify-between">
										<p
											className=" cursor-pointer"
											onClick={() => router.push(`/dashboard/${sch._id}`)}>
											{sch.school_name}
										</p>
										<button
											className=" text-red-600 font-mono"
											onClick={() => {
												axios
													.post("http://localhost:4000/school/delete", {
														id: sch._id,
													})
													.then((res) => {
														updateSchoolsState();
													})
													.catch((err) => {
														console.log("delete school error");
														console.log(err);
													});
											}}>
											del
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
