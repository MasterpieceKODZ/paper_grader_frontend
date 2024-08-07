import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Paper Grader",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className=" m-0">
			<body className={`${inter.className}, m-0 overflow-x-hidden`}>
				<>
					<div className=" w-screen px-4 py-1 flex items-center justify-between">
						<p className=" py-0 font-mono font-semibold text-gray-700 text-2xl mx-5 my-2">
							<Link href="/">PAPER GRADER</Link>
						</p>
						{/* <div className=" w-max h-max flex items-center justify-center pr-5">
							<p className=" py-0 font-mono font-semibold text-blue-500 mr-5 my-2">
								<Link href="/upload">UPLOAD ANSWERS</Link>
							</p>
							<p className=" py-0 font-mono font-semibold text-blue-500 ml-5 my-2">
								<Link href="/results">VIEW RESULTS</Link>
							</p>
						</div> */}
					</div>
				</>
				{children}
			</body>
		</html>
	);
}
