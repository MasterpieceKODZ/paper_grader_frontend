"use client";
import UploadFiles from "@/components/upload";

export default function UploadAnswer({
	params,
}: {
	params: { school_id: string };
}) {
	return (
		<main className="min-h-screen w-screen">
			<div className=" w-screen min-h-max py-5 px-5">
				<UploadFiles schoolId={params.school_id} />
			</div>
		</main>
	);
}
