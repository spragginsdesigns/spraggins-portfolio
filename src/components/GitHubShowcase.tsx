"use client";
import React from "react";
import { useQuery } from "react-query";
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
	const token = "GITHUB_TOKEN";
	const headers = { Authorization: `Bearer ${token}` };
	try {
		const { data: user } = await axios.get(
			"https://api.github.com/users/spragginsdesigns",
			{ headers }
		);
		const { data: repos } = await axios.get(
			"https://api.github.com/users/spragginsdesigns/repos?sort=updated&per_page=6",
			{ headers }
		);
		return { user, repos };
	} catch (error) {
		console.error("GitHub API Error:", error);
		throw error;
	}
};

const GitHubShowcase: React.FC = () => {
	const { data, isLoading, isError } = useQuery("githubData", fetchGitHubData);

	if (isLoading)
		return (
			<div className="text-center py-20">
				<motion.div
					className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				></motion.div>
			</div>
		);
	if (isError)
		return (
			<div className="text-center py-20 text-red-500">
				<FaExclamationCircle className="inline-block text-4xl mb-4" />
				<p>Error fetching GitHub data. Please try again later.</p>
			</div>
		);

	const { user, repos } = data!;

	return (
		<section id="github" className="bg-surface text-text py-20">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-heading font-bold mb-12 text-center">
					My GitHub Activity
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<motion.div
						className="bg-background p-6 rounded-lg shadow-xl lg:col-span-1"
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
								<p className="text-sm">Repos</p>
							</div>
						</div>
						<a
							href={user.html_url}
							target="_blank"
							rel="noopener noreferrer"
							className="block w-full text-center bg-primary text-background px-6 py-3 rounded-full hover:bg-opacity-80 transition-colors"
						>
							<FaGithub className="inline-block mr-2" /> View Profile
						</a>
					</motion.div>
					<div className="lg:col-span-2">
						<h3 className="text-2xl font-bold mb-6">Recent Repositories</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{repos.map((repo: any, index: number) => (
								<motion.div
									key={repo.id}
									className="bg-background p-6 rounded-lg shadow-md"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
								>
									<h4 className="text-xl font-semibold mb-2">{repo.name}</h4>
									<p className="text-sm text-text-secondary mb-4 h-12 overflow-hidden">
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
				</div>
			</div>
		</section>
	);
};

export default GitHubShowcase;
