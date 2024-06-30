export function extractTime(dateString) {
;
	const date = new Date(dateString);


	const year = date.getFullYear();
	const month = padZero(date.getMonth() + 1); // Months are 0-indexed in JavaScript
	const day = padZero(date.getDate());
	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());

	const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

	return formattedDateTime;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
	return number.toString().padStart(2, "0");
}
