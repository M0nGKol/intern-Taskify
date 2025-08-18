"use client";

import { useEffect, useState } from "react";

export function useDashboardDateTime() {
	const [currentDate, setCurrentDate] = useState("");
	const [greeting, setGreeting] = useState("");

	const getCurrentDate = () => {
		const now = new Date();
		const options: Intl.DateTimeFormatOptions = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return now.toLocaleDateString("en-US", options);
	};

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 17) return "Good Afternoon";
		return "Good Evening";
	};

	useEffect(() => {
		const update = () => {
			setCurrentDate(getCurrentDate());
			setGreeting(getGreeting());
		};
		update();
		const id = setInterval(update, 60000);
		return () => clearInterval(id);
	}, []);

	return { currentDate, greeting };
}