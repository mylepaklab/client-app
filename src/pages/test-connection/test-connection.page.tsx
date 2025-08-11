import { useState } from "react";
import { api } from "~/lib/axios";

export function TestConnectionPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	const testConnection = async () => {
		setIsLoading(true);
		setError(null);
		setResponse(null);

		try {
			const result = await api.get(
				"/translate_string?text_to_translate=I%20am%20Ann"
			);
			setResponse(result);
		} catch (err: any) {
			setError(err.message || "Failed to connect to API");
			console.error("API Error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8">
			<div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
				<h1 className="text-2xl font-bold text-center mb-8 text-charcoal">
					Test API Connection
				</h1>

				<div className="text-center mb-8">
					<button
						onClick={testConnection}
						disabled={isLoading}
						className="bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isLoading ? "Testing..." : "Test Translation API"}
					</button>
				</div>

				<div className="space-y-4">
					{error && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
							<h3 className="font-semibold text-red-800 mb-2">Error:</h3>
							<p className="text-red-700">{error}</p>
						</div>
					)}

					{response && (
						<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
							<h3 className="font-semibold text-green-800 mb-2">Response:</h3>
							<pre className="text-sm text-green-700 whitespace-pre-wrap overflow-x-auto">
								{JSON.stringify(response, null, 2)}
							</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
