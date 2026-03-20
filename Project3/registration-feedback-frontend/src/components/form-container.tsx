"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, FieldLabel } from "@/components/ui/field";

interface QueryResult {
	type: "registration" | "feedback";
	response: string;
}

const AWS_INVOKE_URL_REGISTRATION =
	"https://jyrqimnhxc.execute-api.ap-south-1.amazonaws.com/dev-test/test"; // Replace with the invoke URL for registration
const AWS_INVOKE_URL_FEEDBACK =
	"https://jyrqimnhxc.execute-api.ap-south-1.amazonaws.com/dev-test/feedback"; // Replace with the invoke URL for feedback
export default function FormContainer() {
	const [registrationData, setRegistrationData] = useState({
		name: "",
		email: "",
		studentId: "",
		branchYear: "",
	});

	const [feedbackData, setFeedbackData] = useState({
		feedbackType: "",
		feedbackText: "",
		name: "",
	});

	const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

	const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRegistrationData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFeedbackChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFeedbackData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRegistrationSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const result = await fetch(AWS_INVOKE_URL_REGISTRATION, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registrationData),
			});

			const responseText = await result.text();
			setQueryResult({
				type: "registration",
				response: result.ok
					? responseText || "Registration submitted successfully."
					: `Request failed (${result.status}): ${responseText || "No response body"}`,
			});
		} catch (error) {
			console.error("Error submitting registration:", error);
			setQueryResult({
				type: "registration",
				response:
					"Unable to submit registration. Check browser network logs for details.",
			});
		}

		setRegistrationData({ name: "", email: "", studentId: "", branchYear: "" });
	};

	const handleFeedbackSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const result = await fetch(AWS_INVOKE_URL_FEEDBACK, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(feedbackData),
			});

			const responseText = await result.text();
			setQueryResult({
				type: "feedback",
				response: responseText || "Feedback submitted successfully.",
			});
		} catch (error) {
			console.error("Error submitting feedback:", error);
			setQueryResult({
				type: "feedback",
				response:
					"Unable to submit feedback. Check browser network logs for CORS details.",
			});
		}

		setFeedbackData({ feedbackType: "", feedbackText: "", name: "" });
	};

	return (
		<div className="mx-auto max-w-4xl space-y-8">
			<div className="grid gap-6 md:grid-cols-2">
				{/* Student Registration Form */}
				<Card className="w-[500px]">
					<CardHeader>
						<CardTitle>Student Registration</CardTitle>
						<CardDescription>Register as a new student</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleRegistrationSubmit} className="space-y-4">
							<FieldGroup>
								<FieldLabel>Full Name</FieldLabel>
								<Input
									type="text"
									name="name"
									placeholder="Enter your full name"
									value={registrationData.name}
									onChange={handleRegistrationChange}
									required
								/>
							</FieldGroup>

							<FieldGroup>
								<FieldLabel>Email Address</FieldLabel>
								<Input
									type="email"
									name="email"
									placeholder="Enter your email"
									value={registrationData.email}
									onChange={handleRegistrationChange}
									required
								/>
							</FieldGroup>

							<FieldGroup>
								<FieldLabel>Student ID</FieldLabel>
								<Input
									type="text"
									name="studentId"
									placeholder="Enter your student ID"
									value={registrationData.studentId}
									onChange={handleRegistrationChange}
									required
								/>
							</FieldGroup>

							<FieldGroup>
								<FieldLabel>Branch / Year</FieldLabel>
								<Input
									type="text"
									name="branchYear"
									placeholder="Enter your branch and year"
									value={registrationData.branchYear}
									onChange={handleRegistrationChange}
									required
								/>
							</FieldGroup>

							<Button type="submit" className="w-full">
								Register
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Student Feedback Form */}
				<Card className="w-[500px]">
					<CardHeader>
						<CardTitle>Student Feedback</CardTitle>
						<CardDescription>Share your feedback with us</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleFeedbackSubmit} className="space-y-4">
							<FieldGroup>
								<FieldLabel>Name</FieldLabel>
								<Input
									type="text"
									name="name"
									placeholder="Enter your name (optional)"
									value={feedbackData.name || ""}
									onChange={handleFeedbackChange}
								/>
							</FieldGroup>
							<FieldGroup>
								<FieldLabel>Feedback Type</FieldLabel>
								<Input
									type="text"
									name="feedbackType"
									placeholder="e.g., Course, Service, Faculty"
									value={feedbackData.feedbackType}
									onChange={handleFeedbackChange}
									required
								/>
							</FieldGroup>

							<FieldGroup>
								<FieldLabel>Feedback</FieldLabel>
								<Textarea
									name="feedbackText"
									placeholder="Enter your feedback here..."
									value={feedbackData.feedbackText}
									onChange={handleFeedbackChange}
									className="min-h-32 resize-none"
									required
								/>
							</FieldGroup>

							<Button type="submit" className="w-full">
								Submit Feedback
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>

			{/* Query Result Display */}
			{queryResult && (
				<Card className="border-primary bg-primary/5">
					<CardHeader>
						<CardTitle>Query Result</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid gap-2">
								<p className="text-sm font-medium text-muted-foreground">
									Submission Type
								</p>
								<p className="text-lg font-semibold capitalize">
									{queryResult.type}
								</p>
							</div>

							{queryResult.type === "registration" && (
								<div className="space-y-3">
									<div className="grid gap-2">
										<p className="text-sm font-medium text-muted-foreground">
											Registration
										</p>
										<p className="text-base">{queryResult.response}</p>
									</div>
								</div>
							)}

							{queryResult.type === "feedback" && (
								<div className="space-y-3">
									<div className="grid gap-2">
										<p className="text-sm font-medium text-muted-foreground">
											Feedback
										</p>
										<p className="text-base">{queryResult.response}</p>
									</div>
								</div>
							)}

							{/* <div className="border-t pt-3">
        <p className="text-xs text-muted-foreground">
        Submitted at: {queryResult.timestamp}
        </p>
        </div> */}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
