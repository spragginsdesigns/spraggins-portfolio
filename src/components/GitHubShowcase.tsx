"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
	FaGithub,
	FaStar,
	FaCodeBranch,
	FaExclamationCircle,
	FaUserFriends,
	FaBook,
	FaLink
} from "react-icons/fa";
import Image from "next/image";

const fetchGitHubData = async () => {
	const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	try {
		const [userResponse, reposResponse] = await Promise.all([
			axios.get("https://api.github.com/users/spragginsdesigns", { headers }),
			axios.get(
				"https://api.github.com/users/spragginsdesigns/repos?sort=updated&per_page=10",
				{ headers }
			)
		]);
		return { user: userResponse.data, repos: reposResponse.data };
	} catch (error) {
		console.error("GitHub API Error:", error);
		throw error;
	}
};

const GitHubShowcase: React.FC = () => {
	const [data, setData] = useState<{ user: any; repos: any[] } | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchGitHubData()
			.then(setData)
			.catch((err) => {
				console.error("Error fetching GitHub data:", err);
				if (err.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					setError(
						`GitHub API error: ${err.response.status} ${err.response.statusText}`
					);
				} else if (err.request) {
					// The request was made but no response was received
					setError("Network error. Please check your internet connection.");
				} else {
					// Something happened in setting up the request that triggered an Error
					setError("An unexpected error occurred.");
				}
			})
			.finally(() => setIsLoading(false));
	}, []);

	if (!data) return null;

	const { user, repos } = data;

	return (
		<section id="github" className="bg-background text-foreground py-20">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-bold mb-12 text-center">
					My GitHub Activity
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<motion.div
						className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg shadow-xl lg:col-span-1"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex flex-col items-center mb-6">
							<Image
								src={user.avatar_url}
								alt="GitHub Avatar"
								width={120}
								height={120}
								className="rounded-full mb-4"
							/>
							<h3 className="text-2xl font-bold">{user.name}</h3>
							<p className="text-primary text-lg">@{user.login}</p>
						</div>
						<p className="mb-6 text-center">{user.bio}</p>
						<div className="grid grid-cols-3 gap-4 text-center mb-6">
							<div>
								<FaUserFriends className="inline-block text-2xl text-primary mb-2" />
								<p className="font-bold">{user.followers}</p>
								<p className="text-sm">Followers</p>
							</div>
							<div>
								<FaUserFriends className="inline-block text-2xl text-primary mb-2" />
								<p className="font-bold">{user.following}</p>
								<p className="text-sm">Following</p>
							</div>
							<div>
								<FaBook className="inline-block text-2xl text-primary mb-2" />
								<p className="font-bold">{user.public_repos}</p>
								<p className="text-sm">Repositories</p>
							</div>
						</div>
					</motion.div>
					<motion.div
						className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg shadow-xl lg:col-span-2"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h4 className="text-xl font-semibold mb-4 text-center">Contribution Activity</h4>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="https://ghchart.rshah.org/26a641/spragginsdesigns"
							alt="GitHub contribution graph for spragginsdesigns"
							className="w-full h-auto"
							loading="lazy"
						/>
					</motion.div>
					{repos.map((repo, index) => (
						<motion.div
							key={repo.id}
							className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg shadow-xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<h4 className="text-xl font-semibold mb-2">{repo.name}</h4>
							<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
								{repo.description || "No description available"}
							</p>
							<div className="flex justify-between text-sm mb-4">
								<span className="flex items-center">
									<FaStar className="mr-1 text-yellow-500" />
									{repo.stargazers_count}
								</span>
								<span className="flex items-center">
									<FaCodeBranch className="mr-1 text-green-500" />
									{repo.forks_count}
								</span>
								<span className="flex items-center">
									<FaExclamationCircle className="mr-1 text-red-500" />
									{repo.open_issues_count}
								</span>
							</div>
							<a
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-primary hover:underline"
							>
								<FaLink className="mr-1" /> View Repository
							</a>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default GitHubShowcase;
